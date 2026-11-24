"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Red yarn between pins on the skills board, drawn behind the cards. Pins are any [data-pin="id"] inside the board;
 *  each link is a pair of ids. Positions are measured from the page, so the strings follow the layout (pinned cards
 *  sway around their pin, so the ends stay put). Wide screens only. */
export function BoardStrings({ links }: { links: [from: string, to: string, turn: number][] }) {
  const svg = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ d: string; turn: number }[]>([]);

  useEffect(() => {
    const board = svg.current?.parentElement;
    if (!board) return;

    const measure = () => {
      // Layout position (offsets ignore transforms), so the threads point at where each pin lands even while its
      // card is still flying in, and the sway around the pin doesn't matter
      const at = (id: string) => {
        const el = board.querySelector<HTMLElement>(`[data-pin="${id}"]`);
        if (!el) return null;
        let x = el.offsetWidth / 2;
        let y = el.offsetHeight / 2;
        let n: HTMLElement | null = el;
        while (n && n !== board) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return n === board ? ([x, y] as const) : null;
      };
      const next: { d: string; turn: number }[] = [];
      for (const [a, b, turn] of links) {
        const p = at(a);
        const q = at(b);
        if (!p || !q) continue;
        // Yarn sags under its own weight: the control point hangs below the lower end
        const sag = Math.min(90, Math.hypot(q[0] - p[0], q[1] - p[1]) * 0.18);
        const cx = (p[0] + q[0]) / 2;
        const cy = Math.max(p[1], q[1]) + sag;
        next.push({ d: `M${p[0]},${p[1]} Q${cx},${cy} ${q[0]},${q[1]}`, turn });
      }
      setPaths(next);
    };

    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    // Cards move during the entrance; measure again once they have landed
    let later = 0;
    const settle = (e: AnimationEvent) => {
      if (e.animationName !== "pin-in") return;
      window.clearTimeout(later);
      later = window.setTimeout(measure, 50);
    };
    board.addEventListener("animationend", settle);
    return () => {
      ro.disconnect();
      window.clearTimeout(later);
      board.removeEventListener("animationend", settle);
    };
  }, [links]);

  return (
    <svg ref={svg} aria-hidden className="board-yarn pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block">
      {/* Keyed by turn, not path: re-measuring mid-entrance must not restart a thread's draw */}
      {paths.map((p) => (
        <path key={p.turn} d={p.d} pathLength={1} strokeDasharray="1" className="yarn" style={{ "--i": p.turn } as CSSProperties} />
      ))}
    </svg>
  );
}
