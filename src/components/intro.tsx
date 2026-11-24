"use client";

import { useEffect, useRef, useState } from "react";

/** First-visit intro, home page only: a bug is eating the glass folder; catching it opens the folder, the files fly
 *  out and the page appears. Shown only when the head script set `data-intro` (once per session, not with reduced
 *  motion, data saver or for crawlers). The page is fully rendered underneath; the intro never holds it back:
 *  it moves on by itself if nobody taps, can be skipped, and the head script removes it after 14s whatever happens. */

type Phase = "crawl" | "caught" | "open" | "exit" | "done";

// How long each phase lasts before the next one starts
const next: Partial<Record<Phase, [number, Phase]>> = {
  crawl: [5600, "caught"],
  caught: [1000, "open"],
  open: [1700, "exit"],
  exit: [650, "done"],
};

// Bites line up with the bug's first pass (crawl animation: 3% → 80% in 48% of 9.2s)
const bites = [20, 36, 52, 68].map((x) => ({ x, delay: ((x - 3) / 77) * 9.2 * 0.48 + 0.25 }));

const files = [
  { label: "About", tone: "is-light", x: "6%", rot: "-6deg", ox: "-46%", orot: "-14deg", d: "0s" },
  { label: "Skills", tone: "is-dark", x: "40%", rot: "5deg", ox: "44%", orot: "12deg", d: "0.08s" },
  { label: "Experience", tone: "is-lime", x: "24%", rot: "-1deg", ox: "0%", orot: "-2deg", d: "0.16s" },
];

export function Intro({ name, tags }: { name: string; tags: string[] }) {
  const [phase, setPhase] = useState<Phase>("crawl");
  const active = useRef(false);
  const bug = useRef<HTMLButtonElement>(null);

  // Start only if the head script asked for the intro
  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-intro")) return;
    active.current = true;
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    bug.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("exit");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active.current) return;
    if (phase === "done") {
      document.documentElement.removeAttribute("data-intro");
      return;
    }
    const step = next[phase];
    if (!step) return;
    const t = window.setTimeout(() => setPhase(step[1]), step[0]);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  const [first, ...rest] = name.split(" ");
  const caught = phase !== "crawl";

  return (
    <div className="intro-root" data-phase={phase} role="dialog" aria-modal="true" aria-label="Intro">
      <button
        type="button"
        onClick={() => setPhase("exit")}
        className="annot absolute right-4 top-4 inline-flex min-h-11 items-center rounded-full border border-chalk/25 px-4 text-chalk/80 transition-colors hover:border-chalk hover:text-chalk"
      >
        Skip intro
      </button>

      <div className="flex flex-col items-center">
        <div className="folder">
          <div className="folder-back" />

          {files.map((f) => (
            <div
              key={f.label}
              aria-hidden
              className={`folder-file ${f.tone}`}
              style={{ "--x": f.x, "--rot": f.rot, "--ox": f.ox, "--orot": f.orot, "--d": f.d } as React.CSSProperties}
            >
              <span className="annot">{f.label}</span>
            </div>
          ))}

          <div className="folder-front">
            {bites.map((b) => (
              <span key={b.x} aria-hidden className="bite" style={{ "--x": `${b.x}%`, "--d": `${b.delay}s` } as React.CSSProperties} />
            ))}
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-[clamp(2.4rem,9vw,3.9rem)] leading-[0.95]">
                {first}
                <br />
                {rest.join(" ")}
              </p>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span className="grid size-12 place-items-center rounded-xl border border-chalk/40 bg-chalk/10 text-lg font-semibold">QA</span>
                <span className="annot text-center text-[0.6rem] leading-tight text-chalk/70">
                  Software
                  <br />
                  Tester
                </span>
              </div>
            </div>
            <ul className="annot flex flex-wrap gap-x-4 gap-y-1 text-[0.62rem] uppercase tracking-[0.12em] text-chalk/70">
              {tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <button
            ref={bug}
            type="button"
            className="bug"
            onClick={() => phase === "crawl" && setPhase("caught")}
            aria-label={caught ? "Bug caught" : "A bug is eating the folder. Catch it."}
          >
            <svg viewBox="0 0 56 44" className="h-full w-full overflow-visible" aria-hidden>
              <g className="bug-body">
                <g className="bug-legs" stroke="#121418" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M20 28 13 37M28 30 27 40M36 28 42 37M20 20 12 15M36 20 44 15" />
                </g>
                <ellipse cx="28" cy="24" rx="14" ry="10.5" fill="#ff5a47" stroke="#121418" strokeWidth="2" />
                <path d="M28 14v20" stroke="#121418" strokeWidth="1.6" />
                <circle cx="22" cy="21" r="2.2" fill="#121418" />
                <circle cx="33" cy="27" r="2.2" fill="#121418" />
                <circle cx="44" cy="22" r="6" fill="#121418" />
                <path d="M48 18l5-5M49 23l6-1" stroke="#121418" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="46" cy="20.5" r="1.1" fill="#fff" />
              </g>
              <g className="bug-done">
                <circle cx="28" cy="24" r="16" fill="#ddff3f" />
                <path d="m20 24.5 5.5 5.5L37 18.5" fill="none" stroke="#121418" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </button>
        </div>

        <div className="mt-10 h-24 text-center" aria-live="polite">
          {caught ? (
            <div data-show className="ticket inline-flex flex-col items-center gap-2">
              <p className="annot text-chalk/70">DEF-00 · Bug in the folder</p>
              <ol className="annot flex items-center gap-1.5">
                {["New", "Fixed", "Verified"].map((s, i) => (
                  <li key={s} className="ticket-step flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>→</span>}
                    <span className={`rounded-full px-2 py-0.5 ${i === 2 ? "bg-mark text-sheet-ink" : "border border-chalk/30"}`}>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="annot text-chalk/60">Five more are planted on the page.</p>
            </div>
          ) : (
            <p className="annot text-chalk/80">
              A bug got into the files. <span className="text-mark">Tap it.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
