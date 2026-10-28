"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";

type Open = { el: HTMLAnchorElement; term: string; def: string; more: string; where: string; href: string };

const GAP = 8;
const WIDTH = 320;

/**
 * Dars matnidagi `a.term` havolalari uchun izoh oynasi.
 * Sichqoncha: ustiga kelganda ochiladi. Klaviatura: fokusda. Sensorli ekran: birinchi bosish ochadi,
 * ikkinchisi lug'atga o'tadi.
 */
export function TermTooltip({ root }: { root: RefObject<HTMLElement | null> }) {
  const [open, setOpen] = useState<Open | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const termOf = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLAnchorElement>("a.term") : null);
    const show = (el: HTMLAnchorElement) => {
      window.clearTimeout(hideTimer.current);
      const d = el.dataset;
      setOpen({ el, term: d.term ?? "", def: d.def ?? "", more: d.more ?? "", where: d.where ?? "", href: el.getAttribute("href") ?? "" });
    };
    const hideSoon = () => {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setOpen(null), 150);
    };
    const onOver = (e: PointerEvent) => {
      const el = termOf(e.target);
      if (el && e.pointerType === "mouse") show(el);
    };
    const onOut = (e: PointerEvent) => {
      if (termOf(e.target) && e.pointerType === "mouse") hideSoon();
    };
    const onFocus = (e: FocusEvent) => {
      const el = termOf(e.target);
      if (el) show(el);
    };
    // Bosishdan oldingi holat: focusin pointerdown'da oynani ochib qo'yadi, click esa undan keyin keladi.
    let openBeforePress: boolean | null = null;
    const isOpenFor = (el: HTMLAnchorElement) => box.current?.dataset.for === el.dataset.term;
    const onDown = (e: PointerEvent) => {
      const el = termOf(e.target);
      openBeforePress = el ? isOpenFor(el) : null;
    };
    const onClick = (e: MouseEvent) => {
      const el = termOf(e.target);
      if (!el) return;
      // Oyna shu atama uchun hali ochilmagan bo'lsa (sensorli ekran) - avval izoh ko'rsatiladi.
      // Klaviaturada (Enter) pointerdown yo'q: fokus oynani ochgan, havola ishlaydi.
      const wasOpen = openBeforePress ?? isOpenFor(el);
      openBeforePress = null;
      if (!wasOpen) {
        e.preventDefault();
        show(el);
      }
    };
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointerover", onOver);
    container.addEventListener("pointerout", onOut);
    container.addEventListener("focusin", onFocus);
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointerover", onOver);
      container.removeEventListener("pointerout", onOut);
      container.removeEventListener("focusin", onFocus);
      container.removeEventListener("click", onClick);
    };
  }, [root]);

  // Joylashuv: atama ostida, joy bo'lmasa ustida; ekran chetidan chiqmaydi.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = open.el.getBoundingClientRect();
      const width = Math.min(WIDTH, window.innerWidth - 2 * GAP);
      const left = Math.max(GAP, Math.min(r.left, window.innerWidth - width - GAP));
      const h = box.current?.offsetHeight ?? 120;
      const above = r.bottom + GAP + h > window.innerHeight && r.top - GAP - h > 0;
      setPos({ left, top: above ? r.top - GAP - h : r.bottom + GAP });
    };
    place();
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e.type === "pointerdown" && (box.current?.contains(e.target as Node) || open.el.contains(e.target as Node))) return;
      setOpen(null);
    };
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", close);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.removeEventListener("keydown", close);
      window.removeEventListener("pointerdown", close);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      ref={box}
      role="tooltip"
      data-for={open.term}
      onPointerEnter={() => window.clearTimeout(hideTimer.current)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
      style={{ left: pos?.left ?? -9999, top: pos?.top ?? -9999, width: Math.min(WIDTH, typeof window === "undefined" ? WIDTH : window.innerWidth - 2 * GAP) }}
      className="fixed z-30 rounded-lg border border-rule bg-sheet p-3 text-sm leading-relaxed shadow-lg"
    >
      <p className="m-0 font-semibold">{open.term}</p>
      <p className="mt-1 mb-2 text-ink">{open.def}</p>
      <p className="m-0 text-xs text-muted">
        <Link href={open.more} className="underline underline-offset-2 hover:text-ink">
          Batafsil: {open.where}
        </Link>
        {" · "}
        <Link href={open.href} className="underline underline-offset-2 hover:text-ink">
          Lug&apos;at
        </Link>
      </p>
    </div>
  );
}
