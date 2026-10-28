"use client";

import { useState } from "react";
import { saveProgress, useProgress } from "@/lib/progress";

/** Matnli amaliy topshiriq javobi: brauzerda saqlanadi, nusxa olish mumkin. */
export function AnswerBox({ course, n, title }: { course: string; n: number; title: string }) {
  const progress = useProgress(course);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const value = draft ?? progress[n]?.answer ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${n}-dars topshiriq javobi (${title}):\n\n${value}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="javob" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight">Topshiriq javobi</h2>
      <p className="mb-4 max-w-[70ch] text-muted">
        Javobingiz shu brauzerda saqlanadi. Yozib bo&apos;lgach, uni topshiriqdagi mezonlar bilan solishtiring.
      </p>
      <textarea
        value={value}
        onChange={(e) => {
          setDraft(e.target.value);
          saveProgress(course, n, { answer: e.target.value });
        }}
        rows={12}
        aria-label="Topshiriq javobi"
        className="w-full max-w-[80ch] rounded-md border border-rule bg-sheet p-3 font-mono text-sm leading-relaxed focus:border-line focus:outline-none"
        placeholder="Talablar, hisob-kitob, yechim, trade-offlar..."
      />
      <div className="mt-3">
        <button
          onClick={copy}
          disabled={!value.trim()}
          className="rounded-md border border-rule px-4 py-2 hover:border-muted disabled:opacity-40"
        >
          {copied ? "Nusxa olindi" : "Nusxa olish"}
        </button>
      </div>
    </section>
  );
}
