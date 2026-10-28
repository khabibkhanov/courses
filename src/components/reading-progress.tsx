"use client";

import { useEffect, useState } from "react";

/** Header ostidagi ingichka chiziq: dars qancha o'qilgani. */
export function ReadingProgress() {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRatio(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-14 z-20 h-0.5">
      <div className="h-full origin-left bg-line" style={{ transform: `scaleX(${ratio})` }} />
    </div>
  );
}
