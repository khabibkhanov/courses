import Link from "next/link";
import { listCourses, publishedNumbers, syllabus } from "@/lib/content";
import { siteStats, RUNNABLE_LANGUAGES } from "@/lib/stats";
import { faqItems } from "@/lib/faq";
import { MetroHero } from "@/components/metro-hero";
import { CourseCta } from "@/components/course-cta";
import { FaqList } from "@/components/faq-list";

const PRINCIPLES = [
  {
    title: "Manbaga asoslangan",
    text: "Har darsning oxirida haqiqiy manbalar: rasmiy hujjat, RFC, original maqola, kitob. Yozilgan darsni uni yozmagan tekshiruvchi birlamchi manbalar bilan solishtiradi.",
  },
  {
    title: "Kod darsning ichida ishlaydi",
    text: `${RUNNABLE_LANGUAGES.join(", ")} brauzerning o'zida, Go rasmiy Go Playground orqali ishlaydi. O'rnatish shart emas, misolni darsning ichida o'zgartirib ishga tushirasiz. Ba'zi mashqlar yashirin testlar bilan tekshiriladi.`,
  },
  {
    title: "Tushunganingiz tekshiriladi",
    text: "Har dars testlar va amaliy topshiriq bilan tugaydi. Topshiriq javobi saytda yoziladi va progressingiz brauzeringizda saqlanadi.",
  },
  {
    title: "Xatoni belgilab xabar qiling",
    text: "Matnni belgilang va izoh qoldiring: izoh aynan shu jumla bilan saqlanadi. Tuzatishlar o'quvchilar izohlari asosida kiritiladi.",
  },
];

const STEPS = [
  { title: "Darsni o'qing", text: "Mexanika, misollar va hisob-kitoblar. Atama birinchi uchraganda ustiga bosing: qisqa izoh chiqadi." },
  { title: "Kodni ishga tushiring", text: "Misolni o'zgartiring va natijani ko'ring. Xato bo'lsa, qator va ustun bilan ko'rsatiladi." },
  { title: "Testdan o'ting", text: "Savollarga javob bering. O'tish chegarasi kursga qarab belgilangan." },
  { title: "Topshiriqni bajaring", text: "Amaliy topshiriqni yeching, keyin darsga baho bering yoki xatoni belgilang." },
];

export default function HomePage() {
  const stats = siteStats();
  const courses = listCourses().map((c) => {
    const all = syllabus(c);
    return {
      course: c,
      total: all.length,
      published: publishedNumbers(c),
      titles: Object.fromEntries(all.map((l) => [l.n, l.title])),
    };
  });

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <section className="pt-14 pb-8 sm:pt-24">
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Dasturlashni o&apos;zbek tilida, ichidan o&apos;rganing.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
            Computer science asoslari, toza kod, system design va Go. Har dars manbalarga tayanadi va test hamda amaliy
            topshiriq bilan tugaydi. Ro&apos;yxatdan o&apos;tish shart emas.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#kurslar"
              className="rounded-lg bg-ink px-5 py-3 font-medium text-paper hover:opacity-90"
            >
              Kurslarni ko&apos;rish
            </a>
            <Link href="/haqida" className="font-medium underline underline-offset-4 hover:no-underline">
              Platforma haqida
            </Link>
          </div>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {[
              [stats.courses, "kurs"],
              [stats.lessons, "dars"],
              [stats.terms, "atama lug'atda"],
              [RUNNABLE_LANGUAGES.length + 1, "til darsda ishlaydi"],
            ].map(([n, label]) => (
              <div key={label} className="border-l-2 border-ink pl-3">
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-semibold tracking-tight">{n}</dd>
                <dd className="text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="-mx-2 mb-20 sm:mx-0">
          <MetroHero
            lines={courses.map(({ course, published }) => ({
              slug: course.slug,
              title: course.title,
              color: course.color,
              published,
              modules: course.modules.map((m) => ({ n: m.n, title: m.title, lessons: m.lessons.map((l) => l.n) })),
            }))}
          />
        </section>

        <section className="mb-24">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Nima bilan boshqa kurslardan farq qiladi
          </h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="border-t border-rule pt-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 max-w-[55ch] leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="kurslar" className="mb-24 scroll-mt-20">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">Kurslar</h2>
          <div className="border-t border-rule">
            {courses.map(({ course, total, published, titles }) => (
              <article
                key={course.slug}
                style={{ "--line": course.color } as React.CSSProperties}
                className="grid gap-6 border-b border-rule py-10 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-12"
              >
                <div className="relative pl-6">
                  <span aria-hidden className="absolute top-1 bottom-1 left-0 w-1.5 rounded-full bg-line" />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    <Link href={`/${course.slug}`} className="underline-offset-4 hover:underline">
                      {course.title}
                    </Link>
                  </h3>
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
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bitta dars qanday o&apos;tadi</h2>
          <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t border-ink pt-4">
                <p className="text-sm text-muted">{i + 1}-qadam</p>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ko&apos;p so&apos;raladigan savollar</h2>
            <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">
              Narx, progress, kod ishga tushirish va ma&apos;lumotlar haqida qisqa javoblar.
            </p>
            <Link href="/faq" className="mt-5 inline-block font-medium underline underline-offset-4 hover:no-underline">
              Hamma savollar
            </Link>
          </div>
          <FaqList items={faqItems().slice(0, 4)} />
        </section>
      </div>

      <section className="border-t border-rule bg-sheet">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Birinchi darsdan boshlang</h2>
            <p className="mt-2 max-w-[55ch] text-muted">
              Hisob ochish kerak emas. Progress shu brauzerda saqlanadi.
            </p>
          </div>
          <a href="#kurslar" className="self-start rounded-lg bg-ink px-5 py-3 font-medium text-paper hover:opacity-90 sm:self-auto">
            Kursni tanlash
          </a>
        </div>
      </section>
    </>
  );
}
