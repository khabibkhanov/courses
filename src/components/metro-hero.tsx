"use client";

import Link from "next/link";
import { useState } from "react";
import { nextLesson, passedCount, useProgress } from "@/lib/progress";
import { onColor } from "@/lib/color";

export type BoardModule = { n: number; title: string; lessons: number[] };
export type BoardLine = {
  slug: string;
  title: string;
  color: string;
  published: number[];
  modules: BoardModule[];
};

const W = 1000;
const START_X = 44;
const TOP = 64; // birinchi liniya nomi sig'ishi uchun joy
const BOTTOM = 44;
const FORK_X = 140; // shu yergacha liniyalar birga yuradi
const RUN_X = 330; // bekatlar shu yerdan boshlanadi
const END_X = 956;
const ROW_GAP = 96;
const INK = "#e6eaf0";
const MUTED = "#8b95a3";

type Active = { slug: string; n: number } | null;

/**
 * Bosh sahifadagi bekat taxtasi: har kurs - bitta liniya, har modul - bekat.
 * Liniya uzunligi dars soniga, to'liq chizilgan qismi esa yozilgan darslarga mos.
 * Bekatlar sichqoncha va sensor uchun; klaviatura bilan hamma narsa kurslar ro'yxatidan ochiladi.
 */
export function MetroHero({ lines }: { lines: BoardLine[] }) {
  const [active, setActive] = useState<Active>(null);
  const total = (l: BoardLine) =>
    l.modules.reduce((s, m) => s + m.lessons.length, 0);
  const max = Math.max(...lines.map(total));
  const mid = (lines.length - 1) / 2;
  const startY = TOP + mid * ROW_GAP;
  const height = TOP + (lines.length - 1) * ROW_GAP + BOTTOM;

  const activeLine = active
    ? lines.find((l) => l.slug === active.slug)
    : undefined;
  const activeModule = activeLine?.modules.find((m) => m.n === active?.n);

  return (
    <div className="rounded-2xl border border-board-rule bg-board p-3 text-board-ink sm:p-8">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${height}`}
          className="h-auto w-full min-w-[720px]"
          role="img"
          aria-label="Kurslar xaritasi: har kurs bitta liniya, har modul bitta bekat"
        >
          {lines.map((l, i) => {
            const y = TOP + i * ROW_GAP;
            const bundleY = startY + (i - mid) * 9;
            const diag = Math.abs(y - bundleY);
            const end = RUN_X + ((END_X - RUN_X) * total(l)) / max;
            const builtX =
              RUN_X + ((end - RUN_X) * l.published.length) / total(l);
            const step = (end - RUN_X) / l.modules.length;
            const xs = l.modules.map((_, k) => RUN_X + (k + 1) * step);
            const path = `M ${START_X} ${bundleY} H ${FORK_X} L ${FORK_X + diag} ${y} H ${RUN_X}`;

            return (
              <g key={l.slug}>
                <path
                  d={path}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={8}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <line
                  x1={RUN_X}
                  y1={y}
                  x2={builtX}
                  y2={y}
                  stroke={l.color}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                <line
                  x1={builtX}
                  y1={y}
                  x2={end}
                  y2={y}
                  stroke={l.color}
                  strokeWidth={8}
                  strokeOpacity={0.3}
                  strokeLinecap="round"
                />

                <Link
                  href={`/${l.slug}`}
                  aria-label={`${l.title} kursi`}
                  className="outline-none"
                >
                  <text
                    x={RUN_X}
                    y={y - 24}
                    fill={INK}
                    className="text-[26px] font-semibold hover:underline"
                  >
                    {l.title}
                  </text>
                </Link>
                <text
                  x={end}
                  y={y - 22}
                  textAnchor="end"
                  fill={MUTED}
                  className="text-[20px]"
                >
                  {total(l)} dars
                </text>

                {l.modules.map((m, k) => {
                  const open = m.lessons.some((n) => l.published.includes(n));
                  const isActive = active?.slug === l.slug && active.n === m.n;
                  const last = k === l.modules.length - 1;
                  const select = () => setActive({ slug: l.slug, n: m.n });
                  return (
                    <g
                      key={m.n}
                      onMouseEnter={select}
                      onClick={select}
                      className="cursor-pointer"
                    >
                      <circle cx={xs[k]} cy={y} r={22} fill="transparent" />
                      <circle
                        cx={xs[k]}
                        cy={y}
                        r={isActive ? 12 : last ? 9 : 7}
                        fill={isActive ? INK : "var(--board)"}
                        stroke={l.color}
                        strokeWidth={3.5}
                        strokeOpacity={open ? 1 : 0.5}
                        strokeDasharray={open ? undefined : "4 3"}
                      />
                      <text
                        x={xs[k]}
                        y={y + 36}
                        textAnchor="middle"
                        fill={MUTED}
                        className="font-mono text-[15px]"
                      >
                        {m.n}
                      </text>
                    </g>
                  );
                })}

                <HereMarker line={l} xs={xs} y={y} />
              </g>
            );
          })}
          <circle
            cx={START_X}
            cy={startY}
            r={20}
            fill="var(--board)"
            stroke={INK}
            strokeWidth={4}
          />
        </svg>
      </div>

      <div
        className="mt-4 min-h-[5.25rem] border-t border-board-rule pt-4"
        aria-live="polite"
      >
        {activeLine && activeModule ? (
          <StationInfo line={activeLine} module={activeModule} />
        ) : (
          <p className="max-w-[60ch] text-sm leading-relaxed text-board-muted">
            Bekat ustiga olib keling yoki bosing: modul nomi va uning darslari
            shu yerda chiqadi. To&apos;liq chiziq ochiq darslarni, xira qismi
            hali yozilmaganini bildiradi.
          </p>
        )}
      </div>
    </div>
  );
}

/** "Siz shu yerdasiz": o'quvchining keyingi darsi turgan modul bekati (progress brauzerda, faqat o'tgan dars bo'lsa chiqadi). */
function HereMarker({
  line,
  xs,
  y,
}: {
  line: BoardLine;
  xs: number[];
  y: number;
}) {
  const progress = useProgress(line.slug);
  if (passedCount(progress) === 0) return null;
  const next = nextLesson(line.published, progress);
  if (next === undefined) return null;
  const k = line.modules.findIndex((m) => m.lessons.includes(next));
  if (k < 0) return null;
  return (
    <g pointerEvents="none">
      <circle
        cx={xs[k]}
        cy={y}
        r={16}
        fill="none"
        stroke={INK}
        strokeWidth={2}
      />
      <text
        x={xs[k]}
        y={y + 58}
        textAnchor="middle"
        fill={INK}
        className="text-[16px] font-medium"
      >
        Siz shu yerdasiz
      </text>
    </g>
  );
}

function StationInfo({
  line,
  module: m,
}: {
  line: BoardLine;
  module: BoardModule;
}) {
  const open = m.lessons.filter((n) => line.published.includes(n));
  const href =
    open.length > 0 ? `/${line.slug}/dars/${open[0]}` : `/${line.slug}#xarita`;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span
        className="rounded-md px-2.5 py-1 text-sm font-semibold"
        style={{ background: line.color, color: onColor(line.color) }}
      >
        {line.title}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {m.n}-modul: {m.title}
        </p>
        <p className="text-sm text-board-muted">
          {m.lessons.length} dars,{" "}
          {open.length === m.lessons.length
            ? "hammasi ochiq"
            : `${open.length} tasi ochiq`}
        </p>
      </div>
      <Link
        href={href}
        className="rounded-lg bg-board-ink px-4 py-2 text-sm font-medium text-board hover:opacity-90"
      >
        {open.length > 0 ? `${open[0]}-darsdan boshlash` : "Kurs xaritasi"}
      </Link>
    </div>
  );
}
