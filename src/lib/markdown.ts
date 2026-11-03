import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import type { Element, ElementContent, Root, Text } from "hast";
import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";
import type { VFile } from "vfile";
import { runLang, type PlaygroundSpec } from "./playground";
import { termMatcher } from "./glossary";

/** ```mermaid bloklari Shiki'ga tushmaydi: <pre class="mermaid"> qilib qoldiriladi, brauzerda chiziladi. */
function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const code = node.children[0];
      if (code?.type !== "element" || code.tagName !== "code") return;
      const cls = code.properties.className;
      if (!Array.isArray(cls) || !cls.includes("language-mermaid")) return;
      node.properties = { className: ["mermaid"] };
      node.children = code.children;
    });
  };
}

/** ```<til> test, ```text stdin, ```text args, ```text file <nom> kabi biriktiriladigan blok. */
type Attached = { tag: "test" | "stdin" | "args" | "file"; name?: string; text: string };

function attachedBlock(node: Element): Attached | undefined {
  const code = node.tagName === "pre" ? node.children[0] : undefined;
  if (code?.type !== "element" || code.tagName !== "code") return undefined;
  const meta = (code.data as { meta?: string } | undefined)?.meta ?? "";
  const m = meta.match(/(?:^|\s)(test|stdin|args|file)(?:\s+(\S+))?/);
  if (!m) return undefined;
  const raw = code.children.map((c) => (c.type === "text" ? c.value : "")).join("");
  // Fayl matni oxiridagi \n bilan qoladi (oddiy matn fayli kabi), qolganlarida olib tashlanadi.
  const text = m[1] === "file" ? raw : raw.replace(/\n$/, "");
  return { tag: m[1] as Attached["tag"], name: m[1] === "file" ? m[2] : undefined, text };
}

/** Blokni spec'ga qo'shadi; shu turdagi blok allaqachon bo'lsa (file'dan tashqari) - false. */
function attach(spec: PlaygroundSpec, b: Attached): boolean {
  if (b.tag === "file") {
    if (!b.name) return false;
    (spec.files ??= []).push({ name: b.name, text: b.text });
    return true;
  }
  const key = b.tag === "test" ? "tests" : b.tag;
  if (spec[key] !== undefined) return false;
  spec[key] = b.tag === "args" ? b.text.trim() : b.text;
  return true;
}

/** ```python run kabi bloklar: o'rniga belgi qo'yiladi, kodi esa file.data.playgrounds ga yig'iladi. */
function rehypePlayground() {
  return (tree: Root, file: VFile) => {
    const specs: PlaygroundSpec[] = [];
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const code = node.children[0];
      if (code?.type !== "element" || code.tagName !== "code") return;
      const meta = (code.data as { meta?: string } | undefined)?.meta ?? "";
      if (!/(^|\s)run(\s|$)/.test(meta)) return;
      const cls = code.properties.className;
      const fence = Array.isArray(cls) ? String(cls.find((c) => String(c).startsWith("language-")) ?? "").slice(9) : "";
      const lang = runLang(fence);
      if (!lang) return;
      const text = code.children.map((c) => (c.type === "text" ? c.value : "")).join("");
      const spec: PlaygroundSpec = { lang, code: text.replace(/\n$/, "") };
      // Darhol keyingi test (yashirin testlar), stdin (kirish), args (buyruq qatori) va file bloklari
      // playground'ga biriktiriladi va matndan olib tashlanadi.
      for (;;) {
        const next = parent.children.findIndex((c, k) => k > index && c.type === "element");
        const block = next === -1 ? undefined : attachedBlock(parent.children[next] as Element);
        if (!block || !attach(spec, block)) break;
        parent.children.splice(next, 1);
      }
      specs.push(spec);
      parent.children[index] = { type: "element", tagName: "div", properties: { dataPlayground: String(specs.length - 1) }, children: [] };
    });
    file.data.playgrounds = specs;
  };
}

/** Tashqi havolalar yangi oynada. */
function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const href = node.properties.href;
      if (node.tagName === "a" && typeof href === "string" && /^https?:\/\//.test(href)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noreferrer"];
      }
    });
  };
}

/** Atama bog'lanmaydigan joylar: kod, havola, sarlavha. */
const NO_TERMS = new Set(["a", "code", "pre", "h1", "h2", "h3", "h4", "kbd", "button"]);

/**
 * Lug'atdagi har atamaning darsdagi birinchi uchrashi lug'atga havola bo'ladi
 * (atama tushuntirilgan darsning o'zida emas). Faqat file.data.lesson berilganda ishlaydi.
 * Atama faqat o'z kursi darslarida bog'lanadi: "aggregate", "partition" kabi so'zlar
 * boshqa kursda boshqa ma'noda ishlatiladi.
 */
function rehypeGlossary() {
  return (tree: Root, file: VFile) => {
    const lesson = file.data.lesson as { course: string; n: number } | undefined;
    if (!lesson) return;
    const { find } = termMatcher(lesson.course);
    const seen = new Set<string>();
    visitParents(tree, "text", (node: Text, ancestors) => {
      if (ancestors.some((a) => a.type === "element" && (NO_TERMS.has(a.tagName) || a.properties.dataPlayground !== undefined))) return;
      const parent = ancestors[ancestors.length - 1] as Element | Root;
      const parts: ElementContent[] = [];
      let last = 0;
      for (const { start, end, entry } of find(node.value)) {
        if (seen.has(entry.slug)) continue;
        seen.add(entry.slug);
        if (entry.lesson === lesson.n) continue;
        if (start > last) parts.push({ type: "text", value: node.value.slice(last, start) });
        parts.push({
          type: "element",
          tagName: "a",
          properties: { href: `/lugat#${entry.slug}`, className: ["term"], dataTerm: entry.term, dataDef: entry.uz, dataMore: entry.href, dataWhere: entry.where },
          children: [{ type: "text", value: node.value.slice(start, end) }],
        });
        last = end;
      }
      if (parts.length === 0) return;
      if (last < node.value.length) parts.push({ type: "text", value: node.value.slice(last) });
      const i = parent.children.indexOf(node);
      parent.children.splice(i, 1, ...parts);
      return i + parts.length;
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePlayground)
  .use(rehypeMermaid)
  .use(rehypeExternalLinks)
  .use(rehypeGlossary)
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: false,
    defaultLang: "plaintext",
  })
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

/**
 * Dars matni: playground joylari bo'yicha bo'laklarga ajratilgan HTML va playground'lar ro'yxati.
 * Atamalar lug'atga bog'lanadi (dars o'zi tushuntiradigan atamalardan tashqari).
 */
export async function renderLesson(
  markdown: string,
  lesson: { course: string; n: number },
): Promise<{ html: string; segments: string[]; playgrounds: PlaygroundSpec[] }> {
  const file = await processor.process({ value: markdown, data: { lesson } });
  const html = String(file);
  return {
    html,
    segments: html.split(/<div data-playground="\d+"><\/div>/),
    playgrounds: (file.data.playgrounds as PlaygroundSpec[] | undefined) ?? [],
  };
}

export function codeToMarkdown(code: string, lang: string): string {
  return "```" + lang + "\n" + code.trimEnd() + "\n```";
}

export type TocItem = { id: string; text: string };

/** `## ` sarlavhalaridan mundarija; id'lar rehype-slug natijasidan olinadi. */
export function extractToc(html: string): TocItem[] {
  return [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map((m) => ({
    id: m[1],
    text: m[2].replace(/<[^>]+>/g, "").replace(/&#x26;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"'),
  }));
}

/** Dars matnining sof ko'rinishi (teglarsiz): izohdagi belgilangan matn hali bormi, tekshirish uchun. */
export async function markdownToText(markdown: string): Promise<string> {
  const html = await markdownToHtml(markdown);
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;|&#x22;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x26;|&amp;/g, "&");
}
