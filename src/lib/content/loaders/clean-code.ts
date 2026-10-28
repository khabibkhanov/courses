import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { z } from "zod";
import type { LessonLoader } from "..";

// Format: lessons/NNN-slug.md, frontmatter ichida test, topshiriq va manba id'lari; manbalar - sources.yaml.

const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int(),
  kind: z.enum(["book", "paper", "article", "web", "docs", "spec", "talk"]),
  url: z.url(),
});
const sourcesFile = z.record(z.string(), sourceSchema);

const frontmatter = z.object({
  n: z.number().int().positive(),
  slug: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1),
  duration: z.number().int().positive(),
  sources: z.array(z.object({ id: z.string().min(1), note: z.string().min(1) })).min(1),
  quiz: z
    .array(
      z.object({
        q: z.string().min(1),
        options: z.array(z.string().min(1)).min(3).max(5),
        answer: z.number().int().nonnegative(),
        explain: z.string().min(1),
      }),
    )
    .min(5),
  task: z.object({
    title: z.string().min(1),
    prompt: z.string().min(1),
    lang: z.string().min(1),
    starter: z.string().min(1),
    solution: z.string().min(1),
    solutionNotes: z.string().min(1),
    checklist: z.array(z.string().min(1)).min(3),
  }),
});

const sourcesCache = new Map<string, z.infer<typeof sourcesFile>>();

function sourcesOf(dir: string) {
  let s = sourcesCache.get(dir);
  if (!s) {
    s = sourcesFile.parse(YAML.parse(fs.readFileSync(path.join(dir, "sources.yaml"), "utf8")));
    sourcesCache.set(dir, s);
  }
  return s;
}

function file(dir: string, n: number, slug: string | undefined) {
  if (!slug) throw new Error(`clean-code formatida ${n}-darsga slug kerak`);
  return path.join(dir, "lessons", `${String(n).padStart(3, "0")}-${slug}.md`);
}

export const cleanCode: LessonLoader = {
  exists: (dir, entry) => fs.existsSync(file(dir, entry.n, entry.slug)),

  load(dir, course, entry) {
    const { data, content } = matter(fs.readFileSync(file(dir, entry.n, entry.slug), "utf8"));
    const fm = frontmatter.parse(data);
    const library = sourcesOf(dir);
    return {
      minutes: fm.duration,
      summary: fm.summary,
      body: content,
      quiz: {
        passScore: course.passScore,
        questions: fm.quiz.map(({ explain, ...q }) => ({ ...q, why: explain })),
      },
      task: fm.task,
      sources: fm.sources.map(({ id, note }) => {
        const s = library[id];
        if (!s) throw new Error(`${entry.n}-dars: noma'lum manba "${id}"`);
        return { title: s.title, author: s.author, year: s.year, url: s.url, note };
      }),
    };
  },
};
