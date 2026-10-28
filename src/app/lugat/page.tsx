import type { Metadata } from "next";
import { getCourse } from "@/lib/content";
import { glossary } from "@/lib/glossary";
import { GlossaryList, type GlossaryItem } from "./glossary-list";

export const metadata: Metadata = {
  title: "Atamalar lug'ati",
  description: "Kurslardagi texnik atamalar: qisqa o'zbekcha izoh va ular batafsil tushuntirilgan dars.",
};

export default function GlossaryPage() {
  const items: GlossaryItem[] = glossary().map((e) => ({
    slug: e.slug,
    term: e.term,
    aliases: e.aliases,
    uz: e.uz,
    href: e.href,
    where: e.where,
    color: getCourse(e.course)?.color ?? "currentColor",
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Atamalar lug&apos;ati</h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">
        Kurslarda uchraydigan {items.length} ta texnik atama: qisqa izoh va atama batafsil tushuntirilgan dars. Darslar
        matnida atama birinchi uchragan joyda nuqtali chiziq bilan belgilanadi.
      </p>
      <GlossaryList items={items} />
    </div>
  );
}
