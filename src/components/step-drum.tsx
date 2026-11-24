"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { useLive, useScrollScene } from "./scroll-scene";

export type Step = { id: string; title: string; body: string; output: string; image?: string };

const tone = ["bg-note", "bg-mark", "bg-note-blue text-on-board", "bg-kraft", "bg-note-pink", "bg-sheet"];

/** Line drawings, one per step (used until an illustration is supplied in `steps[].image`). */
const art: Record<string, ReactNode> = {
  analyse: (
    <>
      <rect x="12" y="8" width="30" height="40" rx="3" />
      <path d="M18 18h18M18 25h18M18 32h10" />
      <circle cx="42" cy="40" r="9" />
      <path d="m48.5 46.5 7 7" />
    </>
  ),
  plan: (
    <>
      <rect x="12" y="8" width="40" height="48" rx="3" />
      <path d="m18 20 3 3 6-6M31 20h15M18 32l3 3 6-6M31 32h15M18 44l3 3 6-6M31 44h15" />
    </>
  ),
  design: (
    <>
      <rect x="8" y="12" width="48" height="40" rx="3" />
      <path d="M8 24h48M8 36h48M24 12v40M40 12v40" />
      <path d="m28 30 3 3 5-6M44 42l3 3 5-6" />
    </>
  ),
  execute: (
    <>
      <circle cx="32" cy="32" r="22" />
      <path d="M27 21v22l17-11z" />
    </>
  ),
  report: (
    <>
      <rect x="22" y="22" width="20" height="28" rx="10" />
      <path d="M32 22v28M26 14l3 8M38 14l-3 8M12 32h10M42 32h10M14 46l8-4M50 46l-8-4M14 20l8 5M50 20l-8 5" />
    </>
  ),
  close: (
    <>
      <rect x="12" y="8" width="34" height="44" rx="3" />
      <path d="M18 18h22M18 26h22M18 34h12" />
      <circle cx="44" cy="46" r="11" />
      <path d="m39 46 4 4 7-8" />
    </>
  ),
};

/** "How I test": the six STLC steps as a vertical stack of cards. While the section scrolls past, the stack rolls
 *  through them and rests on each one: the centre card faces you, the ones above and below tilt away. Without JS or
 *  with reduced motion it's a plain grid of the same cards (which is what's in the HTML). */
export function StepDrum({ steps, header }: { steps: Step[]; header: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const live = useLive();
  const n = steps.length;

  const { active, goTo } = useScrollScene(track, stage, n, live, (at) => {
    cards.current.forEach((card, i) => {
      if (!card) return;
      const d = i - at;
      const a = Math.abs(d);
      card.style.transform = `translate(-50%, -50%) perspective(1200px) translateY(${d * 64}%) rotateX(${-d * 28}deg) scale(${1 - Math.min(a, 2.5) * 0.13})`;
      // Neighbours stay visible but quiet, so only the centre card asks to be read
      card.style.opacity = String(Math.max(0, 1 - Math.max(0, a - 0.35) * 0.75));
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.style.filter = a > 0.05 ? `brightness(${1 - Math.min(a, 2) * 0.25})` : "none";
    });
  });

  const current = steps[active] ?? steps[0];

  return (
    <div ref={track} style={live ? { height: `calc(${n} * 75vh + 100svh)` } : undefined}>
      <div ref={stage} className={live ? "sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center overflow-x-clip" : "pt-20"}>
        <div className="wrap">
          <div className="relative z-[200]">{header}</div>

          <div className={live ? "mt-6 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,30rem)_1fr]" : "mt-12"}>
            {/* Left: the step in big type; re-keyed so it slides in on every change */}
            {live && (
              <div aria-hidden className="hidden lg:block">
                <div key={active} className="step-in">
                  <p className="font-display text-[10rem] leading-[0.8] text-mark">{String(active + 1).padStart(2, "0")}</p>
                  <p className="font-display mt-6 max-w-xs text-5xl uppercase leading-[0.92] text-chalk">{current.title}</p>
                </div>
                <div className="mt-6 flex gap-1.5">
                  {steps.map((s, i) => (
                    <span key={s.id} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-mark" : "w-4 bg-chalk/25"}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Centre: the stack */}
            <ol className={live ? "drum relative h-[29rem] sm:h-[33rem]" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
              {steps.map((s, i) => (
                <li
                  key={s.id}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={`overflow-hidden rounded-[1.4rem] bg-sheet text-sheet-ink shadow-2xl ${live ? "drum-card" : ""}`}
                >
                  <div className={`card-art relative h-40 sm:h-48 ${tone[i % tone.length]}`}>
                    {s.image ? (
                      <Image src={s.image} alt="" fill sizes="(min-width: 640px) 30rem, 90vw" className="object-cover" />
                    ) : (
                      <svg
                        viewBox="0 0 64 64"
                        className="absolute bottom-4 right-6 size-28 sm:size-32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {art[s.id]}
                      </svg>
                    )}
                    <span aria-hidden className="font-display absolute left-5 top-4 text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="px-6 pb-6 pt-5">
                    <h3 className="font-display text-[2rem] leading-none">
                      <span className="sr-only">Step {i + 1}: </span>
                      {s.title}
                    </h3>
                    <p className="mt-2.5 leading-snug text-sheet-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Right: what the step produces (a little stack of paper), and the steps to jump between */}
            {live && (
              <div className="hidden lg:block">
                <div className="ml-auto max-w-[17rem]">
                  <p className="annot text-lg text-chalk/60">What comes out of it</p>
                  <div key={active} className="step-in relative mt-4">
                    <span aria-hidden className="absolute inset-0 translate-x-4 translate-y-3 rotate-[5deg] rounded-md bg-chalk/15" />
                    <span aria-hidden className="absolute inset-0 translate-x-2 translate-y-1.5 rotate-[2deg] rounded-md bg-chalk/35" />
                    <div className="sheet-paper relative -rotate-1 rounded-md px-5 pb-6 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="annot text-sm text-sheet-soft">Step {String(active + 1).padStart(2, "0")} output</p>
                        <span aria-hidden className="grid size-6 place-items-center rounded-full bg-mark text-xs font-bold text-on-mark">
                          ✓
                        </span>
                      </div>
                      <p className="font-display mt-3 text-[2.6rem] leading-[0.9]">{current.output}</p>
                      <span aria-hidden className="mt-5 block space-y-2">
                        {["w-full", "w-5/6", "w-11/12", "w-3/5"].map((w) => (
                          <span key={w} className={`block h-1.5 rounded-full bg-sheet-ink/10 ${w}`} />
                        ))}
                      </span>
                    </div>
                  </div>

                  <nav aria-label="STLC steps" className="mt-12">
                    <ol className="flex flex-wrap gap-2">
                      {steps.map((s, i) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={i === active ? "step" : undefined}
                            title={s.title}
                            className={`grid size-11 place-items-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                              i === active ? "border-mark bg-mark text-on-mark" : "border-chalk/25 text-chalk/60 hover:border-chalk hover:text-chalk"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                            <span className="sr-only">: {s.title}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
