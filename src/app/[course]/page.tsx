import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourse, listCourses, publishedNumbers, syllabus } from "@/lib/content";
import { RouteMap } from "@/components/route-map";
import { CourseCta } from "@/components/course-cta";

export const dynamicParams = false;

export function generateStaticParams() {
  return listCourses().map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[course]">): Promise<Metadata> {
  const course = getCourse((await params).course);
  return course ? { title: course.title, description: course.description } : {};
}

export default async function CoursePage({ params }: PageProps<"/[course]">) {
  const course = getCourse((await params).course);
  if (!course) notFound();

  const all = syllabus(course);
  const published = publishedNumbers(course);
  const titles = Object.fromEntries(all.map((l) => [l.n, l.title]));

  return (
    <div style={{ "--line": course.color } as React.CSSProperties} className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="mb-16 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div className="relative pl-6">
          <span aria-hidden className="absolute top-2 bottom-2 left-0 w-1.5 rounded-full bg-line" />
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-2 text-lg text-muted">{course.subtitle}</p>
          <p className="mt-6 max-w-[65ch] leading-relaxed">{course.description}</p>
          <div className="mt-6 max-w-[65ch] rounded-lg border border-rule bg-sheet p-4">
            <h2 className="font-semibold">Kim uchun</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{course.audience}</p>
          </div>
        </div>
        <div className="pl-6 lg:pl-0">
          <CourseCta course={course.slug} published={published} total={all.length} titles={titles} />
        </div>
      </section>

      <RouteMap
        course={course.slug}
        published={published}
        modules={course.modules.map((m) => ({
          n: m.n,
          title: m.title,
          goal: m.goal,
          lessons: m.lessons.map((l) => ({ n: l.n, title: l.title })),
        }))}
      />

      {course.library.length > 0 && (
        <section className="mt-20 border-t border-rule pt-10">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Asosiy manbalar</h2>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {course.library.map((b) => (
              <li key={b.href}>
                <a href={b.href} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
                  {b.title}
                </a>
                <span className="text-muted">, {b.by}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
