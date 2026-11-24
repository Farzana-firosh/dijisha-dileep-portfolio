"use client";

import { useRef, type ReactNode } from "react";
import { useLive, useScrollScene } from "./scroll-scene";

export type CareerEntry = {
  id: string;
  year: string;
  /** Short name for the year rail. */
  short: string;
  kind: "Education" | "Work";
  title: string;
  org: string;
  place?: string;
  period: string;
  points: string[];
  grade?: string;
  current?: boolean;
};

/** Experience as a folder of files. While the section scrolls past, the files rise out of the folder one at a time
 *  (latest first), rest so they can be read, and drop back as the next comes up; a file that would not fit under the
 *  heading (phones) is scaled to fit. Wide screens add the divider tabs and the `aside` (Dijisha at her desk), with an
 *  arrival sequence: she is alone in the middle first, moves to the left, then the tabs and folder come in. With
 *  reduced motion (and in the HTML) it is a plain list of the same files. */
export function CareerStack({ entries, label, header, aside }: { entries: CareerEntry[]; label: ReactNode; header: ReactNode; aside?: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const head = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLElement>(null);
  const folder = useRef<HTMLDivElement>(null);
  const deskShift = useRef(0);
  const stickTop = useRef<number | null>(null);
  const live = useLive();
  const n = entries.length;

  // Arrival, tied to scroll as the stage comes up to the top: she starts alone in the middle of the row and moves to
  // her place on the left, then the tabs and the folder rise in. Reverses when scrolling back.
  const arrive = () => {
    const st = stage.current;
    const r = row.current;
    if (!st || !r) return;
    stickTop.current ??= parseFloat(getComputedStyle(st).top) || 0;
    const top = st.getBoundingClientRect().top - stickTop.current;
    const p = Math.min(1, Math.max(0, 1 - top / (innerHeight * 0.75)));
    const ease = (v: number) => 1 - (1 - v) ** 3;
    const d = desk.current;
    if (d && d.offsetWidth) {
      const rr = r.getBoundingClientRect();
      const dr = d.getBoundingClientRect();
      const toCenter = rr.left + rr.width / 2 - (dr.left - deskShift.current + dr.width / 2);
      const a = ease(Math.min(1, Math.max(0, (p - 0.1) / 0.5)));
      deskShift.current = (1 - a) * toCenter;
      d.style.translate = `${deskShift.current}px 0`;
      d.style.scale = String(1 + (1 - a) * 0.1);
    }
    const b = ease(Math.min(1, Math.max(0, (p - 0.5) / 0.45)));
    for (const el of [tabs.current, folder.current]) {
      if (!el) continue;
      el.style.opacity = String(b);
      el.style.translate = `0 ${(1 - b) * 60}px`;
    }
  };

  const { active, goTo } = useScrollScene(track, stage, n, live, (at) => {
    arrive();
    const f = front.current;
    if (!f) return;
    const frontTop = f.offsetTop;
    // Space between the heading and the folder front for a file that is out
    const room = f.getBoundingClientRect().top - (head.current?.getBoundingClientRect().bottom ?? 0) - 12;
    cards.current.forEach((card, i) => {
      if (!card) return;
      // 1 when this file is fully out, 0 when it rests in the folder
      const lift = Math.max(0, Math.min(1, 1 - Math.abs(at - i) * 1.25));
      const e = lift * lift * (3 - 2 * lift);
      const out = card.offsetTop + card.offsetHeight - frontTop + 16;
      const tilt = (1 - e) * (i % 2 ? 0.8 : -0.8);
      const fit = Math.min(1.02, room / (card.offsetHeight + 16));
      card.style.transform = `translateY(${-e * out}px) rotate(${tilt}deg) scale(${1 + e * (fit - 1)})`;
      card.style.zIndex = String(e > 0.01 ? 20 + Math.round(e * 10) : 1 + i);
    });
  });

  return (
    <div ref={track} style={live ? { height: `calc(${n} * 70vh + 100svh)` } : undefined}>
      <div ref={stage} className={live ? "sticky top-16 flex h-[calc(100svh-4rem)] flex-col pt-5 sm:pt-8" : ""}>
        {/* Heading across the full width, then the folder with its divider tabs */}
        <div ref={head} className={live ? "" : "mb-12"}>
          {header}
        </div>
        <div ref={row} className={live ? "flex flex-1 items-end justify-center pb-[3svh]" : ""}>
          {/* Left of the tabs: Dijisha at her desk (wide screens), standing on a soft shadow */}
          {aside && (
            <div ref={desk} className="relative mr-12 hidden w-80 shrink-0 self-end xl:block 2xl:w-[22rem]">
              <span aria-hidden className="absolute -bottom-3 left-1/2 h-10 w-[95%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.32),transparent)]" />
              {aside}
            </div>
          )}
          {live && (
            /* Divider tabs sticking out of the folder's side: one per file, the open one pulled out; click to jump */
            <nav ref={tabs} aria-label="Career stages" className="gfolder-h relative z-0 -mr-3 hidden w-60 shrink-0 flex-col justify-center gap-1.5 lg:flex">
              {entries.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`ftab ${i === active ? "ftab-on" : ""}`}
                >
                  <span className="font-display text-xl">{e.year}</span>
                  <span className="truncate text-sm">{e.short}</span>
                </button>
              ))}
            </nav>
          )}
            <div ref={folder} className={live ? "gfolder relative z-10 w-full max-w-[36rem] 2xl:max-w-[40rem]" : "mx-auto w-full max-w-3xl"}>
              {live && <div aria-hidden className="gfolder-back" />}
              <div className={live ? "gfolder-label" : "mb-6"}>{label}</div>

              <div className={live ? "" : "space-y-6"}>
                {entries.map((e, i) => (
                  <article
                    key={e.id}
                    ref={(el) => {
                      cards.current[i] = el;
                    }}
                    aria-labelledby={`career-${e.id}`}
                    className={`sheet-paper relative px-5 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5 ${live ? "gfolder-card" : ""}`}
                  >
                    {live && (
                      <span
                        aria-hidden
                        className={`gfolder-tab annot ${i === active ? "bg-mark" : "bg-sheet"}`}
                        style={{ left: `${4 + i * (88 / n)}%` }}
                      >
                        {e.year}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-3 border-b border-sheet-ink/10 pb-3">
                      <p className="annot text-sheet-soft">
                        <span className="font-semibold text-sheet-ink">{e.year}</span> · {e.kind}
                      </p>
                      {e.current ? <p className="stamp annot">Current</p> : <p className="annot text-sm text-sheet-soft">{e.period}</p>}
                    </div>
                    <h3 id={`career-${e.id}`} className="font-display mt-3 text-[clamp(1.6rem,4vw,2.6rem)] sm:mt-4">
                      {e.title}
                    </h3>
                    <p className="mt-1">
                      <span className="font-semibold">{e.org}</span>
                      {e.place && <span className="text-sheet-soft"> · {e.place}</span>}
                      {e.grade && <span className="text-sheet-soft"> · {e.grade}</span>}
                    </p>
                    {e.current && <p className="annot mt-1 text-sm text-sheet-soft">{e.period}</p>}
                    {e.points.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {e.points.map((pt) => (
                          <li key={pt} className="grid grid-cols-[1.25rem_1fr] gap-1.5 text-[0.9rem] leading-snug sm:text-base">
                            <span aria-hidden className="annot text-pass">
                              ✓
                            </span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>

              {live && (
                <div ref={front} aria-hidden className="gfolder-front">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-none text-chalk">Career file</p>
                      <p className="mt-1 text-chalk/80">
                        {active + 1} of {n} · {entries[active]?.short}
                      </p>
                    </div>
                    <span className="grid size-12 place-items-center max-lg:hidden rounded-full border border-chalk/50 text-chalk">↓</span>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
