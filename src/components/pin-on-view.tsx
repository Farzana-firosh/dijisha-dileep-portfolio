"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Plays the board's entrance once it scrolls into view: cards drop in, pins push in, strings draw (CSS on
 *  [data-armed] / [data-in]). Content stays visible without JS or with reduced motion, as nothing is armed then. */
export function PinOnView({ className = "", children }: { className?: string; children: ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = node.getBoundingClientRect();
    // Already on screen (reload mid-page): don't hide what the visitor can see
    if (r.top < innerHeight * 0.7 && r.bottom > 0) return;
    node.setAttribute("data-armed", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.setAttribute("data-in", "");
        io.disconnect();
      },
      // Start once the board is well into view, so the visitor sees it happen
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
