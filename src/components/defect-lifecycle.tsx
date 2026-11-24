"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { lifecycle, sampleRun, sideStates } from "@/content/process";
import { BugGlyph } from "./board-bits";

const all = [...lifecycle, ...sideStates];
const byId = (id: string) => all.find((s) => s.id === id)!;

/** Where each branch leaves the main path. */
const branchFrom: Record<string, string> = { reopened: "retest", rejected: "new", deferred: "assigned" };

/** The defect lifecycle as a wheel (wide screens): a disc holds the title, the controls and the current state; the
 *  seven main states are cards around its edge, and the wheel turns to bring the current one to the front. A branch
 *  (reopened, rejected, deferred) turns to the state it leaves from and stamps that card. Below `lg` the cards are a
 *  plain grid. The pressed buttons and the status line carry the state; wheel and ticket are decoration. */
export function DefectLifecycle() {
  const [selected, setSelected] = useState("new");
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    if (step === null) return;
    const last = step >= sampleRun.length - 1;
    const t = window.setTimeout(
      () => {
        if (last) {
          setSelected(sampleRun[step]);
          setStep(null);
        } else setStep(step + 1);
      },
      last ? 1300 : 1200,
    );
    return () => window.clearTimeout(t);
  }, [step]);

  const playing = step !== null;
  const current = playing ? sampleRun[step] : selected;
  const state = byId(current);
  const branch = current in branchFrom ? current : null;
  const front = lifecycle.findIndex((s) => s.id === (branch ? branchFrom[branch] : current));

  const pick = (id: string) => {
    setStep(null);
    setSelected(id);
  };

  return (
    <div className="life-wheel">
      {/* The disc: title, controls, current state */}
      <div className="life-disc">
        <div className="life-copy">
          <p className="font-display text-[2rem] leading-none">One bug&rsquo;s trip</p>
          <span aria-hidden className="mt-3 block h-1 w-16 bg-mark" />
          <p className="mt-3 text-sheet-soft">Pick a state, or play a defect from New to Closed, failed retest included.</p>



          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => (playing ? pick(current) : setStep(0))}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sheet-ink px-5 font-semibold text-sheet transition-colors hover:bg-board"
            >
              {playing ? "■ Stop" : "▶ Play a defect"}
            </button>
            <ul className="contents" aria-label="Branches off the main path">
              {sideStates.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-pressed={current === s.id}
                    onClick={() => pick(s.id)}
                    className={`annot inline-flex min-h-11 items-center rounded-full border-2 border-dashed px-3 text-sm transition-colors ${
                      current === s.id ? "border-stamp bg-stamp text-sheet" : "border-sheet-ink/30 hover:border-sheet-ink"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Status under the controls, so the buttons never move as the text changes length */}
          <p className="pixel mt-4 min-h-[4.4em] rounded-xl bg-sheet-ink/[0.05] px-3 py-2 text-lg leading-tight" aria-live="polite">
            <span className="text-stamp">
              {playing ? `step ${step + 1}/${sampleRun.length}` : "status"}: {state.label}
            </span>
            <br />
            {state.meaning}
          </p>
        </div>
      </div>

      {/* The main path, around the disc */}      <ol className="life-cards" aria-label="Main path">
        {lifecycle.map((s, i) => {
          const k = i - front;
          const on = k === 0;
          return (
            <li key={s.id} className="contents">
              <button
                type="button"
                aria-pressed={current === s.id}
                onClick={() => pick(s.id)}
                className={`life-card ${on ? "bg-mark text-on-mark" : "bg-sheet text-sheet-ink ring-1 ring-sheet-ink/10"} ${Math.abs(k) > 2 ? "life-far" : ""}`}
                style={{ "--t": `${k * 34}deg`, "--o": Math.abs(k) > 2 ? 0 : 1 - Math.abs(k) * 0.12 } as CSSProperties}
              >
                <span className="font-display text-5xl leading-none opacity-80">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display mt-auto text-[2rem] leading-none">{s.label}</span>
                {on && branch && (
                  <span aria-hidden className="stamp annot absolute right-4 top-4 bg-sheet/70 text-base">
                    {byId(branch).label}
                  </span>
                )}
                {on && !branch && (
                  <span aria-hidden key={`${current}-${step}`} className="life-ticket note-paper">
                    <BugGlyph className="h-6 w-8" />
                    <span className="annot text-[0.7rem] leading-none">Sample bug</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
