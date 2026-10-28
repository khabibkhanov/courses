"use client";

import { useState } from "react";
import type { Quiz as QuizData } from "@/lib/content/schema";
import { saveProgress, useProgress } from "@/lib/progress";

type Props = { course: string; n: number; quiz: QuizData; hasNext: boolean };

// Deterministik aralashtirish (server va brauzerda bir xil): to'g'ri javob o'rni oldindan ma'lum bo'lmaydi.
function shuffled(q: QuizData["questions"][number], seed: number) {
  const order = q.options.map((_, i) => i);
  let s = seed * 9301 + 49297;
  for (let i = order.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

export function Quiz({ course, n, quiz: raw, hasNext }: Props) {
  const questions = raw.questions.map((q, i) => shuffled(q, n * 100 + i));
  const progress = useProgress(course);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);

  const total = questions.length;
  const correct = picked.filter((p, i) => p === questions[i].answer).length;
  const passed = correct / total >= raw.passScore;
  const allAnswered = picked.every((p) => p !== null);
  const need = Math.ceil(raw.passScore * total);

  function check() {
    setChecked(true);
    saveProgress(course, n, { score: correct / total, passed });
  }

  function reset() {
    setPicked(questions.map(() => null));
    setChecked(false);
  }

  return (
    <section id="test" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Test</h2>
        <p className="text-sm text-muted">
          {need === total ? `Hamma ${total} savolga to'g'ri javob kerak` : `O'tish uchun ${total} tadan kamida ${need} ta to'g'ri javob`}
          {progress[n]?.passed ? ", bu dars avval o'tilgan" : ""}
        </p>
      </div>

      <ol className="space-y-8">
        {questions.map((q, i) => {
          const isRight = picked[i] === q.answer;
          return (
            <li key={i} className="max-w-[70ch]">
              <p className="mb-3 font-medium leading-relaxed">
                {i + 1}. {q.q}
              </p>
              <div className="grid gap-2" role="radiogroup" aria-label={`${i + 1}-savol`}>
                {q.options.map((opt, j) => {
                  const selected = picked[i] === j;
                  const showRight = checked && j === q.answer;
                  const showWrong = checked && selected && !isRight;
                  return (
                    <label
                      key={j}
                      className={`flex gap-3 rounded-md border px-3 py-2.5 text-[0.95rem] leading-relaxed ${
                        showRight
                          ? "border-done bg-done/10"
                          : showWrong
                            ? "border-warn bg-warn/10"
                            : selected
                              ? "border-line bg-line/5"
                              : "border-rule bg-sheet hover:border-muted"
                      } ${checked ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        className="mt-1.5 accent-[var(--line)]"
                        checked={selected}
                        disabled={checked}
                        onChange={() => setPicked((p) => p.map((v, k) => (k === i ? j : v)))}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
              {checked && (
                <p className={`mt-3 text-[0.95rem] leading-relaxed ${isRight ? "text-done" : "text-warn"}`}>
                  <strong>{isRight ? "To'g'ri." : "Noto'g'ri."}</strong> <span className="text-ink">{q.why}</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {!checked ? (
          <button
            onClick={check}
            disabled={!allAnswered}
            className="rounded-md bg-line px-5 py-2.5 font-medium text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Javoblarni tekshirish
          </button>
        ) : (
          <>
            <p className={`font-medium ${passed ? "text-done" : "text-warn"}`}>
              {correct} / {total}.{" "}
              {passed
                ? hasNext
                  ? "Test o'tildi, keyingi darsga o'tishingiz mumkin."
                  : "Test o'tildi."
                : "Test o'tilmadi. Darsning tegishli bo'limlarini qayta o'qing."}
            </p>
            <button onClick={reset} className="rounded-md border border-rule px-4 py-2 hover:border-muted">
              Qayta urinish
            </button>
          </>
        )}
        {!allAnswered && !checked && <span className="text-sm text-muted">Hamma savolga javob bering</span>}
      </div>
    </section>
  );
}
