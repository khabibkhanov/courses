import { createHash } from "node:crypto";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCourse, getLesson } from "@/lib/content";
import { markdownToText } from "@/lib/markdown";
import { FEEDBACK_KINDS, FEEDBACK_STATUSES, normalize, type FeedbackKind, type FeedbackStatus } from "@/lib/feedback";
import { CopyButton } from "@/components/copy-button";
import { setFeedbackStatus } from "../actions";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  course: string;
  lesson: number;
  kind: FeedbackKind;
  quote: string;
  prefix: string;
  suffix: string;
  section: string | null;
  comment: string | null;
  lesson_hash: string;
  status: FeedbackStatus;
  created_at: string;
};

/** Izoh qoldirilgandan keyin dars o'zgargan bo'lsa: belgilangan matn hali bormi? */
type Freshness = "current" | "changed" | "stale";

async function freshnessOf(rows: Row[]) {
  const cache = new Map<string, { hash: string; text: string } | null>();
  const result = new Map<number, Freshness>();
  for (const r of rows) {
    const key = `${r.course}#${r.lesson}`;
    if (!cache.has(key)) {
      const course = getCourse(r.course);
      const lesson = course && getLesson(course, r.lesson);
      cache.set(
        key,
        lesson
          ? {
              hash: createHash("sha256").update(lesson.body).digest("hex").slice(0, 16),
              text: normalize(await markdownToText(lesson.body)),
            }
          : null,
      );
    }
    const now = cache.get(key);
    result.set(r.id, !now ? "stale" : now.hash === r.lesson_hash ? "current" : now.text.includes(normalize(r.quote)) ? "changed" : "stale");
  }
  return result;
}

function exportText(title: string, items: Row[]) {
  return [
    `${title} - matnga izohlar:`,
    ...items.map(
      (r, i) =>
        `${i + 1}. [${FEEDBACK_KINDS[r.kind].label}]${r.section ? ` (${r.section})` : ""} "${normalize(r.quote)}"` +
        (r.comment ? `\n   Izoh: ${r.comment}` : ""),
    ),
  ].join("\n");
}

export default async function FeedbackAdmin({ searchParams }: PageProps<"/admin/izohlar">) {
  const sql = db();
  if (!sql) return <p className="text-muted">Baza ulanmagan: DATABASE_URL yo&apos;q.</p>;

  const raw = (await searchParams).holat;
  const status: FeedbackStatus = typeof raw === "string" && raw in FEEDBACK_STATUSES ? (raw as FeedbackStatus) : "new";

  const [rows, counts] = await Promise.all([
    sql<Row[]>`
      select id, course, lesson, kind, quote, prefix, suffix, section, comment, lesson_hash, status,
        to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at
      from lesson_feedback where status = ${status}
      order by course, lesson, created_at`,
    sql<{ status: FeedbackStatus; n: number }[]>`select status, count(*)::int as n from lesson_feedback group by status`,
  ]);
  const count = Object.fromEntries(counts.map((c) => [c.status, c.n])) as Partial<Record<FeedbackStatus, number>>;
  const fresh = await freshnessOf(rows);

  const groups = new Map<string, Row[]>();
  for (const r of rows) groups.set(`${r.course}#${r.lesson}`, [...(groups.get(`${r.course}#${r.lesson}`) ?? []), r]);

  return (
    <>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Matnga izohlar</h1>
      <div className="mb-8 flex flex-wrap gap-2">
        {(Object.keys(FEEDBACK_STATUSES) as FeedbackStatus[]).map((s) => (
          <Link
            key={s}
            href={`/admin/izohlar?holat=${s}`}
            aria-current={s === status ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-sm ${s === status ? "border-ink bg-ink text-paper" : "border-rule hover:border-muted"}`}
          >
            {FEEDBACK_STATUSES[s]} ({count[s] ?? 0})
          </Link>
        ))}
      </div>

      {rows.length === 0 && <p className="text-muted">Bu holatda izoh yo&apos;q.</p>}

      <div className="space-y-12">
        {[...groups.values()].map((items) => {
          const first = items[0];
          const course = getCourse(first.course);
          const lesson = course && getLesson(course, first.lesson);
          const title = `${course?.title ?? first.course}, ${first.lesson}-dars: ${lesson?.title ?? "?"}`;
          return (
            <section key={`${first.course}#${first.lesson}`}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-2">
                <h2 className="text-lg font-semibold">
                  <Link href={`/${first.course}/dars/${first.lesson}`} className="underline-offset-2 hover:underline">
                    {title}
                  </Link>
                  <span className="ml-2 text-sm font-normal text-muted">{items.length} ta</span>
                </h2>
                <CopyButton text={exportText(title, items)} label="Eksport (chat uchun nusxa)" />
              </div>
              <ol className="space-y-6">
                {items.map((r) => {
                  const f = fresh.get(r.id);
                  return (
                    <li key={r.id} className="max-w-[80ch]">
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded bg-soft px-2 py-0.5 font-medium">{FEEDBACK_KINDS[r.kind].label}</span>
                        {r.section && <span className="text-muted">{r.section}</span>}
                        <span className="text-muted">{r.created_at}</span>
                        {f === "changed" && <span className="text-muted">dars o&apos;zgargan, matn hali bor</span>}
                        {f === "stale" && <span className="text-warn">eskirgan: belgilangan matn darsda topilmadi</span>}
                      </div>
                      <p className="leading-relaxed">
                        <span className="text-muted">...{r.prefix}</span>
                        <mark className="rounded bg-line/15 px-0.5 text-ink">{r.quote}</mark>
                        <span className="text-muted">{r.suffix}...</span>
                      </p>
                      {r.comment && <p className="mt-1 border-l-2 border-rule pl-3 text-sm">{r.comment}</p>}
                      <form action={setFeedbackStatus} className="mt-2 flex gap-2">
                        <input type="hidden" name="id" value={r.id} />
                        {(Object.keys(FEEDBACK_STATUSES) as FeedbackStatus[])
                          .filter((s) => s !== r.status)
                          .map((s) => (
                            <button
                              key={s}
                              name="status"
                              value={s}
                              className="rounded-md border border-rule px-3 py-1 text-sm hover:border-muted"
                            >
                              {FEEDBACK_STATUSES[s]}
                            </button>
                          ))}
                      </form>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
