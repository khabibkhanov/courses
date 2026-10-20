import { courses } from "@/courses";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Kurslar</h1>
      <p className="mt-3 max-w-prose text-muted">
        O&apos;zbek tilidagi chuqur texnik kurslar. Har bir dars manbalarga tayanadi, test va
        amaliy topshiriq bilan tugaydi.
      </p>
      <ul className="mt-10 divide-y divide-rule border-y border-rule">
        {courses.map((c) => (
          <li key={c.slug}>
            {/* Each course is a separate zone: plain <a> for a hard navigation. */}
            <a href={`/${c.slug}`} className="group block py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold group-hover:text-accent">{c.title}</h2>
                <span className="shrink-0 text-sm text-muted">
                  {c.lessons} dars, {c.modules} modul
                </span>
              </div>
              <p className="mt-2 text-muted">{c.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
