"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Play, RotateCcw, Square } from "lucide-react";
import { LANG_LABEL, type Output, type RunHandle } from "./runners";
import type { PlaygroundSpec } from "@/lib/playground";

// Muharrir va runtime'lar faqat brauzerda va kerak bo'lganda yuklanadi.
const CodeEditor = dynamic(() => import("./editor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => null,
});

/** Darsdagi tahrirlanadigan va ishga tushiriladigan kod bloki. */
export function Playground({ lang, code: initial }: PlaygroundSpec) {
  const [code, setCode] = useState(initial);
  const [output, setOutput] = useState<Output[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "running">("idle");
  const handle = useRef<RunHandle | null>(null);

  async function start() {
    if (state !== "idle") return;
    const { run } = await import("./runners");
    setOutput([]);
    setState("running");
    // Vaqt runtime yuklanib bo'lgandan keyin hisoblanadi: birinchi yuklash natijaga qo'shilmaydi.
    let started = performance.now();
    handle.current = run(
      lang,
      code,
      (o) => setOutput((prev) => [...(prev ?? []), o]),
      (loading) => {
        if (!loading) started = performance.now();
        setState(loading ? "loading" : "running");
      },
    );
    await handle.current.done;
    const ms = Math.round(performance.now() - started);
    setOutput((prev) => [...(prev ?? []), { kind: "info", text: `${ms} ms` }]);
    handle.current = null;
    setState("idle");
  }

  const changed = code !== initial;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-rule bg-sheet" data-playground-root>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule px-3 py-2">
        <span className="text-xs font-medium text-muted">{LANG_LABEL[lang]}, tahrirlash mumkin</span>
        <div className="flex items-center gap-2">
          {changed && state === "idle" && (
            <button
              type="button"
              onClick={() => setCode(initial)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:text-ink"
            >
              <RotateCcw size={13} aria-hidden /> Asl holiga
            </button>
          )}
          {state === "idle" ? (
            <button
              type="button"
              onClick={start}
              title="Ctrl+Enter"
              className="inline-flex items-center gap-1.5 rounded-md bg-line px-3 py-1 text-sm font-medium text-white hover:brightness-110"
            >
              <Play size={13} fill="currentColor" aria-hidden /> Ishga tushirish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handle.current?.stop()}
              className="inline-flex items-center gap-1.5 rounded-md border border-rule px-3 py-1 text-sm font-medium hover:border-muted"
            >
              <Square size={12} fill="currentColor" aria-hidden /> To&apos;xtatish
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[3rem]">
        <CodeEditor lang={lang} value={code} onChange={setCode} onRun={start} />
        <noscript>
          <pre>{initial}</pre>
        </noscript>
      </div>

      {(output || state !== "idle") && (
        <div role="log" aria-live="polite" className="border-t border-rule bg-paper px-3 py-2.5 font-mono text-[0.8rem] leading-relaxed">
          {state === "loading" && <p className="text-muted">{LANG_LABEL[lang]} runtime yuklanmoqda (faqat birinchi marta)...</p>}
          {state === "running" && output?.length === 0 && <p className="text-muted">Ishlamoqda...</p>}
          {output?.map((o, i) =>
            o.kind === "table" ? (
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
            ) : (
              <pre
                key={i}
                className={`m-0 overflow-x-auto whitespace-pre ${o.kind === "err" ? "text-warn" : o.kind === "info" ? "text-muted" : ""}`}
              >
                {o.text}
              </pre>
            ),
          )}
        </div>
      )}
    </div>
  );
}
