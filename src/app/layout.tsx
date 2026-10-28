import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/400-italic.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
                <Logo />
                {SITE.name}
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-rule">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">
              Darslar ochiq manbalarga tayanadi, har bir darsning oxirida manbalar ro&apos;yxati bor.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

/** Uchta liniya bitta bekatda kesishadi: kurslar xaritasining belgisi. */
function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <path d="M3 6 H8 L14 16 H19" fill="none" stroke="#d4283a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M3 11 H19" fill="none" stroke="#0f8a55" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M3 16 H8 L14 6 H19" fill="none" stroke="#2a5bd7" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="11" cy="11" r="3.2" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.6" />
    </svg>
  );
}
