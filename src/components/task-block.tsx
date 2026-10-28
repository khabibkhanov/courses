"use client";

import { saveProgress, useProgress } from "@/lib/progress";

export type TaskView = {
  title: string;
  checklist: string[];
  promptHtml: string;
  starterHtml: string;
  solutionHtml: string;
  solutionNotesHtml: string;
};

/** Kodli amaliy topshiriq: shart, boshlang'ich kod, o'z-o'zini tekshirish ro'yxati va yechim. */
export function TaskBlock({ course, n, task }: { course: string; n: number; task: TaskView }) {
  const progress = useProgress(course);
  const done = new Set(progress[n]?.checklist ?? []);

  function toggle(i: number) {
    const next = new Set(done);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    saveProgress(course, n, { checklist: [...next].sort((a, b) => a - b) });
  }

  return (
    <section id="topshiriq" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">Amaliy topshiriq: {task.title}</h2>
      <div className="lesson mt-5" dangerouslySetInnerHTML={{ __html: task.promptHtml }} />
      <p className="mt-6 mb-2 text-sm font-medium text-muted">Boshlang&apos;ich kod</p>
      <div className="lesson max-w-[80ch]" dangerouslySetInnerHTML={{ __html: task.starterHtml }} />

      <h3 className="mt-8 font-semibold">O&apos;zingizni tekshiring</h3>
      <ul className="mt-3 max-w-[70ch] space-y-2">
        {task.checklist.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer gap-3 leading-relaxed">
              <input type="checkbox" className="mt-1.5 accent-[var(--line)]" checked={done.has(i)} onChange={() => toggle(i)} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        {done.size} / {task.checklist.length} band bajarildi
      </p>

      <details className="mt-8 max-w-[80ch] rounded-lg border border-rule bg-sheet p-4">
        <summary className="cursor-pointer font-medium">Yechimni ko&apos;rsatish</summary>
        <div className="lesson mt-4" dangerouslySetInnerHTML={{ __html: task.solutionHtml }} />
        <div className="lesson mt-4" dangerouslySetInnerHTML={{ __html: task.solutionNotesHtml }} />
      </details>
    </section>
  );
}
