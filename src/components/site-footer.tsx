import Link from "next/link";
import { mailHref, profile, telHref, whatsappHref } from "@/content/profile";
import { CopyButton } from "./copy-button";
import { Defect } from "./defects";
import { ArrowUpRight, Chat, Download, LinkedIn, WhatsApp } from "./icons";
import { CONTACT_PANEL_ID } from "./shared";
import { nav } from "./site-header";

const pill = "inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors";

/** Contact and footer in one dark band at the end of every page: a big "Let's talk", the direct details, the ways to
 *  reach out, then a bottom bar with the links and back to top. */
export function SiteFooter() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="no-print relative isolate overflow-hidden bg-night text-chalk">
      <div className="wrap pb-6 pt-20 lg:pt-24">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="annot text-lg text-mark">Contact</p>
            <h2 id="contact-title" className="mt-4">
              <span className="font-display block text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.84]">Let&rsquo;s talk</span>
              <span aria-hidden className="text-outline font-display block text-[clamp(3.4rem,10vw,8.5rem)] leading-[0.84]">
                Let&rsquo;s talk
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-lg text-lg text-chalk/75">
              Hiring a software tester, or have a question about my work? Send a message, ask the assistant, or write to me
              directly.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={mailHref}
                  className="break-all text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium underline decoration-mark decoration-2 underline-offset-[6px] hover:text-mark"
                >
                  {profile.email}
                </a>
                <CopyButton value={profile.email} label="email address" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={telHref} className="text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium underline decoration-chalk/30 decoration-2 underline-offset-[6px] hover:text-mark">
                  {profile.phone.display}
                </a>
                <CopyButton value={profile.phone.e164} label="phone number" />
                <span className="text-chalk/55">
                  · {profile.city}, {profile.country}
                </span>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" popoverTarget={CONTACT_PANEL_ID} className={`${pill} bg-chalk text-sheet-ink hover:bg-mark`}>
                <Chat className="size-[18px]" />
                Send a message
              </button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${pill} border border-chalk/30 hover:border-chalk`}>
                <WhatsApp className="size-[18px]" />
                WhatsApp
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
              <a href={profile.cv} download className={`${pill} bg-mark text-on-mark hover:brightness-105`}>
                <Download className="size-[18px]" />
                Resume (PDF)
              </a>
              <Link href="/resume" className={`${pill} border border-chalk/30 hover:border-chalk`}>
                Read it online
                <ArrowUpRight className="size-4" />
              </Link>
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer me" className={`${pill} border border-chalk/30 hover:border-chalk`}>
                  <LinkedIn className="size-4" />
                  LinkedIn
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* DEF-05: the rule above the bottom bar */}
        <Defect id="rule" className="defect-rule relative mt-14 block h-6 w-full">
          <span aria-hidden className="rule-line absolute left-0 right-0 top-1/2 border-t border-chalk/30" />
          <span aria-hidden className="absolute left-0 top-1/2 h-3 -translate-y-1/2 border-l border-chalk/30" />
          <span aria-hidden className="absolute right-0 top-1/2 h-3 -translate-y-1/2 border-r border-chalk/30" />
        </Defect>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-chalk/65">
          <p>
            <span className="font-medium text-chalk">{profile.name}</span> · {profile.role} · {profile.city}
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-chalk">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/resume" className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-chalk">
                  Resume
                </Link>
              </li>
            </ul>
          </nav>
          <a href="#main" className="inline-flex min-h-11 items-center transition-colors hover:text-chalk">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
