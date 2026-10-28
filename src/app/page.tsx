import Link from "next/link";
import { listCourses, publishedNumbers, syllabus } from "@/lib/content";
import { MetroHero } from "@/components/metro-hero";
import { CourseCta } from "@/components/course-cta";

export default function HomePage() {
  const courses = listCourses().map((c) => {
    const all = syllabus(c);
    return {
      course: c,
      total: all.length,
      published: publishedNumbers(c),
      titles: Object.fromEntries(all.map((l) => [l.n, l.title])),
    };
  });
  const totalLessons = courses.reduce((s, c) => s + c.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pt-14 pb-6 sm:pt-20">
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          {courses.length} ta kurs, {totalLessons} ta dars.
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted">
          O&apos;zbek tilida, manbalarga tayangan holda: kompyuter ichida nima bo&apos;layotganidan toza kod va katta
          tizimlar dizaynigacha. Har bir dars test va amaliy topshiriq bilan tugaydi.
        </p>
      </section>

      <section className="-mx-2 mb-14 sm:mx-0">
        <MetroHero
          lines={courses.map(({ course, total, published }) => ({
            slug: course.slug,
            title: course.title,
            color: course.color,
            lessons: total,
            published: published.length,
            modules: course.modules.length,
          }))}
        />
      </section>

      <section className="mb-24 border-t border-rule">
        {courses.map(({ course, total, published, titles }) => (
          <article
            key={course.slug}
            style={{ "--line": course.color } as React.CSSProperties}
            className="grid gap-6 border-b border-rule py-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-12"
          >
            <div className="relative pl-6">
              <span aria-hidden className="absolute top-1 bottom-1 left-0 w-1.5 rounded-full bg-line" />
              <h2 className="text-2xl font-semibold tracking-tight">
                <Link href={`/${course.slug}`} className="hover:underline underline-offset-4">
                  {course.title}
                </Link>
              </h2>
              <p className="mt-1 text-muted">{course.subtitle}</p>
              <p className="mt-4 max-w-[65ch] leading-relaxed">{course.description}</p>
              <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">
                <span className="font-medium text-ink">Kim uchun.</span> {course.audience}
              </p>
            </div>
            <div className="pl-6 md:pt-1 md:pl-0">
              <CourseCta course={course.slug} published={published} total={total} titles={titles} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
