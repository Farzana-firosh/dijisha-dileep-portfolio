import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="border hairline bg-card">
        <div className="flex items-center justify-between border-b hairline px-5 py-3">
          <p className="annot text-accent">DEF-404</p>
          <p className="annot rounded-full border hairline px-2 py-0.5 text-ink-soft">Rejected · can&rsquo;t reproduce</p>
        </div>
        <div className="px-5 py-8">
          <h1 className="font-display text-[clamp(3rem,10vw,6rem)]">Page not found</h1>
          <dl className="mt-8 grid grid-cols-[8rem_1fr] gap-y-3 text-sm">
            <dt className="annot text-ink-soft">Expected</dt>
            <dd>A page at this address.</dd>
            <dt className="annot text-ink-soft">Actual</dt>
            <dd>Nothing here. The link may be old or mistyped.</dd>
            <dt className="annot text-ink-soft">Workaround</dt>
            <dd>
              <Link href="/" className="font-semibold text-accent underline underline-offset-4">
                Go to the home page
              </Link>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
