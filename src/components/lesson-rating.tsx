"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { COMMENT_MAX, RATING_TAGS } from "@/lib/rating";
import { saveProgress, useProgress } from "@/lib/progress";
import { deviceId, postJson } from "@/lib/device";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "saved" } | { kind: "error"; message: string };

const LABELS = ["Foydasiz", "Kam foydali", "O'rtacha", "Foydali", "Juda foydali"];

/** Dars oxiridagi baho: yulduz, tezkor teglar, ixtiyoriy izoh. Oxirgi yuborilgan baho shu brauzerda eslab qolinadi. */
export function LessonRating({ course, n }: { course: string; n: number }) {
  const saved = useProgress(course)[n]?.rating;
  const [stars, setStars] = useState<number | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const s = stars ?? saved?.stars ?? 0;
  const t = tags ?? saved?.tags ?? [];
  const c = comment ?? saved?.comment ?? "";

  function toggle(tag: string) {
    setTags(t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]);
    setStatus({ kind: "idle" });
  }

  async function submit() {
    setStatus({ kind: "sending" });
    const res = await postJson("/api/rating", { course, lesson: n, deviceId: deviceId(), stars: s, tags: t, comment: c.trim() || undefined });
    if (!res.ok) {
      setStatus({ kind: "error", message: res.error });
      return;
    }
    saveProgress(course, n, { rating: { stars: s, tags: t, comment: c.trim() } });
    setStars(null);
    setTags(null);
    setComment(null);
    setStatus({ kind: "saved" });
  }

  const dirty = stars !== null || tags !== null || comment !== null;

  return (
    <section id="baho" className="mt-16 scroll-mt-20 border-t border-rule pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">Dars qanchalik foydali bo&apos;ldi?</h2>
      <p className="mt-2 max-w-[70ch] text-muted">
        Bahoingiz qaysi darslarni birinchi navbatda yaxshilash kerakligini ko&apos;rsatadi.
      </p>

      <div role="radiogroup" aria-label="Baho" className="mt-5 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={s === v}
            aria-label={`${v} - ${LABELS[v - 1]}`}
            title={LABELS[v - 1]}
            onClick={() => {
              setStars(v);
              setStatus({ kind: "idle" });
            }}
            className="rounded p-1 text-line hover:scale-110"
          >
            <Star size={28} strokeWidth={1.6} fill={v <= s ? "currentColor" : "none"} aria-hidden />
          </button>
        ))}
        <span className="ml-3 text-sm text-muted">{s ? LABELS[s - 1] : "Baho tanlang"}</span>
      </div>

      <div className="mt-5 flex max-w-[70ch] flex-wrap gap-2">
        {RATING_TAGS.map((tag) => {
          const on = t.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(tag)}
              className={`rounded-full border px-3 py-1 text-sm ${on ? "border-line bg-line text-white" : "border-rule hover:border-muted"}`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <textarea
        value={c}
        onChange={(e) => {
          setComment(e.target.value);
          setStatus({ kind: "idle" });
        }}
        maxLength={COMMENT_MAX}
        rows={3}
        aria-label="Izoh"
        placeholder="Izoh (ixtiyoriy): nima yoqdi, nima tushunarsiz bo'ldi"
        className="mt-5 w-full max-w-[70ch] rounded-md border border-rule bg-sheet p-3 text-sm leading-relaxed focus:border-line focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={!s || status.kind === "sending" || (!dirty && Boolean(saved))}
          className="rounded-md bg-line px-5 py-2.5 font-medium text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saved ? "Bahoni yangilash" : "Bahoni yuborish"}
        </button>
        <p role="status" className={`text-sm ${status.kind === "error" ? "text-warn" : "text-muted"}`}>
          {status.kind === "sending" && "Yuborilmoqda..."}
          {status.kind === "saved" && "Rahmat, bahoingiz saqlandi."}
          {status.kind === "error" && status.message}
          {status.kind === "idle" && saved && !dirty && "Siz bu darsga baho bergansiz, uni o'zgartirishingiz mumkin."}
        </p>
      </div>
    </section>
  );
}
