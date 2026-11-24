"use client";

import { Moon, Sun } from "lucide-react";
import { useRef, useSyncExternalStore, type PointerEvent } from "react";

export type Theme = "light" | "dark";

const dark = () => matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  const mq = dark();
  mq.addEventListener("change", l);
  return () => {
    listeners.delete(l);
    mq.removeEventListener("change", l);
  };
};
const current = (): Theme => {
  const set = document.documentElement.getAttribute("data-theme");
  return set === "light" || set === "dark" ? set : dark().matches ? "dark" : "light";
};

/** The theme in effect (null while server rendering). */
export const useTheme = () => useSyncExternalStore(subscribe, current, () => null);

/** Switches and stores the theme, cross-fading where the browser can. */
export function applyTheme(next: Theme) {
  const set = () => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked: the choice lasts for this page view
    }
    listeners.forEach((l) => l());
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition) doc.startViewTransition(set);
  else set();
}

const PULL_AT = 36; // px of drag that counts as a pull

/** Light/dark switch as a long pull cord hanging from the header. Tap it, or grab the knob and pull it down; it
 *  springs back and the theme flips. A real button, so keyboard and screen readers get the same switch. The choice
 *  is stored and applied before paint by `themeScript`; until the visitor picks, the OS setting decides. */
export function ThemeCord({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  const btn = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const dragged = useRef(false);

  const stretch = (px: number) => btn.current?.style.setProperty("--pull", `${px}px`);

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = { y: e.clientY, dy: 0 };
    dragged.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dy = Math.max(0, Math.min(90, e.clientY - d.y));
    if (d.dy > 4) {
      dragged.current = true;
      e.currentTarget.setAttribute("data-dragging", "");
      stretch(d.dy);
    }
  };
  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!dragged.current) return;
    e.currentTarget.removeAttribute("data-dragging");
    stretch(0);
    if ((d?.dy ?? 0) >= PULL_AT) applyTheme(next);
  };

  // Tap or keyboard: a short tug, then the switch
  const onClick = () => {
    if (dragged.current) return; // a drag is handled on release
    const b = btn.current;
    if (!b) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return applyTheme(next);
    b.removeAttribute("data-tug");
    void b.offsetWidth; // restart the animation
    b.setAttribute("data-tug", "");
    window.setTimeout(() => applyTheme(next), 220);
  };

  return (
    <button
      ref={btn}
      type="button"
      onClick={onClick}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onAnimationEnd={(e) => e.currentTarget.removeAttribute("data-tug")}
      aria-label={theme ? `Switch to ${next} theme` : "Switch theme"}
      className={`cord ${className}`}
    >
      <span aria-hidden className="cord-line" />
      <span aria-hidden className="cord-knob">
        {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      </span>
    </button>
  );
}
