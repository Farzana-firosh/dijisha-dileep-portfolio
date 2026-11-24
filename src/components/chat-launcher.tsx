"use client";

import { useEffect, useRef } from "react";
import { Chat } from "./icons";
import { CONTACT_PANEL_ID } from "./shared";

/** Floating button that opens the contact panel. Steps aside while the contact footer is on screen (it has the same
 *  buttons, and the launcher would cover them). */
export function ChatLauncher() {
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const footer = document.getElementById("contact");
    const b = btn.current;
    if (!footer || !b) return;
    const io = new IntersectionObserver(([e]) => b.toggleAttribute("data-away", e.isIntersecting), { threshold: 0.05 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={btn}
      type="button"
      popoverTarget={CONTACT_PANEL_ID}
      className="no-print fixed bottom-5 right-5 z-50 flex min-h-14 items-center gap-2.5 rounded-full bg-mark pl-5 pr-6 font-semibold text-on-mark shadow-[0_18px_36px_-18px_rgb(0_0_0/0.6)] transition-[translate,opacity,visibility] duration-300 hover:-translate-y-0.5 data-away:invisible data-away:translate-y-6 data-away:opacity-0"
    >
      <Chat className="size-5" />
      Let&rsquo;s talk
    </button>
  );
}
