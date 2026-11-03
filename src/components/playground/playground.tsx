"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Check, FlaskConical, Play, RotateCcw, Square, X } from "lucide-react";
import { LANG_LABEL, LANG_NOTE, LOADING_LABEL, htmlDocument, type Output, type RunHandle } from "./runners";
import { STDIN_LANGS, splitArgs, type PlaygroundSpec, type RunLang } from "@/lib/playground";
import { saveProgress, useProgress } from "@/lib/progress";

// Muharrir va runtime'lar faqat brauzerda va kerak bo'lganda yuklanadi.
const CodeEditor = dynamic(() => import("./editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => null,
});

type Props = PlaygroundSpec & {
  /** Testli mashq bo'lsa: o'quvchining kodi va natijasi shu dars progressida saqlanadi. */
  course: string;
  n: number;
  index: number;
};

type Mode = "run" | "test";
/** Ishga tushirish vaqtini o'lchash uchun (faqat hodisa ichida chaqiriladi). */
const now = () => performance.now();
type TestOutput = Extract<Output, { kind: "test" }>;

const NOTE_SHORT: Partial<Record<RunLang, string>> = { c: "32-bit", go: "go.dev'da ishlaydi" };

/** Darsdagi tahrirlanadigan va ishga tushiriladigan kod bloki; testlar bo'lsa - mashq. */
export function Playground({ lang, code: initial, tests, stdin, args, files, course, n, index }: Props) {
  const saved = useProgress(course)[n]?.exercises?.[index];
  const [draft, setDraft] = useState<string | null>(null);
  const code = draft ?? (tests ? saved?.code : undefined) ?? initial;
  const [output, setOutput] = useState<Output[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "running">("idle");
  const [mode, setMode] = useState<Mode>("run");
  const hasStdin = STDIN_LANGS.includes(lang);
  const [input, setInput] = useState(stdin ?? "");
  const [command, setCommand] = useState(args ?? "");
  const [fileTexts, setFileTexts] = useState(files ?? []);
  const handle = useRef<RunHandle | null>(null);
  // HTML: iframe'ga beriladigan hujjat va shu ishga tushirish tokeni (eski iframe xabarlari aralashmasin).
  const [page, setPage] = useState<{ doc: string; token: string } | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const pageOutput = useRef<((o: Output) => void) | null>(null);
  const pageDone = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!page) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.data?.__pg !== page.token) return;
      if (e.data.type === "out") pageOutput.current?.(e.data.out);
      if (e.data.type === "done") pageDone.current?.();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [page]);

  function edit(value: string) {
    setDraft(value);
    if (tests) saveProgress(course, n, { exercises: { [index]: { code: value, passed: saved?.passed ?? false } } });
  }

  /** HTML: sahifani iframe'da ochadi; konsol va test natijalari postMessage orqali keladi. */
  function startPage(m: Mode, push: (o: Output) => void): RunHandle {
    const token = Math.random().toString(36).slice(2);
    let finish = () => {};
    const done = new Promise<void>((resolve) => {
      // Sahifa "done" yubormasa (masalan, skript cheksiz siklda), 5 soniyadan keyin natija yakunlanadi.
      const timer = setTimeout(resolve, 5000);
      finish = () => {
        clearTimeout(timer);
        resolve();
      };
    });
    pageOutput.current = push;
    pageDone.current = finish;
    setPage({ doc: htmlDocument(code, token, m === "test" ? tests : undefined), token });
    return {
      done,
      stop: () => {
        setPage(null);
        finish();
      },
    };
  }

  async function start(m: Mode) {
    if (state !== "idle") return;
    const results: Output[] = [];
    setMode(m);
    setOutput([]);
    setState("running");
    const push = (o: Output) => {
      results.push(o);
      setOutput((prev) => [...(prev ?? []), o]);
    };
    // Vaqt runtime yuklanib bo'lgandan keyin hisoblanadi: birinchi yuklash natijaga qo'shilmaydi.
    let started = now();
    if (lang === "html") {
      handle.current = startPage(m, push);
      await finishRun(m, results, started);
      return;
    }
    const { run } = await import("./runners");
    handle.current = run(
      lang,
      code,
      push,
      (loading) => {
        if (!loading) started = now();
        setState(loading ? "loading" : "running");
      },
      {
        tests: m === "test" ? tests : undefined,
        stdin: hasStdin ? input : undefined,
        argv: args !== undefined ? splitArgs(command) : undefined,
        files: fileTexts,
      },
    );
    await finishRun(m, results, started);
  }

  async function finishRun(m: Mode, results: Output[], started: number) {
    await handle.current?.done;
    const ms = Math.round(now() - started);
    setOutput((prev) => [...(prev ?? []), { kind: "info", text: `${ms} ms` }]);
    if (m === "test") {
      const checks = results.filter((o): o is TestOutput => o.kind === "test");
      const passed = checks.length > 0 && checks.every((o) => o.ok);
      saveProgress(course, n, { exercises: { [index]: { code, passed: passed || (saved?.passed ?? false) } } });
    }
    handle.current = null;
    setState("idle");
  }

  const changed = code !== initial;
  const checks = output?.filter((o): o is TestOutput => o.kind === "test") ?? [];
  const okCount = checks.filter((c) => c.ok).length;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-rule bg-sheet" data-playground-root>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-3 py-2">
        <span className="text-xs font-medium text-muted">
          {LANG_LABEL[lang]}
          {LANG_NOTE[lang] && <span title={LANG_NOTE[lang]}> ({NOTE_SHORT[lang]})</span>}, {tests ? "mashq" : "tahrirlash mumkin"}
          {tests && saved?.passed ? ", bajarilgan" : ""}
        </span>
        <div className="flex items-center gap-2">
          {changed && state === "idle" && (
            <button
              type="button"
              onClick={() => edit(initial)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:text-ink"
            >
              <RotateCcw size={13} aria-hidden /> Asl holiga
            </button>
          )}
          {state !== "idle" ? (
            <button
              type="button"
              onClick={() => handle.current?.stop()}
              className="inline-flex items-center gap-1.5 rounded-md border border-rule px-3 py-1 text-sm font-medium hover:border-muted"
            >
              <Square size={12} fill="currentColor" aria-hidden /> To&apos;xtatish
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => start("run")}
                title={tests ? undefined : "Ctrl+Enter"}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium ${
                  tests ? "border border-rule hover:border-muted" : "bg-line text-white hover:brightness-110"
                }`}
              >
                <Play size={13} fill="currentColor" aria-hidden /> Ishga tushirish
              </button>
              {tests && (
                <button
                  type="button"
                  onClick={() => start("test")}
                  title="Ctrl+Enter"
                  className="inline-flex items-center gap-1.5 rounded-md bg-line px-3 py-1 text-sm font-medium text-white hover:brightness-110"
                >
                  <FlaskConical size={13} aria-hidden /> Tekshirish
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="min-h-[3rem]">
        <CodeEditor lang={lang} value={code} onChange={edit} onRun={() => start(tests ? "test" : "run")} />
        <noscript>
          <pre>{initial}</pre>
        </noscript>
      </div>

      {args !== undefined && (
        <label className="flex items-center gap-2 border-t border-rule px-3 py-2">
          <span className="shrink-0 text-xs font-medium text-muted">Buyruq qatori:</span>
          <span className="font-mono text-[0.8rem] text-muted" aria-hidden>
            $
          </span>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            spellCheck={false}
            aria-label="Buyruq qatori (argv)"
            className="w-full rounded-md border border-rule bg-paper px-2 py-1 font-mono text-[0.8rem] outline-none focus:border-muted"
          />
        </label>
      )}

      {fileTexts.map((f, k) => (
        <label key={f.name} className="block border-t border-rule px-3 py-2">
          <span className="text-xs font-medium text-muted">
            Fayl: <span className="font-mono">{f.name}</span>
          </span>
          <textarea
            value={f.text}
            onChange={(e) => setFileTexts((prev) => prev.map((x, j) => (j === k ? { ...x, text: e.target.value } : x)))}
            rows={Math.min(8, Math.max(2, f.text.split("\n").length))}
            spellCheck={false}
            className="mt-1 block w-full resize-y rounded-md border border-rule bg-paper px-2 py-1 font-mono text-[0.8rem] outline-none focus:border-muted"
          />
        </label>
      ))}

      {hasStdin && (stdin !== undefined || (args === undefined && !files?.length)) && (
        <label className="block border-t border-rule px-3 py-2">
          <span className="text-xs font-medium text-muted">Kirish (stdin): har qator - dastur o&apos;qiydigan bitta javob</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={Math.min(6, Math.max(2, input.split("\n").length))}
            spellCheck={false}
            className="mt-1 block w-full resize-y rounded-md border border-rule bg-paper px-2 py-1 font-mono text-[0.8rem] outline-none focus:border-muted"
          />
        </label>
      )}

      {page && (
        <div className="h-64 resize-y overflow-hidden border-t border-rule bg-white">
          {/* allow-same-origin yo'q: sahifa saytning cookie/localStorage'iga tega olmaydi. */}
          <iframe
            ref={frame}
            key={page.token}
            srcDoc={page.doc}
            sandbox="allow-scripts allow-modals allow-forms"
            title="Natija sahifasi"
            className="block h-full w-full"
          />
        </div>
      )}

      {(output || state !== "idle") && (
        <div role="log" aria-live="polite" className="border-t border-rule bg-paper px-3 py-2.5 font-mono text-[0.8rem] leading-relaxed">
          {state === "loading" && <p className="text-muted">{LOADING_LABEL[lang]} yuklanmoqda (faqat birinchi marta)...</p>}
          {state === "running" && output?.length === 0 && <p className="text-muted">Ishlamoqda...</p>}
          {mode === "test" && state === "idle" && (
            <p
              className={`mb-1 font-sans text-sm font-semibold ${
                checks.length && okCount === checks.length ? "text-done" : "text-warn"
              }`}
            >
              {checks.length === 0
                ? "Testlar ishlamadi: kod xato bilan tugadi."
                : okCount === checks.length
                  ? `Hamma ${checks.length} ta test o'tdi.`
                  : `${okCount} / ${checks.length} test o'tdi.`}
            </p>
          )}
          {output?.map((o, i) => {
            if (o.kind === "test")
              return (
                <p key={i} className={`m-0 flex gap-1.5 ${o.ok ? "text-done" : "text-warn"}`}>
                  {o.ok ? (
                    <Check size={14} className="mt-0.5 shrink-0" aria-label="o'tdi" />
                  ) : (
                    <X size={14} className="mt-0.5 shrink-0" aria-label="o'tmadi" />
                  )}
                  <span>
                    {o.name}
                    {o.error && <span className="text-muted"> - {o.error}</span>}
                  </span>
                </p>
              );
            if (o.kind === "file")
              return (
                <div key={i} className="my-1.5">
                  <p className="m-0 font-sans text-xs font-medium text-muted">
                    {o.size < 0 ? (
                      <>
                        Fayl o&apos;chirildi: <span className="font-mono">{o.name}</span>
                      </>
                    ) : (
                      <>
                        Fayl yozildi: <span className="font-mono">{o.name}</span> ({o.size} bayt
                        {o.text === null ? ", binary, boshidagi baytlar hex'da" : ""})
                      </>
                    )}
                  </p>
                  {o.size >= 0 && (
                    <pre className="m-0 mt-0.5 max-h-60 overflow-auto rounded border border-rule bg-sheet px-2 py-1 whitespace-pre">
                      {o.text ?? o.hex}
                    </pre>
                  )}
                </div>
              );
            if (o.kind === "table")
              return (
                <div key={i} className="my-1 overflow-x-auto">
                  <table className="border-collapse text-left">
                    <thead>
                      <tr>
                        {o.columns.map((c) => (
                          <th key={c} className="border-b border-ink px-2 py-1 font-semibold">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {o.rows.map((r, j) => (
                        <tr key={j}>
                          {r.map((v, k) => (
                            <td key={k} className="border-b border-rule px-2 py-1">
                              {v === null ? <span className="text-muted">NULL</span> : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-muted">{o.rows.length} qator</p>
                </div>
              );
            // C terminal oqimi kabi keladi (o'z \n lari bilan): so'rov va kiritilgan javob bitta qatorda qoladi.
            if (lang === "c" && o.kind !== "info") {
              const prev = output[i - 1];
              if (prev && prev.kind !== "info" && prev.kind !== "file" && "text" in prev) return null;
              const run: { kind: string; text: string }[] = [];
              for (let k = i; k < output.length; k++) {
                const x = output[k];
                if (x.kind === "info" || x.kind === "file" || !("text" in x)) break;
                run.push(x);
              }
              return (
                <pre key={i} className="m-0 overflow-x-auto whitespace-pre">
                  {run.map((x, k) => (
                    <span key={k} className={x.kind === "err" ? "text-warn" : x.kind === "in" ? "text-muted" : ""}>
                      {x.text}
                    </span>
                  ))}
                </pre>
              );
            }
            return (
              <pre
                key={i}
                className={`m-0 overflow-x-auto whitespace-pre ${o.kind === "err" ? "text-warn" : o.kind === "info" || o.kind === "in" ? "text-muted" : ""}`}
              >
                {o.text}
              </pre>
            );
          })}
        </div>
      )}
    </div>
  );
}
