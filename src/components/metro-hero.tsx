import Link from "next/link";

export type HeroLine = {
  slug: string;
  title: string;
  color: string;
  lessons: number;
  published: number;
  modules: number;
};

const W = 1000;
const START = { x: 40, y: 150 };
const FORK_X = 130; // shu yergacha liniyalar birga yuradi
const RUN_X = 330; // bekatlar shu yerdan boshlanadi
const END_X = 960;
const ROW_GAP = 90;

/**
 * Bosh sahifa xaritasi: har kurs - bitta metro liniyasi, har modul - bekat.
 * Liniya uzunligi dars soniga, to'liq chizilgan qismi esa yozilgan darslarga mos.
 */
export function MetroHero({ lines }: { lines: HeroLine[] }) {
  const max = Math.max(...lines.map((l) => l.lessons));
  const mid = (lines.length - 1) / 2;
  const height = START.y * 2;

  return (
    <svg viewBox={`0 8 ${W} ${height - 28}`} className="h-auto w-full" role="img" aria-label="Kurslar xaritasi">
      {lines.map((l, i) => {
        const bundleY = START.y + (i - mid) * 9;
        const y = START.y + (i - mid) * ROW_GAP;
        const diag = Math.abs(y - bundleY);
        const end = RUN_X + ((END_X - RUN_X) * l.lessons) / max;
        const builtX = RUN_X + ((end - RUN_X) * l.published) / l.lessons;
        const step = (end - RUN_X) / l.modules;
        const stations = Array.from({ length: l.modules + 1 }, (_, k) => RUN_X + k * step);
        const path = `M ${START.x} ${bundleY} H ${FORK_X} L ${FORK_X + diag} ${y} H ${RUN_X}`;

        return (
          <Link key={l.slug} href={`/${l.slug}`} className="group outline-none" aria-label={`${l.title}: ${l.lessons} dars`}>
            <path d={path} fill="none" stroke={l.color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
            <line x1={RUN_X} y1={y} x2={builtX} y2={y} stroke={l.color} strokeWidth={8} strokeLinecap="round" />
            <line x1={builtX} y1={y} x2={end} y2={y} stroke={l.color} strokeWidth={8} strokeOpacity={0.28} strokeLinecap="round" />
            {stations.map((x, k) => {
              const built = x <= builtX + 0.5;
              return (
                <circle
                  key={k}
                  cx={x}
                  cy={y}
                  r={k === stations.length - 1 ? 9 : 6}
                  fill="var(--paper)"
                  stroke={l.color}
                  strokeOpacity={built ? 1 : 0.45}
                  strokeWidth={3.5}
                />
              );
            })}
            <text
              x={RUN_X}
              y={y - 22}
              className="fill-ink text-[26px] font-semibold group-hover:underline group-focus-visible:underline"
            >
              {l.title}
            </text>
            <text x={end} y={y - 20} textAnchor="end" className="fill-muted text-[20px]">
              {l.lessons} dars
            </text>
          </Link>
        );
      })}
      <circle cx={START.x} cy={START.y} r={20} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
    </svg>
  );
}
