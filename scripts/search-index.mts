/**
 * Qidiruv indeksi (Pagefind): next build'dan oldin public/pagefind ga yoziladi.
 * Har dars - bitta sahifa; ## sarlavhalar id bilan, shuning uchun natijada bo'limga havola ham chiqadi.
 * Lug'at atamalari alohida yozuvlar. Kod bloklari indeksga kirmaydi; sarlavha va kurs nomi faqat meta
 * (data-pagefind-ignore meta'ni o'chirmaydi), aks holda natija matni sarlavhani takrorlaydi.
 *
 *   npm run search-index
 */
import path from "node:path";
import * as pagefind from "pagefind";
import { getLesson, listCourses, publishedNumbers } from "../src/lib/content";
import { glossary } from "../src/lib/glossary";
import { renderLesson } from "../src/lib/markdown";

const OUT = path.join(process.cwd(), "public", "pagefind");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function main() {
  const { index, errors } = await pagefind.createIndex({ forceLanguage: "uz" });
  if (!index) throw new Error(errors.join("\n"));
  let pages = 0;

  for (const course of listCourses())
    for (const n of publishedNumbers(course)) {
      const lesson = getLesson(course, n)!;
      const { html } = await renderLesson(lesson.body, { course: course.slug, n });
      const body = html.replace(/<pre\b/g, "<pre data-pagefind-ignore");
      const doc = `<html lang="uz"><body><main data-pagefind-body>
<h1 data-pagefind-meta="title" data-pagefind-ignore>${esc(`${n}. ${lesson.title}`)}</h1>
<p data-pagefind-meta="course" data-pagefind-filter="kurs" data-pagefind-ignore>${esc(course.title)}</p>
${body}</main></body></html>`;
      const r = await index.addHTMLFile({ url: `/${course.slug}/dars/${n}`, content: doc });
      if (r.errors.length) throw new Error(`${course.slug}#${n}: ${r.errors.join("; ")}`);
      pages++;
    }

  for (const g of glossary()) {
    const r = await index.addCustomRecord({
      url: `/lugat#${g.slug}`,
      content: [g.term, g.aliases.join(", "), g.uz].filter(Boolean).join(". "),
      language: "uz",
      meta: { title: g.term, course: "Lug'at" },
      filters: { kurs: ["Lug'at"] },
    });
    if (r.errors.length) throw new Error(`lug'at ${g.term}: ${r.errors.join("; ")}`);
  }

  const w = await index.writeFiles({ outputPath: OUT });
  if (w.errors.length) throw new Error(w.errors.join("\n"));
  await pagefind.close();
  console.log(`search-index: ${pages} ta dars, ${glossary().length} ta atama -> public/pagefind`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
