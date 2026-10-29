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
import { STDIN_LANGS, TESTABLE, runLang } from "../src/lib/playground";
import { glossary, termMatcher } from "../src/lib/glossary";

const [onlyCourse, fromArg, toArg] = process.argv.slice(2);
const from = Number(fromArg ?? 1);
const to = Number(toArg ?? Number.MAX_SAFE_INTEGER);

const FORBIDDEN_DASHES = /[—–]/;
// Ommaviy kurs: real kompaniya nomi va "chatga yuborish" ish tartibi matnda qolmaydi.
const FORBIDDEN_TEXT = [/iquarix/i, /chatga yuboring/i];

const errors: string[] = [];
let checked = 0;

/** Kod bloklarisiz matn: kod ichidagi `# komment` sarlavha deb hisoblanmasin. */
const prose = (s: string) => s.replace(/```[\s\S]*?```/g, " ");
const words = (s: string) => prose(s).split(/\s+/).filter(Boolean).length;
const headings = (body: string) => [...prose(body).matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());

/** Format bo'yicha sifat qoidalari: har kurs o'z dars standartiga ega (docs/<kurs>/). */
const RULES: Record<Course["format"], (l: Lesson, raw: string) => string[]> = {
  "lessons-md": (l) => {
    const e: string[] = [];
    for (const s of ["Ko'p uchraydigan xatolar", "Xulosa", "Amaliy topshiriq", "Manbalar"])
      if (!l.body.includes(`## ${s}`)) e.push(`bo'lim yo'q: ${s}`);
    if (/^# /m.test(prose(l.body))) e.push("# sarlavha bor");
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
    if (!/```(ts|tsx|js|typescript)[ \t\n]/.test(l.body)) e.push("ts/tsx kod bloki yo'q");
    return e;
  },
};

/** ```<til> run va undan keyin keladigan ```<til> test / ```text stdin bloklari qoidalari. */
function checkRunBlocks(body: string): string[] {
  const e: string[] = [];
  const blocks = [...body.matchAll(/^```(\w*)([^\n]*)\n[\s\S]*?^```[ \t]*$/gm)].map((m) => ({
    lang: m[1],
    run: /(^|\s)run(\s|$)/.test(m[2]),
    test: /(^|\s)test(\s|$)/.test(m[2]),
    stdin: /(^|\s)stdin(\s|$)/.test(m[2]),
    start: m.index!,
    end: m.index! + m[0].length,
  }));
  blocks.forEach((b, i) => {
    if (b.run && !runLang(b.lang)) e.push(`"run" bloki uchun til qo'llab-quvvatlanmaydi: ${b.lang || "(yo'q)"}`);
    if (!b.test && !b.stdin) return;
    // Biriktiriladigan bloklar zanjiri: run, keyin test va/yoki stdin, orasida matn yo'q.
    let k = i - 1;
    while (k >= 0 && (blocks[k].test || blocks[k].stdin) && body.slice(blocks[k].end, blocks[k + 1].start).trim() === "") k--;
    const run = blocks[k];
    const tag = b.test ? "test" : "stdin";
    if (!run?.run || body.slice(run.end, blocks[k + 1].start).trim() !== "")
      e.push(`"${tag}" bloki darhol "run" blokidan keyin kelishi kerak (${b.lang})`);
    else if (b.test && runLang(run.lang) !== runLang(b.lang)) e.push(`"test" bloki tili "run" bloki tili bilan bir xil emas`);
    else if (b.test && !TESTABLE.includes(runLang(b.lang)!)) e.push(`"test" bloki ${b.lang} uchun qo'llab-quvvatlanmaydi`);
    else if (b.stdin && !STDIN_LANGS.includes(runLang(run.lang)!)) e.push(`"stdin" bloki ${run.lang} uchun qo'llab-quvvatlanmaydi`);
  });
  return e;
}

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
    e.push(...checkRunBlocks(lesson.body));
    errors.push(...e.map((x) => `${where}: ${x}`));
  }
}

/**
 * Lug'at: sxema, takrorlanmaslik, atama o'z darsida va umuman darslar matnida uchrashi
 * (aks holda dars raqami xato yoki atama hech qayerda bog'lanmaydi).
 */
function checkGlossary() {
  const e: string[] = [];
  let entries;
  try {
    entries = glossary();
  } catch (err) {
    return [(err as Error).message.split("\n").slice(0, 6).join(" ")];
  }
  const forms = new Map<string, string>();
  const slugs = new Set<string>();
  for (const g of entries) {
    if (slugs.has(g.slug)) e.push(`takroriy atama: ${g.term} (${g.course})`);
    slugs.add(g.slug);
    for (const f of [g.term, ...g.aliases]) {
      const k = `${g.course}:${f.toLowerCase()}`;
      if (forms.has(k) && forms.get(k) !== g.slug) e.push(`"${f}" ikki atamada: ${forms.get(k)}, ${g.slug}`);
      forms.set(k, g.slug);
    }
    if (FORBIDDEN_DASHES.test(g.term + g.uz + g.aliases.join(""))) e.push(`${g.term}: em/en-dash bor`);
  }
  const found = new Set<string>();
  const inOwn = new Set<string>();
  for (const course of listCourses())
    for (const n of publishedNumbers(course)) {
      const lesson = getLesson(course, n);
      // Sarlavha ham hisobga olinadi: atama ba'zan matnda emas, dars nomida turadi.
      for (const m of termMatcher(course.slug).find(`${lesson?.title ?? ""}\n${prose(lesson?.body ?? "")}`)) {
        found.add(m.entry.slug);
        if (m.entry.course === course.slug && m.entry.lesson === n) inOwn.add(m.entry.slug);
      }
    }
  for (const g of entries) {
    const course = getCourse(g.course)!;
    if (!publishedNumbers(course).includes(g.lesson)) e.push(`${g.term}: ${g.course} #${g.lesson} hali yozilmagan`);
    else if (!found.has(g.slug)) e.push(`${g.term}: kurs darslari matnida uchramaydi`);
    else if (!inOwn.has(g.slug)) e.push(`${g.term}: o'z darsida (${g.course} #${g.lesson}) uchramaydi`);
  }
  return e.map((x) => `lug'at: ${x}`);
}

if (!onlyCourse) errors.push(...checkGlossary());

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} ta xato, ${checked} ta dars tekshirildi`);
  process.exit(1);
}
console.log(`OK: ${checked} ta dars tekshirildi`);
