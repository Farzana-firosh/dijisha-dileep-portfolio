"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CURL_MEDIA } from "./shared";

type P = [number, number];

// Keep the part of a convex polygon where f ≤ 0 (one Sutherland–Hodgman pass)
function cut(poly: P[], f: (p: P) => number) {
  const out: P[] = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const fa = f(a);
    const fb = f(b);
    if (fa <= 0) out.push(a);
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  });
  return out;
}

const polygon = (pts: P[]) => (pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`);

/** The hero as a page that curls over while the visitor scrolls, uncovering About. The bottom-right corner is lifted
 *  and carried up and across to the left; the page is folded along the perpendicular bisector of the corner's start
 *  and current position (as paper folds), the front is clipped to what's left, and the folded-over part shows the
 *  back of the paper with shading for the bend. Layout comes from CSS under html[data-curl]; this only draws. */
export function PageCurl({ children }: { children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const flap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = page.current;
    const fr = front.current;
    const fl = flap.current;
    if (!p || !fr || !fl) return;
    const mq = matchMedia(CURL_MEDIA);
    let raf = 0;
    let cur = Number.NaN;

    const clear = () => {
      fr.style.clipPath = "";
      fl.style.visibility = "hidden";
      p.style.visibility = "";
    };

    const draw = (t: number) => {
      if (t <= 0.002) return clear();
      if (t >= 0.998) {
        p.style.visibility = "hidden";
        return;
      }
      p.style.visibility = "";
      fl.style.visibility = "visible";
      const W = p.clientWidth;
      const H = p.clientHeight;
      // Where the lifted corner is now. Wide: up in an arc, then over to the left, like a book page. Narrow: straight
      // up and over the top with a little sideways swing, like a notepad page
      const c: P =
        W >= 1024
          ? [W - t * 2.15 * W, H - Math.sin(t * Math.PI) * H * 0.42]
          : [W - Math.sin(t * Math.PI) * W * 0.45, H - t * 2.15 * H];
      const m: P = [(W + c[0]) / 2, (H + c[1]) / 2];
      const len = Math.hypot(W - c[0], H - c[1]);
      const n: P = [(W - c[0]) / len, (H - c[1]) / len];
      const side = ([x, y]: P) => (x - m[0]) * n[0] + (y - m[1]) * n[1];
      const rect: P[] = [
        [0, 0],
        [W, 0],
        [W, H],
        [0, H],
      ];
      const stays = cut(rect, side);
      const lifted = cut(rect, (q) => -side(q));
      // The lifted part, reflected across the fold line
      const back = lifted.map(([x, y]): P => {
        const k = 2 * side([x, y]);
        return [x - k * n[0], y - k * n[1]];
      });
      fr.style.clipPath = polygon(stays);
      fl.style.clipPath = polygon(back);

      // Shading across the flap, starting at the fold: crease shadow, then the bright curve of the bend
      const g: P = [-n[0], -n[1]];
      const a = Math.atan2(g[0], -g[1]);
      const span = Math.abs(W * Math.sin(a)) + Math.abs(H * Math.cos(a));
      const s = (m[0] - (W / 2 - (g[0] * span) / 2)) * g[0] + (m[1] - (H / 2 - (g[1] * span) / 2)) * g[1];
      const bend = Math.min(160, 40 + len * 0.12);
      fl.style.backgroundImage = `linear-gradient(${a}rad, rgb(0 0 0 / 0.3) ${s}px, rgb(0 0 0 / 0.08) ${s + 10}px, rgb(255 255 255 / 0.5) ${
        s + bend * 0.45
      }px, rgb(255 255 255 / 0) ${s + bend}px, rgb(0 0 0 / 0) ${s + bend * 2.5}px, rgb(0 0 0 / 0.12) ${s + span}px)`;
    };

    const goal = () => Math.min(1, Math.max(0, scrollY / (innerHeight * 0.85)));
    const tick = () => {
      const g = goal();
      cur = Number.isNaN(cur) ? g : cur + (g - cur) * 0.2;
      if (Math.abs(g - cur) < 0.001) cur = g;
      draw(cur);
      raf = cur === g ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      document.documentElement.setAttribute("data-curl", "");
      cur = Number.NaN;
      tick();
      addEventListener("scroll", kick, { passive: true });
      addEventListener("resize", kick);
    };
    const stop = () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
      raf = 0;
      clear();
    };
    const onChange = () => (mq.matches ? start() : stop());

    if (mq.matches) start();
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return (
    <div ref={page} className="turn-page">
      <div ref={front} className="turn-front">
        {children}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 drop-shadow-[-8px_10px_14px_rgb(0_0_0/0.3)]">
        <div ref={flap} className="turn-flap invisible" />
      </div>
    </div>
  );
}
