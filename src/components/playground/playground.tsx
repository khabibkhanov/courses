"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Check, FlaskConical, Play, RotateCcw, Square, X } from "lucide-react";
import { LANG_LABEL, type Output, type RunHandle } from "./runners";
import type { PlaygroundSpec } from "@/lib/playground";
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
type TestOutput = Extract<Output, { kind: "test" }>;

/** Darsdagi tahrirlanadigan va ishga tushiriladigan kod bloki; testlar bo'lsa - mashq. */
export function Playground({ lang, code: initial, tests, course, n, index }: Props) {
  const saved = useProgress(course)[n]?.exercises?.[index];
  const [draft, setDraft] = useState<string | null>(null);
  const code = draft ?? (tests ? saved?.code : undefined) ?? initial;
  const [output, setOutput] = useState<Output[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "running">("idle");
  const [mode, setMode] = useState<Mode>("run");
  const handle = useRef<RunHandle | null>(null);

  function edit(value: string) {
    setDraft(value);
    if (tests) saveProgress(course, n, { exercises: { [index]: { code: value, passed: saved?.passed ?? false } } });
  }

  async function start(m: Mode) {
    if (state !== "idle") return;
    const { run } = await import("./runners");
    const results: Output[] = [];
    setMode(m);
    setOutput([]);
    setState("running");
    // Vaqt runtime yuklanib bo'lgandan keyin hisoblanadi: birinchi yuklash natijaga qo'shilmaydi.
    let started = performance.now();
    handle.current = run(
      lang,
      code,
      (o) => {
        results.push(o);
        setOutput((prev) => [...(prev ?? []), o]);
      },
      (loading) => {
        if (!loading) started = performance.now();
        setState(loading ? "loading" : "running");
      },
      m === "test" ? tests : undefined,
    );
    await handle.current.done;
    const ms = Math.round(performance.now() - started);
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
          {LANG_LABEL[lang]}, {tests ? "mashq" : "tahrirlash mumkin"}
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

      {(output || state !== "idle") && (
        <div role="log" aria-live="polite" className="border-t border-rule bg-paper px-3 py-2.5 font-mono text-[0.8rem] leading-relaxed">
          {state === "loading" && <p className="text-muted">{LANG_LABEL[lang]} runtime yuklanmoqda (faqat birinchi marta)...</p>}
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
            return (
              <pre
                key={i}
                className={`m-0 overflow-x-auto whitespace-pre ${o.kind === "err" ? "text-warn" : o.kind === "info" ? "text-muted" : ""}`}
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
