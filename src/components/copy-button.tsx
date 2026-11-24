"use client";

import { useState } from "react";
import { Check, Copy } from "./icons";

/** Copies a value (email, phone) and confirms in place. Hidden where the clipboard API isn't available. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard blocked: the link next to it still works
        }
      }}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="annot inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-current/25 px-3 opacity-80 transition hover:border-current hover:opacity-100"
    >
      {copied ? <Check className="size-4 text-pass" /> : <Copy className="size-4" />}
      <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
