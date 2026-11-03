"use client";

// Kod faqat o'quvchining brauzerida, alohida Web Worker ichida ishlaydi: sahifa qotib qolmaydi,
// cheksiz sikl esa vaqt tugaganda worker'ni to'xtatish bilan uziladi.

import type { RunLang } from "@/lib/playground";

export type { RunLang };
export type Output =
  | { kind: "out" | "err" | "info" | "in"; text: string }
  | { kind: "table"; columns: string[]; rows: unknown[][] }
  | { kind: "test"; name: string; ok: boolean; error?: string }
  /** C dasturi yaratgan/o'zgartirgan fayl: matn yoki boshidagi baytlar (hex); size -1 - o'chirildi. */
  | { kind: "file"; name: string; size: number; text: string | null; hex?: string | null };

// "full" tarqatma: npm paketida qo'shimcha paketlar (micropip, sqlite3, numpy...) wheel fayllari yo'q.
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
const SQLJS = "https://cdn.jsdelivr.net/npm/sql.js@1.15.2/dist/";

export const LANG_LABEL: Record<RunLang, string> = {
  python: "Python",
  sql: "SQL (SQLite)",
  js: "JavaScript",
  ts: "TypeScript",
  c: "C",
  html: "HTML",
  go: "Go",
};
/** Til haqida qisqa eslatma (sarlavhada). */
export const LANG_NOTE: Partial<Record<RunLang, string>> = {
  c: "32-bit muhit: pointer va long 4 bayt (odatiy 64-bit kompyuterda 8 bayt)",
  go: "Kod rasmiy Go Playground'ga (go.dev, Google) yuboriladi va u yerda ishlaydi",
};
/** Birinchi yuklashdagi yozuv. */
export const LOADING_LABEL: Record<RunLang, string> = {
  python: "Python runtime",
  sql: "SQLite",
  js: "JavaScript",
  ts: "TypeScript",
  c: "C kompilyatori (clang, ~23 MB)",
  html: "Sahifa",
  go: "Go Playground",
};
// C: vaqt kompilyatsiyani ham o'z ichiga oladi. HTML iframe'da ishlaydi, chegarasi playground.tsx da.
const LIMIT_MS: Record<Exclude<RunLang, "html">, number> = { python: 15000, sql: 5000, js: 5000, ts: 5000, c: 10000, go: 20000 };

// console.log formati (worker va HTML ko'prigi uchun bitta): primitivlar String() bilan (NaN, undefined, 10n),
// obyektlar JSON ko'rinishida (BigInt ichida bo'lsa ham).
const FMT = `const fmt = (v) => {
  if (typeof v === "string") return v;
  if (typeof v === "bigint") return v + "n";
  if (v === null || (typeof v !== "object" && typeof v !== "function")) return String(v);
  if (v instanceof Error) return String(v.stack || v);
  try { return JSON.stringify(v, (k, x) => (typeof x === "bigint" ? x + "n" : x), 2) ?? String(v); } catch { return String(v); }
};`;

const JS_WORKER = `
${FMT}
const send = (kind) => (...a) => postMessage({ type: "out", out: { kind, text: a.map(fmt).join(" ") } });
const console = { log: send("out"), info: send("out"), debug: send("out"), warn: send("err"), error: send("err"), table: send("out") };
const pending = [];
// Testlar uchun: check("nom", () => shart). Shart xato bersa yoki false bo'lsa - test o'tmadi.
const check = (name, fn) => pending.push((async () => {
  try { postMessage({ type: "out", out: { kind: "test", name, ok: Boolean(await fn()) } }); }
  catch (err) { postMessage({ type: "out", out: { kind: "test", name, ok: false, error: String(err && err.message || err) } }); }
})());
// Kutilayotgan setTimeout'lar: kod tugagach ham ular bajarilib bo'lguncha natija yopilmaydi (vaqt chegarasi baribir bor).
const live = new Set();
let idle = () => {};
const report = (err) => postMessage({ type: "out", out: { kind: "err", text: String((err && err.stack) || err) } });
const nativeSet = setTimeout.bind(self), nativeClear = clearTimeout.bind(self);
self.setTimeout = (fn, ms, ...args) => {
  const id = nativeSet(() => {
    live.delete(id);
    try { if (typeof fn === "function") fn(...args); } catch (err) { report(err); }
    if (!live.size) idle();
  }, ms);
  live.add(id);
  return id;
};
self.clearTimeout = (id) => { live.delete(id); nativeClear(id); if (!live.size) idle(); };
self.addEventListener("unhandledrejection", (e) => report("Ushlanmagan xato (Promise): " + ((e.reason && e.reason.message) || e.reason)));
self.onmessage = async (e) => {
  try {
    const exports = {};
    const require = (m) => { throw new Error("import/require bu yerda ishlamaydi: " + m); };
    await new Function("console", "exports", "require", "check", '"use strict"; return (async () => {\\n' + e.data.code + '\\n})()')(console, exports, require, check);
    await Promise.all(pending);
    if (live.size) await new Promise((resolve) => (idle = resolve));
    await Promise.all(pending);
  } catch (err) {
    postMessage({ type: "out", out: { kind: "err", text: err && err.stack ? String(err.stack).split("\\n    at new Function")[0] : String(err) } });
  }
  postMessage({ type: "done" });
};`;

const PY_WORKER = `
import { loadPyodide } from "${PYODIDE}pyodide.mjs";
const CHECK = \`
def check(name, fn):
    try:
        ok, err = bool(fn()), None
    except Exception as e:
        ok, err = False, f"{type(e).__name__}: {e}"
    _report(name, ok, err)
\`;
let py;
const ready = (async () => {
  py = await loadPyodide({ indexURL: "${PYODIDE}" });
  py.setStdout({ batched: (text) => postMessage({ type: "out", out: { kind: "out", text } }) });
  py.setStderr({ batched: (text) => postMessage({ type: "out", out: { kind: "err", text } }) });
  postMessage({ type: "ready" });
})();
self.onmessage = async (e) => {
  await ready;
  const ns = py.globals.get("dict")();
  // Blok - asosiy dastur: if __name__ == "__main__" ishlashi uchun.
  ns.set("__name__", "__main__");
  try {
    await py.loadPackagesFromImports(e.data.code);
    // Pyodide tarkibida yo'q, lekin sof Python paketlar PyPI'dan micropip bilan o'rnatiladi (Flask darslari uchun).
    const extra = /^\\s*(from|import)\\s+flask\\b/m.test(e.data.code) ? ["flask"] : [];
    if (extra.length) {
      await py.loadPackage("micropip");
      await py.pyimport("micropip").install(extra);
    }
    await py.runPythonAsync(e.data.code, { globals: ns });
    if (e.data.tests) {
      ns.set("_report", (name, ok, error) => postMessage({ type: "out", out: { kind: "test", name, ok, error: error ?? undefined } }));
      await py.runPythonAsync(CHECK, { globals: ns });
      await py.runPythonAsync(e.data.tests, { globals: ns });
    }
  } catch (err) {
    postMessage({ type: "out", out: { kind: "err", text: String(err.message || err) } });
  } finally {
    ns.destroy();
  }
  postMessage({ type: "done" });
};`;

const SQL_WORKER = `
importScripts("${SQLJS}sql-wasm.js");
const ready = initSqlJs({ locateFile: (f) => "${SQLJS}" + f }).then((SQL) => { postMessage({ type: "ready" }); return SQL; });
self.onmessage = async (e) => {
  const SQL = await ready;
  const db = new SQL.Database();
  try {
    const results = db.exec(e.data.code);
    for (const r of results) postMessage({ type: "out", out: { kind: "table", columns: r.columns, rows: r.values } });
    if (results.length === 0) postMessage({ type: "out", out: { kind: "info", text: "So'rov bajarildi, natija qaytarmadi." } });
  } catch (err) {
    postMessage({ type: "out", out: { kind: "err", text: String(err.message || err) } });
  } finally {
    db.close();
  }
  postMessage({ type: "done" });
};`;

type Kind = "js" | "python" | "sql" | "c";
type PlaygroundResponse = { Errors?: string; Events?: { Message: string; Kind: "stdout" | "stderr" }[] | null; VetErrors?: string; error?: string };
// C worker'i alohida fayl (public/c/worker.js): runtime.c va cs50.h ni o'sha papkadan oladi.
const SOURCES: Record<Kind, { src?: string; url?: string; module: boolean }> = {
  js: { src: JS_WORKER, module: false },
  python: { src: PY_WORKER, module: true },
  sql: { src: SQL_WORKER, module: false },
  c: { url: "/c/worker.js", module: true },
};

// Python, SQL va C runtime'i og'ir: bitta worker qayta ishlatiladi. JS har safar yangi worker'da.
type Runtime = { worker: Worker; ready: Promise<void>; loaded: boolean };
const cached = new Map<string, Runtime>();

function spawn(kind: Kind): Runtime {
  const { src, url: file, module } = SOURCES[kind];
  const url = file ?? URL.createObjectURL(new Blob([src!], { type: "text/javascript" }));
  const worker = new Worker(url, module ? { type: "module" } : undefined);
  const ready =
    kind === "js"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          const onMsg = (e: MessageEvent) => {
            if (e.data?.type === "fail") reject(new Error(e.data.message));
            if (e.data?.type !== "ready") return;
            worker.removeEventListener("message", onMsg);
            resolve();
          };
          worker.addEventListener("message", onMsg);
          worker.addEventListener("error", () => reject(new Error("Runtime yuklanmadi. Internet aloqasini tekshiring.")), { once: true });
        });
  const rt: Runtime = { worker, ready, loaded: kind === "js" };
  ready.then(() => (rt.loaded = true)).catch(() => {});
  return rt;
}

function acquire(kind: Kind) {
  if (kind === "js") return spawn("js");
  let w = cached.get(kind);
  if (!w) {
    w = spawn(kind);
    cached.set(kind, w);
  }
  return w;
}

/** TS tiplarini olib tashlash va export/import'ni oddiy JS'ga aylantirish (darsdagi kod ko'pincha `export` bilan). */
async function transpile(code: string, ts: boolean): Promise<string> {
  const { transform } = await import("sucrase");
  return transform(code, { transforms: ts ? ["typescript", "imports"] : ["imports"], disableESTransforms: true }).code;
}

export type RunHandle = { done: Promise<void>; stop: () => void };

/** Go: Web Worker emas, server route orqali rasmiy Go Playground (bufersiz stdin, testlar va argumentlar yo'q). */
function runGo(code: string, onOutput: (o: Output) => void, onLoading: (loading: boolean) => void): RunHandle {
  const ctrl = new AbortController();
  let reason = "";
  const abort = (why: string) => {
    reason = why;
    ctrl.abort();
  };
  const timer = setTimeout(() => abort(`To'xtatildi: ${LIMIT_MS.go / 1000} soniyadan ko'p kutildi.`), LIMIT_MS.go);
  const done = (async () => {
    onLoading(true);
    try {
      const res = await fetch("/api/go-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        signal: ctrl.signal,
      });
      onLoading(false);
      const data: PlaygroundResponse = await res.json().catch(() => ({}));
      if (!res.ok) return onOutput({ kind: "err", text: data.error ?? `Xato: ${res.status}` });
      if (data.Errors) return onOutput({ kind: "err", text: data.Errors });
      for (const e of data.Events ?? []) onOutput({ kind: e.Kind === "stderr" ? "err" : "out", text: e.Message });
      if (data.VetErrors) onOutput({ kind: "info", text: `go vet:\n${data.VetErrors}` });
    } catch {
      onLoading(false);
      onOutput({ kind: "err", text: reason || "Go Playground bilan aloqa bo'lmadi. Internet aloqasini tekshiring." });
    } finally {
      clearTimeout(timer);
    }
  })();
  return { done, stop: () => abort("Foydalanuvchi to'xtatdi.") };
}

/**
 * HTML bloki: sahifa sandbox'li iframe'da (srcdoc) ochiladi. Boshiga qo'yilgan ko'prik skripti console, xatolar va
 * check() test natijalarini ota sahifaga postMessage bilan yuboradi (token - shu ishga tushirishniki).
 * Testlar (```js test) sahifa yuklangandan keyin ishlaydi; "done" - testlar tugagach.
 */
export function htmlDocument(code: string, token: string, tests?: string): string {
  const bridge = `<script>(() => {
const T = ${JSON.stringify(token)};
const post = (o) => parent.postMessage(Object.assign({ __pg: T }, o), "*");
${FMT}
for (const [m, k] of [["log", "out"], ["info", "out"], ["debug", "out"], ["table", "out"], ["warn", "err"], ["error", "err"]])
  console[m] = (...a) => post({ type: "out", out: { kind: k, text: a.map(fmt).join(" ") } });
addEventListener("error", (e) => post({ type: "out", out: { kind: "err", text: String(e.message) + (e.lineno ? " (qator " + e.lineno + ")" : "") } }));
addEventListener("unhandledrejection", (e) => post({ type: "out", out: { kind: "err", text: "Ushlanmagan xato (Promise): " + String((e.reason && e.reason.message) || e.reason) } }));
const pending = [];
window.check = (name, fn) => pending.push((async () => {
  try { post({ type: "out", out: { kind: "test", name, ok: Boolean(await fn()) } }); }
  catch (err) { post({ type: "out", out: { kind: "test", name, ok: false, error: String((err && err.message) || err) } }); }
})());
window.__pgDone = async () => { await Promise.all(pending); post({ type: "done" }); };
})();<\/script>`;
  const run = tests
    ? `<script>addEventListener("load", async () => { try { await (async () => {\n${tests.replace(/<\/script/gi, "<\\/script")}\n})(); } catch (err) { console.error(String((err && err.message) || err)); } __pgDone(); });<\/script>`
    : `<script>addEventListener("load", () => setTimeout(__pgDone, 0));<\/script>`;
  // Ko'prik o'quvchining skriptlaridan oldin ishlashi kerak, lekin <!doctype> dan keyin (aks holda quirks mode).
  const doctype = code.match(/^\s*<!doctype[^>]*>/i)?.[0] ?? "";
  return doctype + bridge + "\n" + code.slice(doctype.length) + "\n" + run;
}

/**
 * Kodni ishga tushiradi. onOutput har bir chiqish bo'lagi uchun chaqiriladi,
 * onLoading - runtime birinchi marta yuklanayotganda.
 */
export function run(
  lang: Exclude<RunLang, "html">,
  code: string,
  onOutput: (o: Output) => void,
  onLoading: (loading: boolean) => void,
  extra: { tests?: string; stdin?: string; argv?: string[]; files?: { name: string; text: string }[] } = {},
): RunHandle {
  const { tests, stdin, argv, files } = extra;
  if (lang === "go") return runGo(code, onOutput, onLoading);
  const kind = lang === "ts" ? "js" : lang;
  let stop = () => {};
  const done = (async () => {
    let source = code;
    if (kind === "js") {
      try {
        // JS/TS'da testlar kod bilan bitta scope'da: o'quvchining funksiyalari testlarga ko'rinadi.
        source = await transpile(tests ? `${code}\n;\n${tests}` : code, lang === "ts");
      } catch (err) {
        onOutput({ kind: "err", text: `Sintaksis xatosi: ${(err as Error).message}` });
        return;
      }
    }
    const { worker, ready, loaded } = acquire(kind);
    const firstLoad = !loaded;
    if (firstLoad) onLoading(true);
    try {
      await ready;
    } catch (err) {
      cached.delete(kind);
      onOutput({ kind: "err", text: (err as Error).message });
      return;
    } finally {
      if (firstLoad) onLoading(false);
    }

    await new Promise<void>((resolve) => {
      const kill = (reason: string) => {
        worker.terminate();
        cached.delete(kind);
        onOutput({ kind: "err", text: reason });
        resolve();
      };
      const timer = setTimeout(() => kill(`To'xtatildi: ${LIMIT_MS[lang] / 1000} soniyadan ko'p ishladi (cheksiz sikl bo'lishi mumkin).`), LIMIT_MS[lang]);
      stop = () => {
        clearTimeout(timer);
        kill("Foydalanuvchi to'xtatdi.");
      };
      worker.onmessage = (e) => {
        if (e.data?.type === "out") onOutput(e.data.out);
        if (e.data?.type === "done") {
          clearTimeout(timer);
          if (kind === "js") worker.terminate();
          resolve();
        }
      };
      worker.postMessage({ code: source, tests: kind === "python" ? tests : undefined, stdin, argv, files });
    });
  })();
  return { done, stop: () => stop() };
}
