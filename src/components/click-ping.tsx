"use client";

import { useEffect } from "react";

/** A small ring where the visitor clicks (mouse/pen only, motion allowed). Purely visual; nothing to render server side. */
export function ClickPing() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      const dot = document.createElement("span");
      dot.className = "click-ping";
      dot.setAttribute("aria-hidden", "");
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
      document.body.append(dot);
    };
    addEventListener("pointerdown", onDown, { passive: true });
    return () => removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}
