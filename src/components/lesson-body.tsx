"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

let seq = 0;

/** Dars HTML'i (serverda tayyorlangan) va undagi mermaid diagrammalar - mavzuga mos chiziladi. */
export function LessonBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const blocks = [...(ref.current?.querySelectorAll<HTMLPreElement>("pre.mermaid") ?? [])];
    if (blocks.length === 0 || !resolvedTheme) return;
    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "neutral",
        fontFamily: "IBM Plex Sans, system-ui, sans-serif",
      });
      for (const pre of blocks) {
        pre.dataset.source ??= pre.textContent ?? "";
        try {
          const { svg } = await mermaid.render(`mmd-${++seq}`, pre.dataset.source);
          if (cancelled) return;
          pre.innerHTML = svg;
          pre.removeAttribute("data-error");
        } catch {
          if (cancelled) return;
          pre.textContent = pre.dataset.source;
          pre.dataset.error = "";
        }
        pre.dataset.done = "";
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [html, resolvedTheme]);

  return <div ref={ref} className="lesson" dangerouslySetInnerHTML={{ __html: html }} />;
}
