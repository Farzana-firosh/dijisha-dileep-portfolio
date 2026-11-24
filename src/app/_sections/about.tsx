import { BugGlyph, Pin, Tape } from "@/components/board-bits";
import { Defect } from "@/components/defects";
import { Magnifier } from "@/components/magnifier";
import { education, roles } from "@/content/experience";
import { profile } from "@/content/profile";
import { domains, platforms } from "@/content/skills";

/** About, in three columns: then → now on the left, the story under the magnifier in the middle, the facts on the
 *  right. The magnifier's tiny print repeats facts from elsewhere, and its bug only shows through the glass. */
export function About() {
  const facts = [
    ["Name", profile.name],
    ["Role", profile.role],
    ["Based in", `${profile.city}, ${profile.region}`],
    ["In QA", profile.experience],
    ["Now", `${profile.currentRole.company}, since ${profile.currentRole.since}`],
    ["Education", `${education[0].degree}, ${education[0].field}`],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="turn-under wrap overflow-x-clip pb-24 pt-16 sm:pb-32 sm:pt-20">
      <header className="mx-auto max-w-4xl text-center">
        <p className="annot text-lg text-accent">01 · About</p>
        <h2 id="about-title" data-spec="h2" className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] text-balance">
          From electronics to <span className="marked [--mark-wash:var(--color-mark)] px-1">software testing</span>
        </h2>
      </header>

      <div className="mx-auto mt-10 grid max-w-7xl items-center gap-x-12 gap-y-10 sm:mt-16 sm:gap-y-14 sm:grid-cols-2 xl:grid-cols-[15rem_minmax(0,40rem)_18rem] xl:justify-center">
        {/* Centre: the story under the magnifier (first on small screens) */}
        <div className="crumple-in crumple-sq relative z-10 sm:col-span-2 xl:col-span-1 xl:col-start-2 xl:row-start-1">
          <Magnifier startX={0.62} startY={0.3} large>
            <article data-spec="article · story" className="sheet-paper relative space-y-4 px-6 pb-7 pt-8 leading-relaxed sm:px-10 sm:pt-9 sm:text-lg">
              <p className="text-lg sm:text-xl">
                I&rsquo;m a software tester at Kiebot in Bangalore. I work across the testing cycle for web and mobile
                applications:{" "}
                <span className="marked [--mark-wash:var(--color-mark)]">test plans, test cases, execution and defect reports</span>.
              </p>
              <p className="text-sheet-soft">
                I didn&rsquo;t start in software. I studied Electronics and Communication Engineering, took an M.Tech in
                Signal Processing, and taught Electronics at EMS Memorial College of Applied Science for two years.
              </p>
              <p className="text-sheet-soft">
                In 2022 I moved into testing, through training at Infosys and ICT Academy and an internship at TCS, and
                joined Kiebot in 2023.
              </p>
              <p aria-hidden className="micro border-t border-sheet-ink/10 pt-3">
                {education.map((e) => `${e.degree}, ${e.field} · ${e.school} (${e.university}) · ${e.period} · ${e.grade}`).join("  ·  ")}
              </p>
              <p aria-hidden className="micro">
                {roles
                  .slice()
                  .reverse()
                  .map((r) => `${r.title}, ${r.org}, ${r.place} · ${r.period}`)
                  .join("  ·  ")}
              </p>
              <span aria-hidden className="micro-bug">
                <BugGlyph className="h-full w-full" />
              </span>
            </article>
          </Magnifier>
        </div>

        {/* Left: then → now */}
        <div className="flex items-center justify-center gap-3 max-sm:order-first sm:gap-6 xl:col-start-1 xl:row-start-1 xl:flex-col xl:gap-3">
          <figure className="sheet-paper w-36 -rotate-3 p-2 pb-3 sm:w-52 sm:p-2.5">
            <div className="grid h-24 place-items-center bg-board sm:h-32">
              <svg viewBox="0 0 120 60" className="w-24 text-on-board sm:w-32" aria-hidden>
                <path
                  d="M2 30h22l5-10 8 20 8-20 8 20 8-20 5 10h18M84 18v24M92 18v24M92 30h26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <figcaption className="annot mt-2.5 text-center">2013 · Electronics</figcaption>
          </figure>

          {/* Hand-drawn arrow between the two */}
          <svg viewBox="0 0 60 70" className="w-8 shrink-0 -rotate-90 sm:w-10 text-accent xl:w-12 xl:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M18 4c-14 18 22 30 14 58" />
            <path d="m22 54 10 9 8-12" />
          </svg>

          <figure className="sheet-paper w-36 rotate-2 p-2 pb-3 sm:w-52 sm:p-2.5">
            <div className="grid h-24 place-items-center bg-mark sm:h-32">
              <span className="font-display text-6xl text-on-mark">QA</span>
            </div>
            <figcaption className="annot mt-2.5 text-center">2023 · Software Tester</figcaption>
          </figure>
        </div>

        {/* Right: the facts, taped down, with the note pinned above */}
        <div className="flex flex-col items-center gap-8 xl:col-start-3 xl:row-start-1">
          <div className="note-paper relative w-52 rotate-2 px-5 pb-5 pt-7 shadow-xl max-sm:hidden">
            <Pin className="left-1/2 top-3" />
            <p className="font-display text-center text-4xl leading-none">Electronics → QA</p>
          </div>

          <div className="sheet-paper relative w-full max-w-[20rem] -rotate-1 p-4">
            {/* DEF-01: tape peeling off */}
            <Defect id="tape" className="defect-tape absolute -top-4 right-6 z-10 h-8 w-28">
              <Tape className="inset-0 h-full w-full" />
            </Defect>
            <dl
              data-spec="dl · title block"
              className="grid grid-cols-[5.5rem_1fr] border border-sheet-ink/15 text-sm [&>*:nth-last-child(-n+2)]:border-b-0"
            >
              {facts.map(([k, v]) => [
                <dt key={`${k}-t`} className="annot border-b border-r border-sheet-ink/15 bg-sheet-ink/[0.04] px-3 py-1.5 text-sheet-soft">
                  {k}
                </dt>,
                <dd key={`${k}-d`} className="border-b border-sheet-ink/15 px-3 py-1.5 font-medium">
                  {v}
                </dd>,
              ])}
            </dl>
            <p aria-hidden className="micro mt-2">
              {[...platforms, ...domains.map((d) => d.full)].join(" · ")}
            </p>
            <span aria-hidden className="stamp annot absolute -bottom-5 -right-3 bg-sheet/80 text-xl">
              Pass
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
