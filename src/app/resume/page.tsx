import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "@/components/icons";
import { education, roles } from "@/content/experience";
import { mailHref, profile, siteUrl, telHref } from "@/content/profile";
import { domains, skillGroups } from "@/content/skills";
import { breadcrumbs, ld, personId } from "@/lib/seo";

const description = `Resume of ${profile.name}, ${profile.role} in ${profile.city}: work history at Kiebot, TCS, ICT Academy and Infosys, testing skills, tools and education.`;

export const metadata: Metadata = {
  title: `Resume, ${profile.role}`,
  description,
  alternates: { canonical: "/resume" },
  openGraph: { url: "/resume", title: `${profile.name}: Resume`, description },
};

const pageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/resume`,
  url: `${siteUrl}/resume`,
  name: `${profile.name}: Resume`,
  description,
  about: { "@id": personId },
};

export default function ResumePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 print:max-w-none print:p-0">
      <nav aria-label="Breadcrumb" className="no-print annot text-ink-soft">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            Resume
          </li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-8">
        <div>
          <h1>
            <span className="font-display block text-[clamp(3rem,9vw,5.5rem)]">{profile.name}</span>
            <span className="mt-3 block text-xl font-medium tracking-tight">{profile.role}</span>
          </h1>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
            <a href={mailHref} className="hover:text-ink">
              {profile.email}
            </a>
            <a href={telHref} className="hover:text-ink">
              {profile.phone.display}
            </a>
            <span>
              {profile.city}, {profile.region}
            </span>
            {profile.linkedin && (
              <a href={profile.linkedin} rel="me" className="hover:text-ink">
                LinkedIn
              </a>
            )}
          </p>
        </div>
        <a
          href={profile.cv}
          download
          className="no-print inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-paper transition-colors hover:bg-accent hover:text-on-accent"
        >
          <Download className="size-4" />
          Download PDF
        </a>
      </header>

      <section aria-labelledby="r-summary" className="grid gap-3 border-b hairline py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="r-summary" className="annot pt-1 text-accent">
          Summary
        </h2>
        <p className="text-lg leading-relaxed">{profile.summary}</p>
      </section>

      <section aria-labelledby="r-experience" className="grid gap-3 border-b hairline py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="r-experience" className="annot pt-1 text-accent">
          Experience
        </h2>
        <div className="space-y-8">
          {roles.map((r) => (
            <div key={r.id} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-lg font-semibold">
                  {r.title} <span className="font-normal text-ink-soft">· {r.org}, {r.place}</span>
                </h3>
                <p className="annot text-ink-soft">{r.period}</p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft marker:text-accent">
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="r-skills" className="grid gap-3 border-b hairline py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="r-skills" className="annot pt-1 text-accent">
          Skills
        </h2>
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[11rem_1fr]">
          {skillGroups.map((g) => [
            <dt key={`${g.id}-t`} className="font-semibold">
              {g.label}
            </dt>,
            <dd key={`${g.id}-d`} className="text-ink-soft">
              {g.items.map((i) => i.name).join(", ")}
            </dd>,
          ])}
          <dt className="font-semibold">Domain knowledge</dt>
          <dd className="text-ink-soft">{domains.map((d) => d.full).join(", ")}</dd>
        </dl>
      </section>

      <section aria-labelledby="r-education" className="grid gap-3 py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="r-education" className="annot pt-1 text-accent">
          Education
        </h2>
        <div className="space-y-5">
          {education.map((e) => (
            <div key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {e.degree}, {e.field}
                </h3>
                <p className="text-ink-soft">
                  {e.school} ({e.university}) · {e.grade}
                </p>
              </div>
              <p className="annot text-ink-soft">{e.period}</p>
            </div>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={ld(pageLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(
          breadcrumbs([
            { name: profile.name, path: "/" },
            { name: "Resume", path: "/resume" },
          ]),
        )}
      />
    </article>
  );
}
