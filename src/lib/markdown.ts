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

function testBlockText(node: Element): string | undefined {
  const code = node.tagName === "pre" ? node.children[0] : undefined;
  if (code?.type !== "element" || code.tagName !== "code") return undefined;
  const meta = (code.data as { meta?: string } | undefined)?.meta ?? "";
  if (!/(^|\s)test(\s|$)/.test(meta)) return undefined;
  return code.children.map((c) => (c.type === "text" ? c.value : "")).join("").replace(/\n$/, "");
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
      // Darhol keyingi ```<til> test bloki - yashirin testlar: playground'ga biriktiriladi va matndan olib tashlanadi.
      const next = parent.children.findIndex((c, k) => k > index && c.type === "element");
      const testCode = next === -1 ? undefined : testBlockText(parent.children[next] as Element);
      if (testCode !== undefined) {
        spec.tests = testCode;
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
