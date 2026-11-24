import { CareerStack, type CareerEntry } from "@/components/career-stack";
import Image from "next/image";
import { Defect } from "@/components/defects";
import { education, roles } from "@/content/experience";

// Oldest first, so the files read as growth from 2013 to now
const entries: CareerEntry[] = [
  ...education
    .slice()
    .reverse()
    .map((e) => ({
      id: e.degree.toLowerCase().replace(/\W/g, ""),
      year: e.period.slice(0, 4),
      short: `${e.degree}, ${e.field === "Signal Processing" ? e.field : "ECE"}`,
      kind: "Education" as const,
      title: `${e.degree}, ${e.field}`,
      org: `${e.school} (${e.university})`,
      period: e.period,
      points: [],
      grade: e.grade,
    })),
  ...roles
    .slice()
    .reverse()
    .map((r) => ({
      id: r.id,
      year: r.start,
      short: r.id === "ems-college" ? "Teaching, EMS College" : r.org,
      kind: "Work" as const,
      title: r.title,
      org: r.org,
      place: r.place,
      period: r.period,
      points: r.points,
      current: r.current,
    })),
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="wrap pt-10 sm:pt-12">
      <CareerStack
        entries={entries}
        aside={<Image src="/experience/desk.webp" alt="" width={560} height={910} sizes="20rem" className="h-auto w-full" />}
        header={
          <header className="exp-head flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <div>
              <p className="annot text-lg">
                <span className="text-accent">04</span> · Experience
              </p>
              <h2 id="experience-title" data-spec="h2" className="font-display mt-2 text-[clamp(2.6rem,5.4vw,5rem)]">
                Experience and education
              </h2>
            </div>
            <p className="annot max-w-xs text-lg text-ink-soft max-sm:hidden">2013 to now, one file per stage. Scroll, or pick a tab.</p>
          </header>
        }
        label={
          <Defect id="tab" className="defect-tab block">
            <span className="annot block bg-sheet px-3 py-1 text-left text-sm text-sheet-ink shadow-sm">Dijisha Dileep</span>
          </Defect>
        }
      />
      <div className="h-24 sm:h-32" />
    </section>
  );
}
