import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCourse, listCourses, syllabus } from "@/lib/content";
import { CopyButton } from "@/components/copy-button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type Row = {
  course: string;
  lesson: number;
  votes: number;
  avg: number;
  tags: Record<string, number> | null;
  comments: { stars: number; text: string; at: string }[] | null;
};

const fmt = (n: number) => n.toFixed(1).replace(".", ",");

export default async function AdminPage() {
  const sql = db();
  if (!sql) {
    return (
      <Shell>
        <p className="text-muted">Baza ulanmagan: DATABASE_URL yo&apos;q.</p>
      </Shell>
    );
  }

  const rows = await sql<Row[]>`
    with t as (
      select course, lesson, tag, count(*)::int as n
      from lesson_rating, unnest(tags) as tag group by 1, 2, 3
    )
    select r.course, r.lesson, count(*)::int as votes, avg(r.stars)::float as avg,
      (select jsonb_object_agg(tag, n) from t where t.course = r.course and t.lesson = r.lesson) as tags,
      jsonb_agg(jsonb_build_object('stars', r.stars, 'text', r.comment, 'at', to_char(r.updated_at, 'YYYY-MM-DD')) order by r.updated_at desc)
        filter (where r.comment is not null) as comments
    from lesson_rating r
    group by r.course, r.lesson
    order by avg(r.stars), count(*) desc`;

  const titles = new Map(listCourses().flatMap((c) => syllabus(c).map((l) => [`${c.slug}#${l.n}`, l.title] as const)));
  const totalVotes = rows.reduce((s, r) => s + r.votes, 0);

  return (
    <Shell>
      <p className="mb-8 text-muted">
        {rows.length} ta darsga jami {totalVotes} ta baho. Eng past baholi darslar yuqorida.
      </p>
      {rows.length === 0 && <p>Hali baho yo&apos;q.</p>}
      <ol className="divide-y divide-rule border-y border-rule">
        {rows.map((r) => {
          const course = getCourse(r.course);
          const title = titles.get(`${r.course}#${r.lesson}`) ?? "?";
          const tags = Object.entries(r.tags ?? {}).sort((a, b) => b[1] - a[1]);
          const exportText = [
            `${course?.title ?? r.course}, ${r.lesson}-dars: ${title}`,
            `O'rtacha ${fmt(r.avg)} (${r.votes} baho)`,
            tags.length ? `Teglar: ${tags.map(([k, v]) => `${k} (${v})`).join(", ")}` : "",
            ...(r.comments ?? []).map((c) => `- [${c.stars}/5, ${c.at}] ${c.text}`),
          ]
            .filter(Boolean)
            .join("\n");
          return (
            <li key={`${r.course}#${r.lesson}`} className="py-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="w-16 font-mono text-lg tabular-nums">{fmt(r.avg)}</span>
                <Link href={`/${r.course}/dars/${r.lesson}`} className="font-medium underline-offset-2 hover:underline">
                  {course?.title}, {r.lesson}. {title}
                </Link>
                <span className="text-sm text-muted">{r.votes} baho</span>
              </div>
              {tags.length > 0 && (
                <p className="mt-2 ml-20 text-sm text-muted">{tags.map(([k, v]) => `${k} (${v})`).join(", ")}</p>
              )}
              {r.comments && (
                <details className="mt-2 ml-20">
                  <summary className="cursor-pointer text-sm">{r.comments.length} ta izoh</summary>
                  <ul className="mt-2 space-y-2 text-sm">
                    {r.comments.map((c, i) => (
                      <li key={i} className="max-w-[80ch]">
                        <span className="text-muted">
                          {c.stars}/5, {c.at}:
                        </span>{" "}
                        {c.text}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <div className="mt-2 ml-20">
                <CopyButton text={exportText} label="Eksport (chat uchun nusxa)" />
              </div>
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Baholar</h1>
      {children}
    </div>
  );
}
