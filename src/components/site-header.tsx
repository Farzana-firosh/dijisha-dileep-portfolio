import Link from "next/link";
import { profile } from "@/content/profile";
import { DefectTracker } from "./defects";
import { Spark } from "./icons";
import { InspectToggle } from "./inspect";
import { CONTACT_PANEL_ID } from "./shared";
import { ThemeCord } from "./theme-toggle";

/** Root-relative anchors so the nav also works from /resume. */
export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#process", label: "How I test" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader({ askEnabled }: { askEnabled: boolean }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b hairline bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-2 sm:gap-4">
        <Link href="/" className="group mr-auto flex min-h-11 items-center gap-2.5">
          <span aria-hidden className="grid size-8 place-items-center rounded-full border border-ink text-[0.7rem] font-semibold tracking-tight transition-colors group-hover:bg-ink group-hover:text-paper">
            DD
          </span>
          <span className="font-semibold tracking-tight max-sm:sr-only">{profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-11 items-center px-3 text-sm text-ink-soft transition-colors hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative flex items-center gap-1.5 sm:gap-2">
          <DefectTracker />
          <InspectToggle compact className="max-sm:hidden" />
          {askEnabled && (
            <button
              type="button"
              popoverTarget={CONTACT_PANEL_ID}
              data-contact-tab="ask"
              className="annot inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-ink px-3 text-paper sm:px-4 transition-colors hover:bg-accent hover:text-on-accent"
            >
              <Spark className="size-4" />
              <span className="max-sm:sr-only">Ask</span>
            </button>
          )}
          <button
            type="button"
            popoverTarget="site-menu"
            className="annot inline-flex min-h-11 items-center rounded-full border hairline px-3 lg:hidden"
          >
            Menu
          </button>
          {/* The theme switch: a cord hanging from the header */}
          <ThemeCord />
        </div>
      </div>
      {/* Reading progress: fills as the page scrolls (CSS scroll timeline; absent where unsupported) */}
      <span aria-hidden className="scroll-progress" />

      {/* Small screens: the same links in a popover (works without JS, closes on Esc or outside tap) */}
      <div id="site-menu" popover="auto" className="sheet fixed inset-auto left-4 right-4 top-18 p-2 lg:hidden">
        <nav aria-label="Main, small screens">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="flex min-h-12 items-center border-b hairline px-3 text-lg last:border-0">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/resume" className="flex min-h-12 items-center px-3 text-lg">
                Resume
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t hairline p-3 sm:hidden">
          <InspectToggle />
        </div>
      </div>
    </header>
  );
}
