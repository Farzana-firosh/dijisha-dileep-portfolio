"use client";

import { useEffect, useRef, type ReactNode } from "react";

const ZOOM = 1.9;

/** A magnifying glass over its children. It follows a mouse across the area and can be dragged (mouse, pen or
 *  touch). The enlarged view is a copy of the area made in the browser, so the text is in the HTML only once.
 *  Decorative: everything under it is readable without it, apart from the `.micro` print, which repeats facts
 *  shown elsewhere on the site. */
export function Magnifier({
  children,
  startX = 0.72,
  startY = 0.42,
  large = false,
}: {
  children: ReactNode;
  startX?: number;
  startY?: number;
  large?: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = stage.current;
    const l = lens.current;
    const v = view.current;
    if (!s || !l || !v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Copy of the area, refreshed when its size changes
    const copy = () => {
      const c = s.cloneNode(true) as HTMLElement;
      c.removeAttribute("id");
      c.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      v.replaceChildren(c);
      v.style.width = `${s.offsetWidth}px`;
      v.style.height = `${s.offsetHeight}px`;
    };

    // On phones, start in the bottom corner (over the tiny print) so the lens doesn't sit on the text being read
    const narrow = innerWidth < 640;
    let x = s.offsetWidth * (narrow ? 0.82 : startX);
    let y = s.offsetHeight * (narrow ? 0.9 : startY);
    let dragging = false;
    let grab = [0, 0];
    let tx = x;
    let ty = y;
    let raf = 0;

    const place = () => {
      const r = l.offsetWidth / 2;
      l.style.translate = `${x - r}px ${y - r}px`;
      v.style.transform = `translate(${r - x * ZOOM}px, ${r - y * ZOOM}px) scale(${ZOOM})`;
    };

    const tick = () => {
      const k = reduce ? 1 : 0.2;
      x += (tx - x) * k;
      y += (ty - y) * k;
      place();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const go = (nx: number, ny: number) => {
      tx = Math.max(0, Math.min(s.offsetWidth, nx));
      ty = Math.max(0, Math.min(s.offsetHeight, ny));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const local = (e: PointerEvent) => {
      const b = s.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top] as const;
    };

    // Mouse: the glass follows the pointer over the area
    const hover = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !dragging) go(...local(e));
    };

    // Any pointer: drag the glass itself
    const down = (e: PointerEvent) => {
      dragging = true;
      l.setPointerCapture(e.pointerId);
      const [px, py] = local(e);
      grab = [px - x, py - y];
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const [px, py] = local(e);
      go(px - grab[0], py - grab[1]);
    };
    const up = () => {
      dragging = false;
    };

    const resize = () => {
      const w = s.offsetWidth;
      const h = s.offsetHeight;
      copy();
      x = tx = Math.min(x, w);
      y = ty = Math.min(y, h);
      place();
    };

    resize();
    document.fonts?.ready.then(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(s);
    // Something in the area changed (a planted defect fixed): refresh the copy once its transition ends
    let later = 0;
    const changed = () => {
      window.clearTimeout(later);
      later = window.setTimeout(copy, 700);
    };
    s.addEventListener("click", changed);
    s.parentElement?.addEventListener("pointermove", hover);
    l.addEventListener("pointerdown", down);
    l.addEventListener("pointermove", move);
    l.addEventListener("pointerup", up);
    l.addEventListener("pointercancel", up);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(later);
      s.removeEventListener("click", changed);
      s.parentElement?.removeEventListener("pointermove", hover);
      l.removeEventListener("pointerdown", down);
      l.removeEventListener("pointermove", move);
      l.removeEventListener("pointerup", up);
      l.removeEventListener("pointercancel", up);
    };
  }, [startX, startY]);

  return (
    <div className="relative">
      <div ref={stage}>{children}</div>
      <div ref={lens} aria-hidden className={`mag ${large ? "mag-lg" : ""}`} style={{ translate: "-999px -999px" }}>
        <div className="mag-handle-wrap">
          <div className="mag-handle" />
        </div>
        <div className="mag-glass">
          <div ref={view} className="mag-clone" inert />
        </div>
        <div className="mag-ring" />
      </div>
    </div>
  );
}
