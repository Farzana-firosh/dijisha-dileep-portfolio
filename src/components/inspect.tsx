"use client";

import { useSyncExternalStore } from "react";
import { Lens } from "./icons";

/** Inspect mode: `data-inspect` on <html> outlines every [data-spec] element with its label (globals.css). */

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const isOn = () => document.documentElement.hasAttribute("data-inspect");

function setInspect(on: boolean) {
  document.documentElement.toggleAttribute("data-inspect", on);
  listeners.forEach((l) => l());
}

export function InspectToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const on = useSyncExternalStore(subscribe, isOn, () => false);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setInspect(!on)}
      className={`annot inline-flex min-h-11 items-center gap-2 rounded-full border px-3 transition-colors ${
        on ? "border-accent bg-accent text-on-accent" : "hairline hover:border-ink"
      } ${className}`}
    >
      <Lens className="size-4" />
      <span className={compact ? "max-sm:sr-only" : undefined}>Inspect</span>
    </button>
  );
}
