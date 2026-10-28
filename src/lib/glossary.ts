import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";
import { getCourse, syllabus } from "./content";

/** content/glossary/*.yaml - atamalar lug'ati. Har atama o'zi tushuntirilgan darsga bog'lanadi. */
const entrySchema = z.object({
  term: z.string().min(2),
  aliases: z.array(z.string().min(2)).default([]),
  uz: z.string().min(10).max(400),
  course: z.string().regex(/^[a-z0-9-]+$/),
  lesson: z.number().int().positive(),
});

export type GlossaryEntry = z.infer<typeof entrySchema> & {
  slug: string;
  /** Batafsil tushuntirilgan dars: havola va yozuv. */
  href: string;
  where: string;
};

const DIR = path.join(process.cwd(), "content", "glossary");

export const termSlug = (term: string) =>
  term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let cache: GlossaryEntry[] | null = null;

/** Bir atama ikki kursda alohida tushuntirilishi mumkin (DDD): unda slug'ga kurs qo'shiladi. */
export function glossary(): GlossaryEntry[] {
  if (cache) return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".yaml")) : [];
  const raw = files.flatMap((f) => {
    const parsed = z.array(entrySchema).safeParse(YAML.parse(fs.readFileSync(path.join(DIR, f), "utf8")) ?? []);
    if (!parsed.success) throw new Error(`content/glossary/${f}: ${parsed.error.message}`);
    return parsed.data;
  });
  const courses = new Map<string, Set<string>>();
  for (const e of raw) courses.set(termSlug(e.term), (courses.get(termSlug(e.term)) ?? new Set()).add(e.course));
  cache = raw
    .map((e) => {
      const course = getCourse(e.course);
      const lesson = course && syllabus(course).find((l) => l.n === e.lesson);
      if (!course || !lesson) throw new Error(`lug'at: "${e.term}" uchun dars topilmadi (${e.course} #${e.lesson})`);
      return {
        ...e,
        slug: courses.get(termSlug(e.term))!.size > 1 ? `${termSlug(e.term)}-${e.course}` : termSlug(e.term),
        href: `/${course.slug}/dars/${e.lesson}`,
        where: `${course.title}, ${e.lesson}-dars: ${lesson.title}`,
      };
    })
    .sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));
  return cache;
}

// So'z chegarasi: lotin harf, raqam, "_" va "-" so'z ichida hisoblanadi ("cache" "cache-aside" ichida topilmaydi).
const WORD = "A-Za-z0-9_\\-";
/**
 * O'zbekcha qo'shimchalar atamaga qo'shib yoziladi ("texnik qarzni", "branded tiplar"): faqat shu ro'yxatdagilar,
 * shuning uchun inglizcha "indexing" "index" deb topilmaydi.
 */
const SUFFIX = "(?:lar)?(?:im|ing|imiz|ingiz|i|si)?(?:ni|ning|ga|ka|qa|da|ta|dan|tan|dagi|gacha|dek|day|cha)?";
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Bosh harfli qisqartmalar (SRP, DRY) faqat aynan shu ko'rinishda topiladi. */
const isAcronym = (form: string) => /^[A-Z0-9]{2,}$/.test(form);

export type TermMatcher = {
  /** Matndagi barcha mosliklar: [boshlanish, oxir, atama]. */
  find(text: string): { start: number; end: number; entry: GlossaryEntry }[];
};

const matchers = new Map<string, TermMatcher>();

/** Bitta kurs atamalari bo'yicha qidiruvchi: atama faqat o'z kursi darslarida bog'lanadi. */
export function termMatcher(course: string): TermMatcher {
  const cached = matchers.get(course);
  if (cached) return cached;
  const byForm = new Map<string, { form: string; entry: GlossaryEntry }>();
  for (const entry of glossary().filter((e) => e.course === course))
    for (const form of [entry.term, ...entry.aliases]) byForm.set(form.toLowerCase(), { form, entry });
  const forms = [...byForm.values()].map((f) => f.form).sort((a, b) => b.length - a.length);
  const re = forms.length ? new RegExp(`(?<![${WORD}])(?<t>${forms.map(escape).join("|")})${SUFFIX}(?![${WORD}])`, "gi") : null;
  const matcher: TermMatcher = {
    find(text) {
      if (!re) return [];
      const out: { start: number; end: number; entry: GlossaryEntry }[] = [];
      for (const m of text.matchAll(re)) {
        const stem = m.groups!.t;
        const hit = byForm.get(stem.toLowerCase());
        if (!hit || (isAcronym(hit.form) && stem !== hit.form)) continue;
        out.push({ start: m.index, end: m.index + m[0].length, entry: hit.entry });
      }
      return out;
    },
  };
  matchers.set(course, matcher);
  return matcher;
}
