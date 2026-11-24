"use client";

import { useEffect, useState, type ReactNode } from "react";

type Tab = { id: string; label: string; panel: ReactNode };

/** Segmented tabs for the contact panel. Without JS the first tab shows; the direct links below stay usable. A
 *  button elsewhere that opens the panel can pick the tab with `data-contact-tab="<id>"` (the header's Ask). */
export function ContactTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const id = e.target instanceof Element && e.target.closest<HTMLElement>("[data-contact-tab]")?.dataset.contactTab;
      if (id && tabs.some((tab) => tab.id === id)) setActive(id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [tabs]);

  if (tabs.length < 2) return <>{tabs[0]?.panel}</>;

  return (
    <div>
      <div role="tablist" aria-label="How to get in touch" className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-paper p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className="flex min-h-11 items-center justify-center rounded-full px-2 text-sm font-semibold text-ink-soft transition-colors aria-selected:bg-ink aria-selected:text-paper"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id} className="mt-4">
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
