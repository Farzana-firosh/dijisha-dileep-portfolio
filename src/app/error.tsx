"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
      <p className="annot text-fail">Unexpected failure</p>
      <h1 className="font-display mt-4 text-[clamp(2.5rem,8vw,4.5rem)]">Something broke on this page</h1>
      <p className="mt-4 text-ink-soft">Try again, or go back to the home page.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-medium text-paper hover:bg-accent hover:text-on-accent"
        >
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full border border-ink px-6 font-medium">
          Home
        </Link>
      </div>
    </section>
  );
}
