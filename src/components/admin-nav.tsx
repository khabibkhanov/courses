"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Baholar" },
  { href: "/admin/izohlar", label: "Matnga izohlar" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="mb-10 flex gap-6 border-b border-rule">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={path === l.href ? "page" : undefined}
          className={`-mb-px border-b-2 pb-3 font-medium ${path === l.href ? "border-ink" : "border-transparent text-muted hover:text-ink"}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
