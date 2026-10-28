/**
 * Kontent tekshiruvi (build oldidan ishlaydi).
 *
 *   npm run validate                        - barcha kurslar, faqat yozilgan darslar
 *   npm run validate -- system-design 1 10  - bitta kurs, darslar oralig'i
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCourse, getLesson, listCourses, publishedNumbers, syllabus, type Course, type Lesson } from "../src/lib/content";

const [onlyCourse, fromArg, toArg] = process.argv.slice(2);
const from = Number(fromArg ?? 1);
const to = Number(toArg ?? Number.MAX_SAFE_INTEGER);

const FORBIDDEN_DASHES = /[—–]/;
// Ommaviy kurs: real kompaniya nomi va "chatga yuborish" ish tartibi matnda qolmaydi.
const FORBIDDEN_TEXT = [/iquarix/i, /chatga yuboring/i];

const errors: string[] = [];
let checked = 0;

const words = (s: string) => s.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
const headings = (body: string) => [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());

/** Format bo'yicha sifat qoidalari: har kurs o'z dars standartiga ega (docs/<kurs>/). */
const RULES: Record<Course["format"], (l: Lesson, raw: string) => string[]> = {
  "lessons-md": (l) => {
    const e: string[] = [];
    for (const s of ["Ko'p uchraydigan xatolar", "Xulosa", "Amaliy topshiriq", "Manbalar"])
      if (!l.body.includes(`## ${s}`)) e.push(`bo'lim yo'q: ${s}`);
    if (/^# /m.test(l.body)) e.push("# sarlavha bor");
    if (!l.body.includes("```mermaid")) e.push("mermaid yo'q");
    if (!/\n\|.*\|\n\|[-| :]+\|/.test(l.body)) e.push("jadval yo'q");
    const links = (l.body.split("## Manbalar")[1] ?? "").match(/\]\(https?:\/\//g) ?? [];
    if (links.length < 3) e.push(`manba havolalari kam: ${links.length}`);
    if (words(l.body) < 1800) e.push(`qisqa: ${words(l.body)} so'z`);
    if (!l.quiz) e.push("quiz yo'q");
    else {
      if (l.quiz.questions.length !== 10) e.push(`savollar ${l.quiz.questions.length}`);
      l.quiz.questions.forEach((q, i) => q.options.length !== 4 && e.push(`savol ${i + 1}: 4 variant emas`));
    }
    return e;
  },
  "clean-code": (l, raw) => {
    const e: string[] = [];
    const { data } = matter(raw);
    if (data.n !== l.n) e.push(`frontmatter n=${data.n} mos emas`);
    if (data.title !== l.title) e.push("frontmatter title syllabus bilan mos emas");
    const hs = headings(l.body);
    for (const s of ["Muammo", "Asosiy g'oya", "Chuqurroq", "Misol", "Qachon qo'llamaslik kerak", "Xulosa"])
      if (!hs.some((h) => h.startsWith(s))) e.push(`"## ${s}" bo'limi yo'q`);
    if (words(l.body) < 1100) e.push(`qisqa: ${words(l.body)} so'z`);
    if (!/```(ts|tsx|js|typescript)\n/.test(l.body)) e.push("ts/tsx kod bloki yo'q");
    return e;
  },
};

function rawFiles(course: Course, n: number): string[] {
  const dir = path.join(process.cwd(), "content", course.slug);
  const pad = String(n).padStart(3, "0");
  if (course.format === "lessons-md") return [`${pad}.md`, `${pad}.quiz.json`].map((f) => path.join(dir, f));
  return fs.readdirSync(path.join(dir, "lessons")).filter((f) => f.startsWith(`${pad}-`)).map((f) => path.join(dir, "lessons", f));
}

const courses = onlyCourse ? [getCourse(onlyCourse)] : listCourses();
for (const course of courses) {
  if (!course) {
    errors.push(`kurs topilmadi: ${onlyCourse}`);
    continue;
  }
  syllabus(course).forEach((l, i) => l.n !== i + 1 && errors.push(`${course.slug}: dars raqami ketma-ket emas (${l.n})`));

  for (const n of publishedNumbers(course)) {
    if (n < from || n > to) continue;
    const where = `${course.slug}#${n}`;
    checked++;
    let lesson: Lesson | null;
    try {
      lesson = getLesson(course, n);
    } catch (err) {
      errors.push(`${where}: ${(err as Error).message.split("\n").slice(0, 6).join(" ")}`);
      continue;
    }
    if (!lesson) continue;
    const files = rawFiles(course, n);
    const raw = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
    const e = RULES[course.format](lesson, fs.readFileSync(files[0], "utf8"));
    if (course.format === "lessons-md" && matter(fs.readFileSync(files[0], "utf8")).data.title !== lesson.title)
      e.push("frontmatter title syllabus bilan mos emas");
    if (FORBIDDEN_DASHES.test(raw)) e.push("em/en-dash bor, faqat \"-\" ruxsat");
    for (const re of FORBIDDEN_TEXT) if (re.test(raw)) e.push(`taqiqlangan matn: ${re.source}`);
    for (const q of lesson.quiz?.questions ?? []) if (q.answer >= q.options.length) e.push("quiz javob indeksi xato");
    errors.push(...e.map((x) => `${where}: ${x}`));
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} ta xato, ${checked} ta dars tekshirildi`);
  process.exit(1);
}
console.log(`OK: ${checked} ta dars tekshirildi`);
