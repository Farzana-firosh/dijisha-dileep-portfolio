"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** True after hydration when motion is allowed (and `media` matches, if given): scroll scenes render a plain list
 *  until then. */
export function useLive(media?: string) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (media && !matchMedia(media).matches) return;
    const id = requestAnimationFrame(() => setLive(true));
    return () => cancelAnimationFrame(id);
  }, [media]);
  return live;
}

// Each item rests flat for the middle half of its stretch of scroll, so it can be read; the move between two items
// is eased
function dwell(x: number) {
  const i = Math.floor(x);
  const g = Math.min(1, Math.max(0, (x - i - 0.25) / 0.5));
  return i + g * g * (3 - 2 * g);
}

// Scroll progress 0…1 to item position 0…n-1, with half a rest's worth of slack at both ends so the first and last
// items stay as long as the others
const toItem = (p: number, n: number) => Math.min(n - 1, Math.max(0, p * (n - 0.5) - 0.25));

/** Drives a sticky scroll scene: maps the scroll position over `track` to a position 0…n-1 (with rests on each item)
 *  and eases towards it every frame, so wheel steps glide instead of jumping. `render` gets the eased position.
 *  Returns the nearest item and a function that scrolls to item i. */
export function useScrollScene(
  track: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  n: number,
  live: boolean,
  render: (at: number) => void,
) {
  const [active, setActive] = useState(0);
  const draw = useRef(render);
  useEffect(() => {
    draw.current = render;
  });

  useEffect(() => {
    if (!live) return;
    const t = track.current;
    if (!t) return;
    let raf = 0;
    let cur = Number.NaN;
    // Touch scrolling already glides; a slow follow on top of it feels like lag, so follow faster there
    const follow = matchMedia("(pointer: coarse)").matches ? 0.32 : 0.16;

    // The stage sticks below the site header, so progress starts when the track reaches that line
    const top = stage.current ? parseFloat(getComputedStyle(stage.current).top) || 0 : 0;
    const goal = () => {
      const span = t.offsetHeight - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, (top - t.getBoundingClientRect().top) / span)) : 0;
      return dwell(toItem(p, n));
    };

    const tick = () => {
      const g = goal();
      cur = Number.isNaN(cur) ? g : cur + (g - cur) * follow;
      if (Math.abs(g - cur) < 0.002) cur = g;
      draw.current(cur);
      setActive(Math.round(cur));
      raf = cur === g ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      cancelAnimationFrame(raf);
    };
  }, [live, n, track, stage]);

  const goTo = (i: number) => {
    const t = track.current;
    if (!t) return;
    const top = stage.current ? parseFloat(getComputedStyle(stage.current).top) || 0 : 0;
    const span = t.offsetHeight - innerHeight;
    // Middle of item i's rest (inverse of toItem)
    const p = n > 1 ? (i + 0.25) / (n - 0.5) : 0;
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - top + span * p, behavior: "smooth" });
  };

  return { active, goTo };
}
