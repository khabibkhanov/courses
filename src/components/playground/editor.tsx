"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { HighlightStyle, bracketMatching, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { javascript } from "@codemirror/lang-javascript";
import type { RunLang } from "./runners";

// Ranglar CSS o'zgaruvchilaridan: yorug' va qorong'i mavzuga o'zi moslashadi (globals.css, --cm-*).
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: "var(--cm-keyword)" },
  { tag: [t.string, t.special(t.string)], color: "var(--cm-string)" },
  { tag: [t.number, t.bool, t.null], color: "var(--cm-number)" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "var(--cm-comment)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--cm-function)" },
  { tag: [t.typeName, t.className], color: "var(--cm-type)" },
]);

const theme = EditorView.theme({
  "&": { fontSize: "0.84rem", backgroundColor: "var(--sheet)", color: "var(--ink)" },
  ".cm-content": { fontFamily: "var(--plex-mono)", padding: "0.75rem 0", caretColor: "var(--ink)" },
  ".cm-gutters": { backgroundColor: "var(--sheet)", color: "var(--muted)", border: "none" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "color-mix(in srgb, var(--soft) 70%, transparent)" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in srgb, var(--line) 25%, transparent) !important" },
  ".cm-scroller": { lineHeight: "1.6" },
});

const language = { python: () => python(), sql: () => sql(), js: () => javascript(), ts: () => javascript({ typescript: true }) };

type Props = { lang: RunLang; value: string; onChange: (v: string) => void; onRun: () => void };

export function CodeEditor({ lang, value, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  // Tashqi callback'lar yangilansa ham editor qayta yaratilmaydi.
  const handlers = useRef({ onChange, onRun });
  useEffect(() => {
    handlers.current = { onChange, onRun };
  }, [onChange, onRun]);

  useEffect(() => {
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          EditorView.lineWrapping,
          indentOnInput(),
          bracketMatching(),
          EditorState.tabSize.of(4),
          keymap.of([
            { key: "Mod-Enter", run: () => (handlers.current.onRun(), true) },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          language[lang](),
          syntaxHighlighting(highlight),
          theme,
          EditorView.updateListener.of((u) => u.docChanged && handlers.current.onChange(u.state.doc.toString())),
          EditorView.contentAttributes.of({ "aria-label": "Kod muharriri" }),
        ],
      }),
    });
    view.current = v;
    return () => v.destroy();
    // Editor bir marta yaratiladi; qiymatni tashqaridan almashtirish quyidagi effektda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div ref={host} />;
}
