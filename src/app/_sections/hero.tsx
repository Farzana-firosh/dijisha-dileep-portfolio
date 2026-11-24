import Link from "next/link";
import { Crt } from "@/components/crt";
import { ArrowDown, ArrowUpRight } from "@/components/icons";
import { profile } from "@/content/profile";

export function Hero() {
  const facts = [`${profile.experience} in QA`, "Web · Mobile · API", "Agile Scrum"];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-x-clip">
      <div className="wrap grid w-full items-center gap-14 pb-16 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-12 lg:py-10">
        <div className="min-w-0">
          {/* Rubber stamp, inked slightly unevenly */}
          <p data-spec="p · stamp" className="ink-stamp">
            <span className="block text-[0.7rem] tracking-[0.3em]">Now testing at</span>
            <span className="block text-xl leading-tight">
              {profile.currentRole.company}, {profile.city}
            </span>
          </p>

          <h1 id="hero-title" data-spec="h1" className="mt-9">
            {/* Selected like an element in a design tool: frame, handles, tag (all CSS, so not in the heading text) */}
            <span className="name-frame font-display inline-block whitespace-nowrap text-[clamp(2.8rem,11vw,7rem)] leading-[0.92] lg:text-[min(9.5rem,calc((100vw-37rem)*0.2))]">
              Dijisha Dileep
            </span>
            <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(1.3rem,2.4vw,2rem)] font-medium tracking-tight">
              <span className="bg-mark px-2 text-on-mark">Software Tester</span>
              <span aria-hidden className="text-ink-soft">/</span>
              <span>QA Engineer</span>
            </span>
          </h1>

          <p data-spec="p · lead" className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            I test web and mobile applications: end-to-end manual testing, automation with{" "}
            <span className="text-ink">Selenium WebDriver</span>, and API testing in{" "}
            <span className="text-ink">Postman</span>, in Agile Scrum teams.
          </p>

          {/* Checked off one by one on load */}
          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            {facts.map((f, i) => (
              <li key={f} className="flex items-center gap-2.5 text-lg font-medium">
                <span aria-hidden className="tick-box" style={{ "--i": i } as React.CSSProperties}>
                  <svg viewBox="0 0 20 20" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4.5 10.5 3.5 3.5 7.5-8" pathLength={1} />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-paper transition-colors hover:bg-accent hover:text-on-accent"
            >
              Get in touch
              <ArrowDown className="size-4" />
            </a>
            <Link
              href="/resume"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-ink px-6 font-medium transition-colors hover:bg-ink hover:text-paper"
            >
              Resume
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Beside the text on wide screens; on smaller ones a faded backdrop behind it, so the hero fits one screen */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 opacity-30 lg:pointer-events-auto lg:static lg:z-auto lg:translate-y-0 lg:opacity-100">
          <Crt photo={profile.portrait} />
        </div>
      </div>
    </section>
  );
}
