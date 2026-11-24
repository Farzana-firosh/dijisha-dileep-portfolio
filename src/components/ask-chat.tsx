"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AskResult } from "@/app/api/ask/route";
import { Send } from "./icons";

type Message = { role: "user" | "model"; text: string; link?: { href: string; label: string } };

/** Questions that are answered here from the portfolio's own data, without calling the model. */
export type LocalAnswer = { q: string; a: string; link?: { href: string; label: string } };

/** The assistant, as the "Ask" tab of the contact panel. The server enforces the daily limit; the count here is for
 *  display only. */
export function AskChat({
  name,
  dailyLimit,
  suggestions,
  local,
}: {
  name: string;
  dailyLimit: number;
  suggestions: string[];
  local: LocalAnswer[];
}) {
  const errors = {
    invalid: "I couldn't read that question. Try asking it differently.",
    limit: `That's all the questions for today. For anything else, contact ${name} directly.`,
    busy: `The assistant has hit its free limit for now. Try again later, or contact ${name} directly.`,
    unavailable: `The assistant isn't available right now. Please contact ${name} directly.`,
    failed: "Something went wrong getting an answer. Please try again.",
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [remaining, setRemaining] = useState(dailyLimit);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<keyof typeof errors | null>(null);
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length || error || pending) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, error, pending]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || pending) return;

    const canned = local.find((l) => l.q === q);
    if (canned) {
      setMessages((m) => [...m, { role: "user", text: q }, { role: "model", text: canned.a, link: canned.link }]);
      return;
    }
    if (remaining <= 0) return;

    const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.text.slice(0, 700) }));
    setMessages((m) => [...m, { role: "user", text: q }]);
    setDraft("");
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data: AskResult = await res.json();
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      if ("answer" in data) setMessages((m) => [...m, { role: "model", text: data.answer }]);
      else setError(data.error);
    } catch {
      setError("failed");
    } finally {
      setPending(false);
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(draft);
  }

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.text));
  const open = remaining > 0 && error !== "unavailable";
  const chips = [...suggestions.filter(() => open), ...local.map((l) => l.q)].filter((s) => !asked.has(s));

  return (
    <div className="flex flex-col">
      <div className="max-h-[min(22rem,45svh)] overflow-y-auto">
        <div role="log" aria-live="polite" aria-label="Questions and answers" className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-ink-soft">
            Answers come only from what&rsquo;s on this site. Nothing is made up; if it isn&rsquo;t here, the assistant says so.
          </p>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <p key={i} className="annot self-end bg-ink px-3 py-2 text-[0.8rem] text-paper">
                <span aria-hidden className="text-mark">
                  ›{" "}
                </span>
                {m.text}
              </p>
            ) : (
              <div key={i} className="border-l-2 border-accent pl-3 text-[0.95rem] leading-relaxed">
                <p className="whitespace-pre-line">{m.text}</p>
                {m.link && (
                  <a href={m.link.href} className="mt-1 inline-block font-semibold text-accent underline underline-offset-4">
                    {m.link.label}
                  </a>
                )}
              </div>
            ),
          )}
          {pending && (
            <div className="flex flex-col gap-2" aria-label="Looking that up">
              <p className="annot text-ink-soft">Checking the portfolio…</p>
              <div className="scan" />
            </div>
          )}
          {error && <p className="border-l-2 border-fail pl-3 text-sm leading-relaxed text-fail">{errors[error]}</p>}
          <div ref={end} />
        </div>

        {chips.length > 0 && !pending && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="min-h-11 rounded-full border hairline px-3.5 text-left text-sm transition-colors hover:border-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2 border-t hairline pt-3">
        <label htmlFor="ask-question" className="sr-only">
          Your question
        </label>
        <input
          id="ask-question"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={300}
          autoComplete="off"
          disabled={!open}
          placeholder={open ? "Ask about skills, experience, tools…" : "No more questions today"}
          className="min-h-11 w-full min-w-0 border-b hairline bg-transparent px-1 text-sm outline-none placeholder:text-ink-soft/70 focus:border-accent disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={!open || pending || !draft.trim()}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-accent hover:text-on-accent disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
      <p className="annot mt-1 text-ink-soft">
        {open ? `${remaining} of ${dailyLimit} questions left today` : "The contact details on the page still work."}
      </p>
    </div>
  );
}
