"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Bug, Check } from "./icons";

/** "Find the defects": five small visual bugs planted on the page. Clicking one reports and fixes it.
 *  Decorative and optional; the tracker in the header lists them for keyboard and screen-reader users. */

export const defects = [
  { id: "tape", code: "DEF-01", title: "Tape peeling off the title block", section: "About" },
  { id: "typo", code: "DEF-02", title: "Typo in the test report heading", section: "Skills" },
  { id: "pin", code: "DEF-03", title: "Tool card hanging off its missing pin", section: "Skills" },
  { id: "tab", code: "DEF-04", title: "Folder label stuck on crooked", section: "Experience" },
  { id: "rule", code: "DEF-05", title: "Measure line stops short", section: "Contact" },
] as const;

export type DefectId = (typeof defects)[number]["id"];

type State = { fixed: ReadonlySet<DefectId>; last: DefectId | null; seq: number };

const initial: State = { fixed: new Set(), last: null, seq: 0 };
let state = initial;
const listeners = new Set<() => void>();

function emit(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useDefects() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}

function fix(id: DefectId) {
  if (state.fixed.has(id)) return;
  emit({ fixed: new Set(state.fixed).add(id), last: id, seq: state.seq + 1 });
}

const resetAll = () => emit({ ...initial, seq: state.seq + 1 });

const find = (id: DefectId) => defects.find((d) => d.id === id)!;

/** Wraps the defective piece of UI. Its look per state lives in globals.css (`.defect-<id>[data-state]`). */
export function Defect({
  id,
  className = "",
  children,
  fixedChildren,
  context,
}: {
  id: DefectId;
  className?: string;
  children: ReactNode;
  /** Name of the content inside, when it matters (the label replaces it for screen readers). */
  context?: string;
  /** What to show once fixed, when the fix is a content change rather than a CSS one. */
  fixedChildren?: ReactNode;
}) {
  const { fixed } = useDefects();
  const done = fixed.has(id);
  const d = find(id);
  return (
    <button
      type="button"
      id={`defect-${id}`}
      data-state={done ? "fixed" : "open"}
      aria-label={`${context ? `${context}. ` : ""}${done ? `${d.code} fixed: ${d.title}` : `Planted defect: ${d.title}. Report it.`}`}
      aria-disabled={done || undefined}
      onClick={() => fix(id)}
      className={`defect defect-${id} ${className}`}
    >
      {done && fixedChildren !== undefined ? fixedChildren : children}
    </button>
  );
}

/** Header button + popover listing every defect, and the ticket toast shown when one is fixed. */
export function DefectTracker() {
  const { fixed, last, seq } = useDefects();
  const count = fixed.size;
  const total = defects.length;

  return (
    <>
      <button
        type="button"
        popoverTarget="defect-list"
        className="annot inline-flex min-h-11 items-center gap-2 rounded-full border hairline px-3 transition-colors hover:border-ink"
      >
        <Bug className="size-4" />
        <span>
          {count}/{total}
          <span className="max-sm:sr-only"> bugs found</span>
        </span>
      </button>

      <div
        id="defect-list"
        popover="auto"
        className="sheet fixed inset-auto right-4 top-18 w-[min(24rem,calc(100vw-2rem))] p-5"
      >
        <p className="annot text-accent">Defect log</p>
        <p className="mt-1 text-lg font-semibold">Five defects are planted on this page</p>
        <p className="mt-1 text-sm text-ink-soft">Spot one, click it, and it gets reported and fixed.</p>
        <ol className="mt-4 divide-y hairline border-y">
          {defects.map((d) => {
            const done = fixed.has(d.id);
            return (
              <li key={d.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="annot w-14 shrink-0 text-ink-soft">{d.code}</span>
                <span className="min-w-0 flex-1">
                  {done ? d.title : <span className="text-ink-soft">Hidden in {d.section}</span>}
                </span>
                {done ? (
                  <span className="annot inline-flex items-center gap-1 text-pass">
                    <Check className="size-3.5" /> Closed
                  </span>
                ) : (
                  <a
                    href={`/#defect-${d.id}`}
                    className="annot inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
                    onClick={(e) => {
                      // Close the popover, then move focus to the defect so keyboard users can press it
                      (e.currentTarget.closest("[popover]") as HTMLElement | null)?.hidePopover();
                      requestAnimationFrame(() => document.getElementById(`defect-${d.id}`)?.focus({ preventScroll: true }));
                    }}
                  >
                    Go there
                  </a>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="annot text-ink-soft">
            {count} of {total} closed
          </p>
          {count > 0 && (
            <button type="button" onClick={resetAll} className="annot min-h-11 px-2 text-ink-soft underline underline-offset-4 hover:text-ink">
              Plant them again
            </button>
          )}
        </div>
      </div>

      <Ticket key={seq} id={last} count={count} total={total} />
    </>
  );
}

function Ticket({ id, count, total }: { id: DefectId | null; count: number; total: number }) {
  const [visible, setVisible] = useState(Boolean(id));
  const timer = useRef<number>(undefined);

  useEffect(() => {
    if (!id) return;
    timer.current = window.setTimeout(() => setVisible(false), count === total ? 9000 : 4800);
    return () => window.clearTimeout(timer.current);
  }, [id, count, total]);

  const d = id ? find(id) : null;
  const all = count === total;

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-start sm:inset-x-auto sm:left-4">
      {d && visible && (
        <div data-show className="ticket pointer-events-auto w-full max-w-sm border hairline bg-card p-4 shadow-xl sm:w-80">
          <div className="flex items-center justify-between">
            <p className="annot text-accent">{d.code}</p>
            <p className="annot text-ink-soft">
              {count}/{total}
            </p>
          </div>
          <p className="mt-1 text-sm font-semibold">{d.title}</p>
          <ol className="annot mt-3 flex items-center gap-1.5" aria-label="Status">
            {["New", "Fixed", "Verified"].map((s, i) => (
              <li key={s} className="ticket-step flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>→</span>}
                <span className={`rounded-full px-2 py-0.5 ${i === 2 ? "bg-mark text-on-mark" : "border hairline"}`}>{s}</span>
              </li>
            ))}
          </ol>
          {all && (
            <p className="mt-3 border-t hairline pt-3 text-sm">
              All five closed. Good eye.{" "}
              <a href="#contact" className="font-semibold text-accent underline underline-offset-4">
                Talk to a tester
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
