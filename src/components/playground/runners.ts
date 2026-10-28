"use client";

// Kod faqat o'quvchining brauzerida, alohida Web Worker ichida ishlaydi: sahifa qotib qolmaydi,
// cheksiz sikl esa vaqt tugaganda worker'ni to'xtatish bilan uziladi.

import type { RunLang } from "@/lib/playground";

export type { RunLang };
export type Output =
  | { kind: "out" | "err" | "info"; text: string }
  | { kind: "table"; columns: string[]; rows: unknown[][] };

const PYODIDE = "https://cdn.jsdelivr.net/npm/pyodide@314.0.7/";
const SQLJS = "https://cdn.jsdelivr.net/npm/sql.js@1.15.2/dist/";

export const LANG_LABEL: Record<RunLang, string> = { python: "Python", sql: "SQL (SQLite)", js: "JavaScript", ts: "TypeScript" };
const LIMIT_MS: Record<RunLang, number> = { python: 15000, sql: 5000, js: 5000, ts: 5000 };

const JS_WORKER = `
const fmt = (v) => typeof v === "string" ? v : (() => { try { return JSON.stringify(v, null, 2) ?? String(v); } catch { return String(v); } })();
const send = (kind) => (...a) => postMessage({ type: "out", out: { kind, text: a.map(fmt).join(" ") } });
const console = { log: send("out"), info: send("out"), debug: send("out"), warn: send("err"), error: send("err"), table: send("out") };
self.onmessage = async (e) => {
  try {
    const exports = {};
    const require = (m) => { throw new Error("import/require bu yerda ishlamaydi: " + m); };
    await new Function("console", "exports", "require", '"use strict"; return (async () => {\\n' + e.data.code + '\\n})()')(console, exports, require);
  } catch (err) {
    postMessage({ type: "out", out: { kind: "err", text: err && err.stack ? String(err.stack).split("\\n    at new Function")[0] : String(err) } });
  }
  postMessage({ type: "done" });
};`;

const PY_WORKER = `
import { loadPyodide } from "${PYODIDE}pyodide.mjs";
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
  try {
    await py.loadPackagesFromImports(e.data.code);
    await py.runPythonAsync(e.data.code, { globals: ns });
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

const SOURCES: Record<"js" | "python" | "sql", { src: string; module: boolean }> = {
  js: { src: JS_WORKER, module: false },
  python: { src: PY_WORKER, module: true },
  sql: { src: SQL_WORKER, module: false },
};

// Python va SQL runtime'i og'ir: bitta worker qayta ishlatiladi. JS har safar yangi worker'da.
type Runtime = { worker: Worker; ready: Promise<void>; loaded: boolean };
const cached = new Map<string, Runtime>();

function spawn(kind: "js" | "python" | "sql"): Runtime {
  const { src, module } = SOURCES[kind];
  const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
  const worker = new Worker(url, module ? { type: "module" } : undefined);
  const ready =
    kind === "js"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          const onMsg = (e: MessageEvent) => {
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

function acquire(kind: "js" | "python" | "sql") {
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

/**
 * Kodni ishga tushiradi. onOutput har bir chiqish bo'lagi uchun chaqiriladi,
 * onLoading - runtime birinchi marta yuklanayotganda.
 */
export function run(lang: RunLang, code: string, onOutput: (o: Output) => void, onLoading: (loading: boolean) => void): RunHandle {
  const kind = lang === "ts" ? "js" : lang;
  let stop = () => {};
  const done = (async () => {
    let source = code;
    if (kind === "js") {
      try {
        source = await transpile(code, lang === "ts");
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
      worker.postMessage({ code: source });
    });
  })();
  return { done, stop: () => stop() };
}
