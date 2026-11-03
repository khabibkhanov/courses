import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/faq";

/** Ochiladigan savol-javoblar: <details>, JavaScript kerak emas. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-rule">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <Plus
              size={18}
              aria-hidden
              className="mt-1 shrink-0 text-muted transition-transform group-open:rotate-45"
            />
          </summary>
          <p className="max-w-[65ch] pb-5 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
