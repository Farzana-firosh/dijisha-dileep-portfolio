import Link from "next/link";
import type { ReactNode } from "react";
import { mailHref, profile, whatsappHref } from "@/content/profile";
import { AskChat, type LocalAnswer } from "./ask-chat";
import { ContactForm } from "./contact-form";
import { ContactTabs } from "./contact-tabs";
import { Cross, Download, Mail, WhatsApp } from "./icons";
import { CONTACT_PANEL_ID } from "./shared";

// Read at build time; only these yes/no values (and the public form key) reach the page
const askEnabled = Boolean(process.env.GEMINI_API_KEY);
const formKey = process.env.WEB3FORMS_ACCESS_KEY ?? "";

const localAnswers: LocalAnswer[] = [
  {
    q: `How can I contact ${profile.firstName}?`,
    a: `Email ${profile.email} or call ${profile.phone.display}. ${profile.firstName} is based in ${profile.city}.`,
    link: { href: mailHref, label: "Write an email" },
  },
  {
    q: "Can I see the resume?",
    a: "Yes. The full resume is on this site, with a PDF to download.",
    link: { href: "/resume", label: "Open the resume" },
  },
];

/** Chat-style contact panel in a native popover (opens from any `popoverTarget={CONTACT_PANEL_ID}`, closes on Esc or
 *  outside tap). Tabs: a message form once WEB3FORMS_ACCESS_KEY is set, and Ask once GEMINI_API_KEY is set. The
 *  direct links (email, call, resume) are always there. */
export function ContactPanel() {
  const chip = "inline-flex min-h-11 items-center gap-1.5 rounded-full border hairline px-3.5 text-sm font-medium transition-colors hover:border-ink";
  const tabs: { id: string; label: string; panel: ReactNode }[] = [];
  if (formKey) tabs.push({ id: "message", label: "Send a message", panel: <ContactForm accessKey={formKey} /> });
  if (askEnabled) {
    tabs.push({
      id: "ask",
      label: "Ask about me",
      panel: (
        <AskChat
          name={profile.firstName}
          dailyLimit={profile.ask.dailyLimit}
          suggestions={[
            `What testing does ${profile.firstName} do?`,
            `What's ${profile.firstName}'s automation experience?`,
            "Which tools are in the toolkit?",
          ]}
          local={localAnswers}
        />
      ),
    });
  }

  return (
    <div
      id={CONTACT_PANEL_ID}
      popover="auto"
      aria-labelledby="contact-panel-title"
      className="sheet fixed inset-auto bottom-[env(safe-area-inset-bottom)] right-0 m-0 flex max-h-[min(44rem,calc(100dvh-4.5rem))] w-full flex-col overflow-hidden rounded-t-3xl sm:bottom-4 sm:right-4 sm:w-[24rem] sm:rounded-3xl"
    >
      <div className="flex items-center gap-3 bg-ink px-4 py-3.5 text-paper">
        <span aria-hidden className="relative">
          <span className="font-display grid size-10 place-items-center rounded-full bg-mark text-xl text-on-mark">
            {profile.firstName[0]}
          </span>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-pass ring-2 ring-ink" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="contact-panel-title" className="text-sm font-semibold leading-tight">
            {profile.name}
          </h2>
          <p className="mt-0.5 text-xs text-paper/60">{profile.role} · replies by email or WhatsApp</p>
        </div>
        <button
          type="button"
          popoverTarget={CONTACT_PANEL_ID}
          popoverTargetAction="hide"
          aria-label="Close"
          className="grid size-11 shrink-0 place-items-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
        >
          <Cross className="size-5" />
        </button>
      </div>

      <div className="min-h-0 flex-auto overflow-y-auto p-4">
        <div className="flex items-end gap-2">
          <span aria-hidden className="font-display grid size-6 shrink-0 place-items-center rounded-full bg-mark text-xs text-on-mark">
            {profile.firstName[0]}
          </span>
          <p className="rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2.5 text-sm">Hi 👋 How would you like to get in touch?</p>
        </div>
        {tabs.length > 0 && (
          <div className="mt-4">
            <ContactTabs tabs={tabs} />
          </div>
        )}
      </div>

      {/* Fixed under the scrolling part, so the direct options stay in reach */}
      <div className="shrink-0 border-t hairline px-4 pb-4 pt-3">
        <p className="annot text-ink-soft">{tabs.length > 0 ? "Or reach me directly" : "Reach me directly"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a href={mailHref} className={`${chip} border-transparent bg-mark text-on-mark`}>
            <Mail className="size-4" />
            Email
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={chip}>
            <WhatsApp className="size-4" />
            WhatsApp
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
          <Link href="/resume" className={chip}>
            <Download className="size-4" />
            Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
