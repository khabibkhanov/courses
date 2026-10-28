import { createHash } from "node:crypto";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getLesson, listCourses, publishedNumbers, syllabus } from "@/lib/content";
import { codeToMarkdown, extractToc, markdownToHtml, renderLesson } from "@/lib/markdown";
import { LessonBody } from "@/components/lesson-body";
import { Quiz } from "@/components/quiz";
import { AnswerBox } from "@/components/answer-box";
import { TaskBlock } from "@/components/task-block";
import { ReadingProgress } from "@/components/reading-progress";
import { LessonRating } from "@/components/lesson-rating";
import { TextFeedback } from "@/components/text-feedback";

export const dynamicParams = false;

export function generateStaticParams() {
  return listCourses().flatMap((c) => publishedNumbers(c).map((n) => ({ course: c.slug, n: String(n) })));
}

async function load(params: PageProps<"/[course]/dars/[n]">["params"]) {
  const { course: slug, n } = await params;
  const course = getCourse(slug);
  const lesson = course ? getLesson(course, Number(n)) : null;
  return course && lesson ? { course, lesson } : null;
}

export async function generateMetadata({ params }: PageProps<"/[course]/dars/[n]">): Promise<Metadata> {
  const data = await load(params);
  return data ? { title: `${data.lesson.n}. ${data.lesson.title} - ${data.course.title}` } : {};
}

export default async function LessonPage({ params }: PageProps<"/[course]/dars/[n]">) {
  const data = await load(params);
  if (!data) notFound();
  const { course, lesson } = data;
  const n = lesson.n;

  const all = syllabus(course);
  const mod = all.find((l) => l.n === n)!.module;
  const published = publishedNumbers(course);
  const prev = published.filter((x) => x < n).at(-1);
  const next = published.find((x) => x > n);

  const { html, segments, playgrounds } = await renderLesson(lesson.body, { course: course.slug, n });
  const toc = extractToc(html);
  const task = lesson.task && {
    title: lesson.task.title,
    checklist: lesson.task.checklist,
    promptHtml: await markdownToHtml(lesson.task.prompt),
    starterHtml: await markdownToHtml(codeToMarkdown(lesson.task.starter, lesson.task.lang)),
    solutionHtml: await markdownToHtml(codeToMarkdown(lesson.task.solution, lesson.task.lang)),
    solutionNotesHtml: await markdownToHtml(lesson.task.solutionNotes),
  };

  // Baza ulanmagan bo'lsa baho va izoh bloklari ko'rsatilmaydi (env build vaqtida o'qiladi, sahifa statik).
  const dbEnabled = Boolean(process.env.DATABASE_URL);
  // Izoh qaysi dars versiyasiga qoldirilganini bilish uchun.
  const lessonHash = createHash("sha256").update(lesson.body).digest("hex").slice(0, 16);
  const extraToc = [
    ...(lesson.sources.length ? [{ id: "manbalar", text: "Manbalar" }] : []),
    ...(lesson.quiz ? [{ id: "test", text: "Test" }] : []),
    task ? { id: "topshiriq", text: "Amaliy topshiriq" } : { id: "javob", text: "Topshiriq javobi" },
    ...(dbEnabled ? [{ id: "baho", text: "Darsga baho" }] : []),
  ];

  return (
    <div style={{ "--line": course.color } as React.CSSProperties}>
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] space-y-8 overflow-y-auto pb-6 text-sm">
            <div>
              <p className="mb-2 font-semibold">
                {mod.n}. {mod.title}
              </p>
              <ol className="space-y-1.5 border-l-2 border-line pl-3">
                {mod.lessons.map((t) => {
                  const open = published.includes(t.n);
                  const active = t.n === n;
                  return (
                    <li key={t.n} className={active ? "font-semibold" : open ? "" : "text-muted"}>
                      {open && !active ? (
                        <Link href={`/${course.slug}/dars/${t.n}`} className="hover:underline underline-offset-2">
                          {t.n}. {t.title}
                        </Link>
                      ) : (
                        <span aria-current={active ? "page" : undefined}>
                          {t.n}. {t.title}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            <nav aria-label="Shu darsda">
              <p className="mb-2 font-semibold">Shu darsda</p>
              <ul className="space-y-1.5 text-muted">
                {[...toc, ...extraToc].map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <article className="min-w-0">
          <header className="mb-10 max-w-[70ch]">
            <p className="mb-3 text-sm text-muted">
              <Link href={`/${course.slug}`} className="font-semibold text-line hover:underline underline-offset-2">
                {course.title}
              </Link>
              <span>
                {" "}
                / {n}-dars, taxminan {lesson.minutes} daqiqa
              </span>
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{lesson.title}</h1>
            {lesson.summary && <p className="mt-4 text-lg leading-relaxed text-muted">{lesson.summary}</p>}
            {dbEnabled && (
              <p className="mt-4 text-sm text-muted">
                Matnda xato yoki tushunarsiz joy ko&apos;rsangiz, uni belgilang va izoh qoldiring.
              </p>
            )}
            <details className="mt-6 rounded-lg border border-rule bg-sheet px-4 py-3 text-sm lg:hidden">
              <summary className="cursor-pointer font-medium">Shu darsda</summary>
              <ul className="mt-3 space-y-1.5 text-muted">
                {[...toc, ...extraToc].map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </header>

          {dbEnabled ? (
            <TextFeedback course={course.slug} n={n} lessonHash={lessonHash}>
              <LessonBody course={course.slug} n={n} segments={segments} playgrounds={playgrounds} />
            </TextFeedback>
          ) : (
            <LessonBody course={course.slug} n={n} segments={segments} playgrounds={playgrounds} />
          )}

          {lesson.sources.length > 0 && (
            <section className="lesson mt-12">
              <h2 id="manbalar">Manbalar</h2>
              <ul>
                {lesson.sources.map((s) => (
                  <li key={s.url + s.note}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title}
                    </a>{" "}
                    ({s.author}, {s.year}). <span className="text-muted">{s.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.quiz && <Quiz course={course.slug} n={n} quiz={lesson.quiz} hasNext={next !== undefined} />}
          {task ? <TaskBlock course={course.slug} n={n} task={task} /> : <AnswerBox course={course.slug} n={n} title={lesson.title} />}
          {dbEnabled && <LessonRating course={course.slug} n={n} />}

          <nav aria-label="Darslar" className="mt-16 grid gap-4 border-t border-rule pt-6 sm:grid-cols-2">
            {prev ? (
              <Link href={`/${course.slug}/dars/${prev}`} className="rounded-lg border border-rule p-4 hover:border-muted">
                <span className="block text-sm text-muted">Oldingi: {prev}-dars</span>
                <span className="font-medium">{all.find((l) => l.n === prev)?.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${course.slug}/dars/${next}`}
                className="rounded-lg border border-line p-4 text-right hover:bg-line/5 sm:col-start-2"
              >
                <span className="block text-sm text-muted">Keyingi: {next}-dars</span>
                <span className="font-medium">{all.find((l) => l.n === next)?.title}</span>
              </Link>
            ) : (
              <p className="self-center text-sm text-muted sm:text-right">Keyingi dars hali yozilmagan.</p>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}
