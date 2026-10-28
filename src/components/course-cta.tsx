"use client";

import Link from "next/link";
import { nextLesson, passedCount, useProgress } from "@/lib/progress";

type Props = { course: string; published: number[]; total: number; titles: Record<number, string> };

/** Kurs bo'yicha holat va "davom ettirish" havolasi (progress faqat brauzerda ma'lum). */
export function CourseCta({ course, published, total, titles }: Props) {
  const progress = useProgress(course);
  const done = passedCount(progress);
  const next = nextLesson(published, progress);

  if (published.length === 0) return <p className="text-sm text-muted">Darslar tayyorlanmoqda.</p>;

  return (
    <div className="flex flex-col gap-3">
      {next !== undefined ? (
        <Link
          href={`/${course}/dars/${next}`}
          className="inline-flex max-w-md flex-col rounded-lg bg-line px-4 py-3 text-white hover:brightness-110"
        >
          <span className="text-sm opacity-85">{done === 0 ? "Boshlash" : "Davom ettirish"}: {next}-dars</span>
          <span className="font-medium leading-snug">{titles[next]}</span>
        </Link>
      ) : (
        <p className="text-sm">Ochiq darslarning hammasi o&apos;tildi.</p>
      )}
      <p className="text-sm text-muted">
        {done > 0 ? `${done} / ${total} dars o'tildi, ` : ""}
        {published.length === total ? `${total} dars` : `${published.length} / ${total} dars ochiq`}
      </p>
    </div>
  );
}
