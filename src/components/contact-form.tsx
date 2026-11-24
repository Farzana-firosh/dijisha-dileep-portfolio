"use client";

import { useState, type FormEvent } from "react";
import { Send } from "./icons";

type Status = "idle" | "sending" | "sent" | "failed";

const endpoint = "https://api.web3forms.com/submit";
const field =
  "w-full rounded-xl border hairline bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors hover:border-ink/40 focus:border-ink focus:outline-none";
const label = "annot text-ink-soft";

/** Emails Dijisha through Web3Forms (the access key is public by design). Without JS it still posts as a normal
 *  form; with JS it sends in place. */
export function ContactForm({ accessKey }: { accessKey: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(form) });
      const data: { success?: boolean } = await res.json();
      if (!data.success) throw new Error("Not sent");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-2xl rounded-tl-sm bg-paper px-4 py-3 text-sm leading-relaxed">
        <span className="font-semibold">Thanks, your message is on its way.</span> I&rsquo;ll reply by email.
      </p>
    );
  }

  return (
    <form action={endpoint} method="POST" onSubmit={send} className="flex flex-col gap-3">
      <input type="hidden" name="access_key" value={accessKey} />
      <input type="hidden" name="subject" value="New message from your portfolio" />
      {/* Spam trap: people never see or tick it */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1">
          <span className={label}>Name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={label}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className={label}>Message</span>
        <textarea name="message" required rows={3} placeholder="A few lines about the role" className={`${field} resize-none`} />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <Send className="size-4" />
      </button>
      <p role="status" className="text-sm text-fail empty:hidden">
        {status === "failed" ? "Couldn’t send just now. Please email or call instead." : ""}
      </p>
    </form>
  );
}
