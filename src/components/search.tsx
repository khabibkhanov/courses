"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

/** Pagefind (public/pagefind, build paytida yaratiladi) natijalari. */
type Hit = {
  url: string;
  title: string;
  course: string;
  excerpt: string;
  sections: { url: string; title: string; excerpt: string }[];
};

type Pagefind = {
  search: (q: string) => Promise<{
    results: {
      data: () => Promise<{
        url: string;
        excerpt: string;
        meta: { title?: string; course?: string };
        sub_results?: { url: string; title: string; excerpt: string }[];
      }>;
    }[];
  } | null>;
  debouncedSearch: Pagefind["search"];
};

let engine: Promise<Pagefind> | null = null;
// Bundler bu import'ga tegmasin: fayl faqat build'dan keyin public/ da paydo bo'ladi.
const load = () => (engine ??= new Function("u", "return import(u)")("/pagefind/pagefind.js") as Promise<Pagefind>);

const LIMIT = 8;

/** Sarlavhadagi qidiruv tugmasi va oynasi: Ctrl+K yoki "/" bilan ochiladi. */
export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable=true], .cm-editor");
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    load().catch(() => setFailed(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function search(q: string) {
    setQuery(q);
    if (!q.trim()) return setHits(null);
    try {
      const res = await (await load()).debouncedSearch(q);
      if (!res) return; // keyingi harf yozildi, bu qidiruv bekor
      const data = await Promise.all(res.results.slice(0, LIMIT).map((r) => r.data()));
      setHits(
        data.map((d) => ({
          url: d.url,
          title: d.meta.title ?? d.url,
          course: d.meta.course ?? "",
          excerpt: d.excerpt,
          sections: (d.sub_results ?? []).filter((s) => s.url !== d.url).slice(0, 2),
        })),
      );
      setActive(0);
    } catch {
      setFailed(true);
    }
  }

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (!hits?.length) return;
    if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, hits.length - 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
    else if (e.key === "Enter") go(hits[active].url);
    else return;
    e.preventDefault();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-rule px-2 py-1 text-sm text-muted hover:border-muted hover:text-ink sm:pr-1.5"
        aria-label="Qidirish"
      >
        <SearchIcon size={15} aria-hidden />
        <span className="hidden sm:inline">Qidirish</span>
        <kbd className="hidden rounded border border-rule px-1 font-mono text-[0.7rem] sm:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center bg-ink/30 px-4 pt-[10vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div role="dialog" aria-label="Qidiruv" className="w-full max-w-2xl overflow-hidden rounded-xl border border-rule bg-sheet shadow-2xl" onKeyDown={onKeyDown}>
            <label className="flex items-center gap-2 border-b border-rule px-4 py-3">
              <SearchIcon size={18} className="shrink-0 text-muted" aria-hidden />
              <input
                ref={input}
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Darslar va atamalar bo'yicha qidirish"
                aria-label="Qidiruv so'zi"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted"
              />
              <kbd className="rounded border border-rule px-1.5 font-mono text-xs text-muted">Esc</kbd>
            </label>
            <div className="max-h-[65vh] overflow-y-auto">
              {failed && <p className="p-4 text-sm text-warn">Qidiruv yuklanmadi. Sahifani yangilab ko&apos;ring.</p>}
              {hits?.length === 0 && <p className="p-4 text-sm text-muted">Hech narsa topilmadi.</p>}
              {hits?.map((h, i) => (
                <div key={h.url} className={`border-b border-rule last:border-0 ${i === active ? "bg-soft" : ""}`} onMouseEnter={() => setActive(i)}>
                  <button type="button" onClick={() => go(h.url)} className="block w-full px-4 pt-3 pb-2 text-left">
                    <span className="text-xs text-muted">{h.course}</span>
                    <span className="block font-medium">{h.title}</span>
                    <span className="search-excerpt mt-1 block text-sm leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: h.excerpt }} />
                  </button>
                  {h.sections.map((s) => (
                    <button key={s.url} type="button" onClick={() => go(s.url)} className="block w-full px-4 pb-2 pl-8 text-left text-sm">
                      <span className="text-ink"># {s.title}</span>
                      <span className="search-excerpt block text-xs leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: s.excerpt }} />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
