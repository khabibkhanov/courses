import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

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
