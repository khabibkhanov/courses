"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const NAV_LINKS = [
  { href: "/#kurslar", label: "Kurslar" },
  { href: "/haqida", label: "Haqida" },
  { href: "/faq", label: "FAQ" },
  { href: "/lugat", label: "Lug'at" },
] as const;

/** Sarlavhadagi asosiy havolalar: keng ekranda qatorda, telefonda ochiladigan ro'yxat. */
export function SiteNav() {
  const pathname = usePathname();
  // Menyu qaysi sahifada ochilgani eslab qolinadi: sahifa almashganda u o'zi yopiladi.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  const active = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <ul className="hidden items-center gap-5 md:flex">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active(l.href) ? "page" : undefined}
              className={`text-sm hover:text-ink ${active(l.href) ? "font-medium text-ink" : "text-muted"}`}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpenAt(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
        className="grid h-8 w-8 place-items-center rounded-md text-muted hover:text-ink md:hidden"
      >
        {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-rule bg-paper px-4 py-2 shadow-sm md:hidden"
        >
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className={`block border-b border-rule py-3 last:border-0 ${active(l.href) ? "font-medium" : "text-muted"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
