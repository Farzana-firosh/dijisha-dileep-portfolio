import Image from "next/image";
import { BinderClip, BugGlyph, Tape } from "@/components/board-bits";
import { Defect } from "@/components/defects";
import { Magnifier } from "@/components/magnifier";
import { education, roles } from "@/content/experience";
import { profile } from "@/content/profile";

/** About, in two columns that fit one screen on wide displays: a wire grid board on the left (then → now photos
 *  pegged on, a clipped note, an ID card in its holder hanging from a lanyard), the story under the magnifier on the
 *  right. The magnifier's tiny print repeats facts from elsewhere, and its bug only shows through the glass. */
export function About() {
  const facts = [
    ["Based in", `${profile.city}, ${profile.region}`],
    ["In QA", profile.experience],
    ["Now", `${profile.currentRole.company}, since ${profile.currentRole.since}`],
    ["Education", `${education[0].degree}, ${education[0].field}`],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="turn-under wrap overflow-x-clip pb-24 pt-16 sm:pb-28 sm:pt-20 xl:pt-12">
      <header className="mx-auto max-w-5xl text-center">
        <p className="annot text-lg text-accent">01 · About</p>
        <h2 id="about-title" data-spec="h2" className="font-display mt-3 text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] text-balance xl:mt-1 xl:text-[4.4rem]">
          From electronics to <span className="marked [--mark-wash:var(--color-mark)] px-1">software testing</span>
        </h2>
      </header>

      <div className="mx-auto mt-12 grid max-w-[88rem] items-center gap-x-24 gap-y-14 sm:mt-14 xl:mt-10 xl:grid-cols-[auto_minmax(0,46rem)] xl:justify-center">
        {/* Left: the wire grid board, screwed to the wall */}
        <div data-spec="div · board" className="wire-board mx-auto grid w-full max-w-[36rem] gap-x-12 gap-y-10 px-5 pb-8 pt-11 sm:grid-cols-[11rem_16rem] sm:justify-center sm:px-8">
          {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map((p) => (
            <span key={p} aria-hidden className={`wire-mount ${p}`} />
          ))}

          {/* Then → now, pegged on; the note clipped underneath */}
          <div className="flex items-start justify-center gap-2 sm:flex-col sm:items-center sm:gap-3">
            <figure className="polaroid hang relative w-32 sm:w-36" style={{ "--r": "-3deg", "--sway": "5.5s" } as React.CSSProperties}>
              <span aria-hidden className="peg" />
              <div className="polaroid-shot grid h-20 place-items-center bg-board">
                <svg viewBox="0 0 120 60" className="w-20 text-on-board" aria-hidden>
                  <path
                    d="M2 30h22l5-10 8 20 8-20 8 20 8-20 5 10h18M84 18v24M92 18v24M92 30h26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <figcaption className="annot mt-1.5 text-center text-sm text-sheet-ink">2013 · Electronics</figcaption>
            </figure>

            {/* Hand-drawn arrow between the two */}
            <svg viewBox="0 0 60 70" className="mt-9 w-8 shrink-0 -rotate-90 text-accent sm:mt-0 sm:w-9 sm:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M18 4c-14 18 22 30 14 58" />
              <path d="m22 54 10 9 8-12" />
            </svg>

            <figure className="polaroid relative w-32 rotate-2 sm:w-36">
              {/* DEF-01: tape peeling off */}
              <Defect id="tape" className="defect-tape absolute -top-3.5 left-[calc(50%-2.75rem)] z-10 h-7 w-22">
                <Tape className="inset-0 h-full w-full" />
              </Defect>
              <div className="polaroid-shot grid h-20 place-items-center bg-mark">
                <span className="font-display text-5xl text-on-mark">QA</span>
              </div>
              <figcaption className="annot mt-1.5 text-center text-sm text-sheet-ink">2023 · Tester</figcaption>
            </figure>

            <div className="relative mt-7 w-36 -rotate-3 max-sm:hidden">
              <BinderClip className="absolute -top-6 left-1/2 z-10 w-11 -translate-x-1/2" />
              <div className="note-paper px-3 pb-3 pt-5 shadow-lg">
                <p className="font-display text-center text-2xl leading-none">Electronics → QA</p>
              </div>
            </div>
          </div>

          {/* The ID card in a clear holder, on a lanyard hooked over the top wire */}
          <div className="flex justify-center">
            <div className="hang relative -mt-11 w-64 pt-[7.4rem]" style={{ "--r": "1deg", "--sway": "6.5s", "--delay": "-2s" } as React.CSSProperties}>
              <svg aria-hidden viewBox="0 0 48 120" className="absolute left-1/2 top-0 h-[7.5rem] w-12 -translate-x-1/2 overflow-visible" fill="none">
                <defs>
                  {/* Ribbon: darker at the edges, so each strand reads as a flat woven strap */}
                  <linearGradient id="lanyard-strand" x1="0" x2="1">
                    <stop offset="0" stopColor="#1a2fa8" />
                    <stop offset="0.25" stopColor="var(--color-board)" />
                    <stop offset="0.75" stopColor="var(--color-board)" />
                    <stop offset="1" stopColor="#172a96" />
                  </linearGradient>
                  <linearGradient id="lanyard-metal" x1="0" x2="1">
                    <stop offset="0" stopColor="#7d838c" />
                    <stop offset="0.45" stopColor="#f1f3f5" />
                    <stop offset="1" stopColor="#6f757e" />
                  </linearGradient>
                </defs>
                {/* S-hook over the top wire */}
                <path d="M24 13c-6 0-6-9 0-9s6 9 0 9" stroke="url(#lanyard-metal)" strokeWidth="2.4" strokeLinecap="round" />
                {/* The ribbon folded over the hook: two strands side by side, drawing together towards the clip */}
                <path d="M12.5 20q11.5-11 23 0" stroke="#1a2fa8" strokeWidth="5" />
                <path d="M12 19h10.5l1.5 63h-7z" fill="url(#lanyard-strand)" />
                <path d="M25.5 19H36l-5 63h-7z" fill="url(#lanyard-strand)" />
                <g fill="rgb(255 255 255 / 0.78)" fontSize="4.6" fontWeight="700" letterSpacing="1.2">
                  <text transform="translate(19 26) rotate(90)">QA · TESTER</text>
                  <text transform="translate(32.6 26) rotate(90)">QA · TESTER</text>
                </g>
                {/* Crimped metal end, D-ring, lobster clasp, clear strap through the holder's slot */}
                <path d="M16 80h16l-3 8h-10z" fill="url(#lanyard-metal)" stroke="#5f656e" strokeWidth="0.5" />
                <circle cx="24" cy="92" r="4" stroke="url(#lanyard-metal)" strokeWidth="2.2" />
                <path d="M21 96h6q2 0 2 3v7q0 4-5 4t-5-4v-7q0-3 2-3z" fill="url(#lanyard-metal)" stroke="#5f656e" strokeWidth="0.6" />
                <path d="M24 99v6" stroke="#5f656e" strokeWidth="0.8" />
                <rect x="20" y="108" width="8" height="14" rx="2" fill="rgb(255 255 255 / 0.55)" stroke="rgb(0 0 0 / 0.2)" strokeWidth="0.6" />
              </svg>

              <div className="idcard-holder">
                <div data-spec="div · id card" className="idcard">
                  <div className="relative flex items-end justify-between bg-board px-4 pb-2.5 pt-5 text-on-board">
                    <span className="font-display text-2xl leading-none">QA</span>
                    <span className="annot text-xs text-on-board/80">Software Testing</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 pt-3.5">
                    <Image
                      src={profile.portrait.src}
                      alt=""
                      width={profile.portrait.width}
                      height={profile.portrait.height}
                      sizes="6rem"
                      className="h-[5.5rem] w-[4.5rem] shrink-0 rounded-sm object-cover object-[50%_22%] ring-1 ring-sheet-ink/15"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-[1.65rem] leading-[0.95]">{profile.name}</p>
                      <p className="annot mt-1.5 text-[0.8rem] leading-snug text-sheet-soft">{profile.role}</p>
                    </div>
                  </div>
                  <dl className="mx-4 mt-3 grid grid-cols-[4.4rem_minmax(0,1fr)] gap-x-2 gap-y-1 border-t border-sheet-ink/10 pt-2.5 text-[0.8rem] leading-snug">
                    {facts.map(([k, v]) => [
                      <dt key={`${k}-t`} className="annot text-sheet-soft">
                        {k}
                      </dt>,
                      <dd key={`${k}-d`} className="font-medium">
                        {v}
                      </dd>,
                    ])}
                  </dl>
                  <div className="mx-4 mb-3.5 mt-3 flex items-center justify-between">
                    <span aria-hidden className="idcard-code h-6" />
                    <span aria-hidden className="idcard-holo" />
                  </div>
                  <span aria-hidden className="stamp annot absolute bottom-3 right-10 bg-sheet/70 text-base">
                    Pass
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: the story under the magnifier */}
        <div className="crumple-in crumple-sq relative z-10 mx-auto w-full max-w-[46rem]">
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
                In 2022 I worked at Infosys as a System Engineer Trainee for six months, then moved into testing with
                training at ICT Academy and an internship at TCS. I joined Kiebot in 2023.
              </p>
              <p aria-hidden className="micro border-t border-sheet-ink/10 pt-3">
                {education.map((e) => `${e.degree}, ${e.field} · ${e.school} (${e.university}) · ${e.period} · ${e.grade}`).join("  ·  ")}
              </p>
              <p aria-hidden className="micro">
                {roles.map((r) => `${r.title}, ${r.org}, ${r.place} · ${r.period}`).join("  ·  ")}
              </p>
              <span aria-hidden className="micro-bug">
                <BugGlyph className="h-full w-full" />
              </span>
            </article>
          </Magnifier>
        </div>
      </div>
    </section>
  );
}
