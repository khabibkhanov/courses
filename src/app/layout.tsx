import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kurslar", template: "%s | Kurslar" },
  description: "Chuqur, manbalarga tayangan dasturlash kurslari o'zbek tilida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6">
            <a href="/" className="font-semibold tracking-tight">
              Kurslar
            </a>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
