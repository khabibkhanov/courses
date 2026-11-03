import Link from "next/link";
import { listCourses } from "@/lib/content";
import { SITE } from "@/lib/site";

/** Korporativ footer: kurslar, sayt bo'limlari va huquqiy havolalar. */
export function SiteFooter() {
  const courses = listCourses();
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-semibold">{SITE.name}</p>
          <p className="mt-2 max-w-[38ch] leading-relaxed text-muted">
            O&apos;zbek tilidagi chuqur dasturlash kurslari. Darslar ochiq manbalarga tayanadi, har darsning oxirida
            manbalar ro&apos;yxati bor.
          </p>
        </div>
        <nav aria-label="Kurslar">
          <p className="font-medium">Kurslar</p>
          <ul className="mt-3 space-y-2">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-muted hover:text-ink">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Sayt">
          <p className="font-medium">Sayt</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/haqida" className="text-muted hover:text-ink">
                Haqida
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-muted hover:text-ink">
                Ko&apos;p so&apos;raladigan savollar
              </Link>
            </li>
            <li>
              <Link href="/lugat" className="text-muted hover:text-ink">
                Atamalar lug&apos;ati
              </Link>
            </li>
            <li>
              <Link href="/maxfiylik" className="text-muted hover:text-ink">
                Maxfiylik
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-muted">
          &copy; {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  );
}
