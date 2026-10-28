import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { runLang, type PlaygroundSpec } from "./playground";

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
      specs.push({ lang, code: text.replace(/\n$/, "") });
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

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePlayground)
  .use(rehypeMermaid)
  .use(rehypeExternalLinks)
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: false,
    defaultLang: "plaintext",
  })
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

/** Dars matni: playground joylari bo'yicha bo'laklarga ajratilgan HTML va playground'lar ro'yxati. */
export async function renderLesson(markdown: string): Promise<{ html: string; segments: string[]; playgrounds: PlaygroundSpec[] }> {
  const file = await processor.process(markdown);
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
