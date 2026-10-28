"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { CONTEXT_LEN, FEEDBACK_COMMENT_MAX, FEEDBACK_KINDS, QUOTE_MAX, normalize, type FeedbackKind } from "@/lib/feedback";
import { deviceId, postJson } from "@/lib/device";

type Picked = { quote: string; prefix: string; suffix: string; section: string; x: number; y: number };
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

type Props = { course: string; n: number; lessonHash: string; children: React.ReactNode };

/**
 * Dars matnidan bir qismini belgilab izoh qoldirish.
 * Joy matnning o'zi bilan saqlanadi: belgilangan matn, oldidan va keyinidan ~32 belgi, bo'lim sarlavhasi.
 */
export function TextFeedback({ course, n, lessonHash, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const readSelection = useCallback((): Picked | null => {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
    const range = sel.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return null;
    const raw = range.toString();
    const quote = normalize(raw);
    if (quote.length < 2) return null;

    const before = document.createRange();
    before.selectNodeContents(root);
    before.setEnd(range.startContainer, range.startOffset);
    const offset = before.toString().length;
    const full = root.textContent ?? "";

    const heading = [...root.querySelectorAll("h2")]
      .filter((h) => h.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING)
      .at(-1);

    const rect = range.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    return {
      quote: quote.slice(0, QUOTE_MAX),
      prefix: full.slice(Math.max(0, offset - CONTEXT_LEN), offset),
      suffix: full.slice(offset + raw.length, offset + raw.length + CONTEXT_LEN),
      section: heading?.textContent?.trim() ?? "",
      x: Math.min(Math.max(rect.left - box.left + rect.width / 2, 0), box.width),
      y: rect.bottom - box.top + 8,
    };
  }, []);

  useEffect(() => {
    if (open) return;
    let timer: ReturnType<typeof setTimeout>;
    const onChange = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setPicked(readSelection()), 200);
    };
    document.addEventListener("selectionchange", onChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("selectionchange", onChange);
    };
  }, [open, readSelection]);

  const close = useCallback(() => {
    setOpen(false);
    setPicked(null);
    setKind(null);
    setComment("");
    setStatus({ kind: "idle" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function submit() {
    if (!picked || !kind) return;
    setStatus({ kind: "sending" });
    const res = await postJson("/api/feedback", {
      course,
      lesson: n,
      deviceId: deviceId(),
      kind,
      quote: picked.quote,
      prefix: picked.prefix,
      suffix: picked.suffix,
      section: picked.section || undefined,
      comment: comment.trim() || undefined,
      lessonHash,
    });
    if (!res.ok) {
      setStatus({ kind: "error", message: res.error });
      return;
    }
    setStatus({ kind: "sent" });
    window.getSelection()?.removeAllRanges();
    setTimeout(close, 1600);
  }

  const pos = picked ? ({ "--x": `${picked.x}px`, "--y": `${picked.y}px` } as React.CSSProperties) : undefined;

  return (
    <div ref={ref} className="relative">
      {children}

      {picked && !open && (
        <button
          type="button"
          style={pos}
          // Bosilganda belgilash yo'qolmasligi uchun.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen(true)}
          className="absolute top-[var(--y)] left-[var(--x)] z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-sm font-medium text-paper shadow-lg"
        >
          <MessageSquarePlus size={15} aria-hidden />
          Izoh qoldirish
        </button>
      )}

      {picked && open && (
        <div
          role="dialog"
          aria-label="Matnga izoh"
          style={pos}
          className="fixed inset-x-0 bottom-0 z-30 rounded-t-xl border border-rule bg-sheet p-4 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-[var(--y)] sm:left-[clamp(0px,calc(var(--x)-11rem),calc(100%-22rem))] sm:w-[22rem] sm:rounded-xl"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="line-clamp-3 text-sm text-muted">
              &laquo;{picked.quote}&raquo;
            </p>
            <button type="button" onClick={close} aria-label="Yopish" className="shrink-0 text-muted hover:text-ink">
              <X size={18} aria-hidden />
            </button>
          </div>

          {status.kind === "sent" ? (
            <p className="py-4 text-sm font-medium text-done">Rahmat, izohingiz yuborildi.</p>
          ) : (
            <>
              <div role="radiogroup" aria-label="Izoh turi" className="grid grid-cols-2 gap-2">
                {(Object.keys(FEEDBACK_KINDS) as FeedbackKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    title={FEEDBACK_KINDS[k].hint}
                    onClick={() => setKind(k)}
                    className={`rounded-md border px-3 py-2 text-left text-sm ${
                      kind === k ? "border-line bg-line text-white" : "border-rule hover:border-muted"
                    }`}
                  >
                    <span className="block font-medium">{FEEDBACK_KINDS[k].label}</span>
                    <span className={`block text-xs ${kind === k ? "text-white/80" : "text-muted"}`}>{FEEDBACK_KINDS[k].hint}</span>
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={FEEDBACK_COMMENT_MAX}
                rows={3}
                aria-label="Izoh matni"
                placeholder="Nima noto'g'ri yoki qanday bo'lishi kerak (ixtiyoriy)"
                className="mt-3 w-full rounded-md border border-rule bg-paper p-2.5 text-sm leading-relaxed focus:border-line focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p role="status" className={`text-xs ${status.kind === "error" ? "text-warn" : "text-muted"}`}>
                  {status.kind === "error" ? status.message : kind ? "" : "Izoh turini tanlang"}
                </p>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!kind || status.kind === "sending"}
                  className="rounded-md bg-line px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status.kind === "sending" ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
