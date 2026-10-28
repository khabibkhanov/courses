"use client";

import Link from "next/link";
import { nextLesson, passedCount, useProgress } from "@/lib/progress";

export type MapModule = { n: number; title: string; goal?: string; lessons: { n: number; title: string }[] };
type Props = { course: string; modules: MapModule[]; published: number[] };

/** Kurs xaritasi: har modul - liniya bo'lagi, har dars - bekat. Rang kurs rangidan (--line). */
export function RouteMap({ course, modules, published }: Props) {
  const progress = useProgress(course);
  const current = nextLesson(published, progress);
  const total = modules.reduce((s, m) => s + m.lessons.length, 0);
  const isOpen = (n: number) => published.includes(n);

  return (
    <section id="xarita" className="scroll-mt-20">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Darslar xaritasi</h2>
        <p className="text-sm text-muted">
          {passedCount(progress)} / {total} o&apos;tildi, {published.length} ta dars ochiq
        </p>
      </div>

      <ol className="space-y-10">
        {modules.map((m) => {
          const cols = Math.min(10, m.lessons.length);
          return (
            <li key={m.n}>
              <div className="mb-1 flex items-baseline gap-3">
                <span className="w-8 shrink-0 font-mono text-sm text-muted tabular-nums">{m.n}</span>
                <h3 className="font-semibold">{m.title}</h3>
              </div>
              {m.goal && <p className="mb-4 ml-11 max-w-[70ch] text-sm text-muted">{m.goal}</p>}

              <div
                className="ml-11 grid grid-cols-5 gap-y-4 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
                style={{ "--cols": cols } as React.CSSProperties}
              >
                {m.lessons.map((t, j) => {
                  const open = isOpen(t.n);
                  const passed = progress[t.n]?.passed;
                  const here = t.n === current;
                  // Liniya ikki yarimdan: qator boshi va oxirida ortiqcha bo'lak qolmaydi (mobil 5, keng ekran cols ustun).
                  const left = j === 0 ? "hidden" : j % 5 === 0 ? (j % cols === 0 ? "hidden" : "hidden sm:block") : j % cols === 0 ? "block sm:hidden" : "block";
                  const right =
                    j === m.lessons.length - 1 ? "hidden" : j % 5 === 4 ? (j % cols === cols - 1 ? "hidden" : "hidden sm:block") : j % cols === cols - 1 ? "block sm:hidden" : "block";
                  const dot = (
                    <span
                      className={`relative z-[1] inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold tabular-nums ${
                        here ? "ring-4 ring-line/25 ring-offset-2 ring-offset-paper" : ""
                      } ${passed ? "border-line bg-line text-white" : open ? "border-line bg-paper text-ink" : "border-dashed border-rule bg-paper text-muted"}`}
                    >
                      {t.n}
                    </span>
                  );
                  return (
                    <div key={t.n} className="relative flex justify-center">
                      <span aria-hidden className={`absolute top-1/2 right-1/2 left-0 h-[3px] -translate-y-1/2 ${open ? "bg-line" : "bg-rule"} ${left}`} />
                      <span aria-hidden className={`absolute top-1/2 right-0 left-1/2 h-[3px] -translate-y-1/2 ${isOpen(t.n + 1) ? "bg-line" : "bg-rule"} ${right}`} />
                      {open ? (
                        <Link href={`/${course}/dars/${t.n}`} title={t.title} aria-label={`${t.n}-dars: ${t.title}`}>
                          {dot}
                        </Link>
                      ) : (
                        <span title={`${t.title} (hali yozilmagan)`}>{dot}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <details open={m.lessons.some((t) => t.n === current)} className="mt-4 ml-11">
                <summary className="cursor-pointer text-sm text-muted hover:text-ink">Mavzular ro&apos;yxati</summary>
                <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                  {m.lessons.map((t) => (
                    <li key={t.n} className="flex gap-2">
                      <span className="w-7 shrink-0 text-muted tabular-nums">{t.n}.</span>
                      {isOpen(t.n) ? (
                        <Link href={`/${course}/dars/${t.n}`} className="underline-offset-2 hover:underline">
                          {t.title}
                        </Link>
                      ) : (
                        <span className="text-muted">{t.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
