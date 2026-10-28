"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

export type GlossaryItem = {
  slug: string;
  term: string;
  aliases: string[];
  uz: string;
  href: string;
  where: string;
  color: string;
};

const letter = (term: string) => {
  const c = term[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(c) ? c : "#";
};

/** Lug'at ro'yxati: harf bo'yicha guruhlar va atama, sinonim yoki izoh bo'yicha qidiruv. */
export function GlossaryList({ items }: { items: GlossaryItem[] }) {
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const shown = q
    ? items.filter((i) => [i.term, ...i.aliases, i.uz].some((s) => s.toLowerCase().includes(q)))
    : items;
  // Map.groupBy eski brauzerlarda yo'q.
  const groups = new Map<string, GlossaryItem[]>();
  for (const i of shown) groups.set(letter(i.term), [...(groups.get(letter(i.term)) ?? []), i]);

  return (
    <>
      <label className="sticky top-14 z-10 mt-8 flex items-center gap-2 rounded-lg border border-rule bg-sheet px-3 py-2 focus-within:border-muted">
        <Search size={16} className="shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Atama yoki izoh bo'yicha qidirish"
          aria-label="Lug'atdan qidirish"
          className="w-full bg-transparent outline-none placeholder:text-muted"
        />
      </label>

      {shown.length === 0 && <p className="mt-8 text-muted">Hech narsa topilmadi.</p>}

      {[...groups].map(([l, list]) => (
        <section key={l} className="mt-10">
          <h2 className="border-b border-rule pb-1 text-sm font-semibold text-muted">{l}</h2>
          <dl>
            {list.map((i) => (
              <div key={i.slug} id={i.slug} className="scroll-mt-32 border-b border-rule py-4 target:bg-soft">
                <dt className="font-semibold">
                  {i.term}
                  {i.aliases.length > 0 && <span className="font-normal text-muted"> ({i.aliases.join(", ")})</span>}
                </dt>
                <dd className="mt-1 leading-relaxed">{i.uz}</dd>
                <dd className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: i.color }} />
                  <Link href={i.href} className="underline-offset-2 hover:text-ink hover:underline">
                    {i.where}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
