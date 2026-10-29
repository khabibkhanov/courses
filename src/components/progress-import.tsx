"use client";

import { useEffect, useState } from "react";
import { importProgress, LEGACY_KEYS } from "@/lib/progress";

/**
 * Eski saytlar (system-design-uz, cs50-uz, clean-code-khaki .vercel.app) o'quvchini shu saytga
 * `#progress=<base64url JSON {kalit: qiymat}>` bilan yo'naltiradi: progress shu yerga qo'shiladi va hash o'chiriladi.
 */
export function ProgressImport() {
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const m = location.hash.match(/^#progress=([\w-]+)/);
    if (!m) return;
    let added = 0;
    try {
      const json = atob(m[1].replace(/-/g, "+").replace(/_/g, "/"));
      const data = JSON.parse(decodeURIComponent(escape(json))) as Record<string, string>;
      for (const [k, raw] of Object.entries(data)) if (LEGACY_KEYS[k]) added += importProgress(LEGACY_KEYS[k], raw);
    } catch {
      // Buzilgan havola: progressga tegmaymiz.
    }
    history.replaceState(null, "", location.pathname + location.search);
    const t = setTimeout(() => setNote(null), 6000);
    // Effect ichida bir marta: tashqi manbadan (URL) kelgan natijani ko'rsatish.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNote(added ? `Eski saytdagi progress ko'chirildi: ${added} ta o'tilgan dars.` : "Sayt yangi manzilga ko'chdi.");
    return () => clearTimeout(t);
  }, []);

  if (!note) return null;
  return (
    <div role="status" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-lg border border-rule bg-sheet px-4 py-2 text-sm shadow-lg">
      {note}
    </div>
  );
}
