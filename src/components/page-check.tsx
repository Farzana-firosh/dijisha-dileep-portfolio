"use client";

import { useCallback, useEffect, useState } from "react";
import { Defect } from "./defects";

/** Real checks run against this page in the visitor's browser. Results and timings are measured, never staged:
 *  if a check fails, it shows as failed. */

type Outcome = { ok: boolean; detail: string };
type Check = { name: string; run: () => Outcome };

const visible = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
};

const accessibleName = (el: Element) =>
  (
    el.getAttribute("aria-label") ||
    (el.getAttribute("aria-labelledby") &&
      el
        .getAttribute("aria-labelledby")!
        .split(" ")
        .map((id) => document.getElementById(id)?.textContent ?? "")
        .join(" ")) ||
    el.textContent ||
    el.getAttribute("title") ||
    ""
  ).trim();

const checks: Check[] = [
  {
    name: "html declares a language",
    run: () => {
      const lang = document.documentElement.lang;
      return { ok: Boolean(lang), detail: lang ? `lang="${lang}"` : "missing" };
    },
  },
  {
    name: "exactly one <h1>",
    run: () => {
      const n = document.querySelectorAll("h1").length;
      return { ok: n === 1, detail: `${n} found` };
    },
  },
  {
    name: "headings never skip a level",
    run: () => {
      const hs = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")];
      let prev = 0;
      let skips = 0;
      for (const h of hs) {
        const level = Number(h.tagName[1]);
        if (prev && level > prev + 1) skips++;
        prev = level;
      }
      return { ok: skips === 0, detail: `${hs.length} headings` };
    },
  },
  {
    name: "links and buttons have names",
    run: () => {
      const els = [...document.querySelectorAll("a[href], button")].filter(visible);
      const unnamed = els.filter((el) => !accessibleName(el)).length;
      return { ok: unnamed === 0, detail: unnamed ? `${unnamed} unnamed` : `${els.length} checked` };
    },
  },
  {
    name: "buttons are at least 24px",
    run: () => {
      const els = [...document.querySelectorAll("button")].filter(visible);
      // Layout size, not on-screen size: the check runs while this sheet is still scaled down (crumpled), and
      // transforms don't change a button's target size
      const small = els.filter((el) => el.offsetWidth < 24 || el.offsetHeight < 24).length;
      return { ok: small === 0, detail: small ? `${small} too small` : `${els.length} checked` };
    },
  },
  {
    name: "images have alt text",
    run: () => {
      const imgs = [...document.querySelectorAll("img")];
      const missing = imgs.filter((i) => !i.hasAttribute("alt")).length;
      return { ok: missing === 0, detail: `${imgs.length} images` };
    },
  },
  {
    name: "meta description is 50–160 chars",
    run: () => {
      const len = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content.length ?? 0;
      return { ok: len >= 50 && len <= 160, detail: `${len} chars` };
    },
  },
  {
    name: "canonical URL is set",
    run: () => {
      const href = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute("href");
      return { ok: Boolean(href), detail: href ? new URL(href, location.href).pathname : "missing" };
    },
  },
  {
    name: "structured data parses",
    run: () => {
      const types: string[] = [];
      try {
        for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
          const data = JSON.parse(s.textContent ?? "");
          types.push(data["@type"]);
        }
      } catch {
        return { ok: false, detail: "invalid JSON" };
      }
      return { ok: types.length > 0, detail: types.join(", ") || "none" };
    },
  },
  {
    name: "no horizontal scroll",
    run: () => {
      const extra = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return { ok: extra <= 1, detail: `${innerWidth}px wide` };
    },
  },
];

type Result = Outcome & { name: string; ms: number };

const fmt = (ms: number) => (ms < 0.1 ? "<0.1 ms" : `${ms.toFixed(1)} ms`);

/** Shown on the lifecycle sheet as a results panel: a score ring that fills as results stream in, then the
 *  checks in two columns. */
export function PageCheck({ className = "" }: { className?: string }) {
  const [results, setResults] = useState<Result[] | null>(null);
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);

  const execute = useCallback(() => {
    const out = checks.map((c) => {
      const t = performance.now();
      const o = c.run();
      return { ...o, name: c.name, ms: performance.now() - t };
    });
    setResults(out);
    setShown(matchMedia("(prefers-reduced-motion: reduce)").matches ? out.length : 0);
  }, []);

  // First run once the page has loaded and settled, so layout checks see the final page
  useEffect(() => {
    let idle = 0;
    const go = () => {
      idle = window.setTimeout(execute, 350);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      window.clearTimeout(idle);
    };
  }, [execute, run]);

  // Reveal results one by one, like a reporter streaming
  useEffect(() => {
    if (!results || shown >= results.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), 110);
    return () => window.clearTimeout(t);
  }, [results, shown]);

  const done = results !== null && shown >= results.length;
  const passed = results?.filter((r) => r.ok).length ?? 0;
  const failed = (results?.length ?? 0) - passed;
  const total = results?.reduce((s, r) => s + r.ms, 0) ?? 0;

  const shownResults = results?.slice(0, shown) ?? [];
  const shownPassed = shownResults.filter((r) => r.ok).length;
  const ring = 2 * Math.PI * 34;

  return (
    <div className={`rounded-[1.75rem] border border-sheet-ink/15 bg-sheet-ink/[0.03] p-6 ${className}`}>
      <div className="flex items-center gap-5">
        {/* Score: fills as results come in */}
        <div className="relative grid size-20 shrink-0 place-items-center">
          <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-sheet-ink/10" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className={`transition-[stroke-dashoffset] duration-300 ${failed && done ? "stroke-note-pink" : "stroke-pass"}`}
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - shownPassed / checks.length)}
            />
          </svg>
          <p className="font-display text-2xl text-sheet-ink">
            {shownPassed}
            <span className="text-base text-sheet-ink/50">/{checks.length}</span>
          </p>
        </div>
        <h3 className="font-display text-[1.9rem] leading-[0.95] text-sheet-ink">This page, tested in your browser</h3>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-sheet-ink/65">
        <Defect id="typo" context="Running" className="inline-flex min-h-6 items-center px-0.5" fixedChildren="Running">
          Runing
        </Defect>{" "}
        {checks.length} real checks on this page right now. A failure would show as a failure.
      </p>

      <ol className="mt-4 space-y-0.5 border-t border-sheet-ink/10 pt-3" aria-label="Check results" aria-busy={!done}>
        {checks.map((c, i) => {
          const r = results && i < shown ? results[i] : null;
          return (
            <li key={c.name} title={r?.detail} className="flex min-h-7 items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className={`grid size-4.5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold transition-colors ${
                  r ? (r.ok ? "bg-mark text-on-mark" : "bg-note-pink text-sheet-ink") : "border border-dashed border-sheet-ink/30"
                }`}
              >
                {r ? (r.ok ? "✓" : "✕") : ""}
              </span>
              <span className={`min-w-0 flex-1 truncate ${r ? "text-sheet-ink/90" : "text-sheet-ink/40"}`}>
                {c.name}
                {r && <span className="sr-only">{`${r.ok ? ": passed" : ": failed"}, ${r.detail}`}</span>}
              </span>
              <span className="pixel shrink-0 text-base tabular-nums text-sheet-ink/40">{r ? fmt(r.ms) : ""}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-sheet-ink/10 pt-3">
        <p className="pixel whitespace-nowrap text-base" aria-live="polite">
          {done ? (
            <>
              <span className="text-pass">{passed} passed</span>
              <span className="text-sheet-ink/55"> · </span>
              <span className={failed ? "text-note-pink" : "text-sheet-ink/55"}>{failed} failed</span>
              <span className="text-sheet-ink/55"> · {fmt(total)}</span>
            </>
          ) : (
            <span className="text-sheet-ink/55">
              <noscript>Turn on JavaScript to run the checks.</noscript>
              {results === null ? "Waiting for the page…" : "Running…"}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setResults(null);
            setRun((n) => n + 1);
          }}
          disabled={!done}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-sheet-ink/30 px-4 text-sm font-medium text-sheet-ink transition-colors hover:border-pass hover:text-pass disabled:opacity-40"
        >
          ↻ Re-run
        </button>
      </div>
    </div>
  );
}