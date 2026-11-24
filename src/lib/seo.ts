import { education, roles } from "@/content/experience";
import { profile, siteUrl } from "@/content/profile";
import { allSkills } from "@/content/skills";

/** schema.org structured data. Only facts that are also visible on the page. */

export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;

const current = roles.find((r) => r.current)!;

export const person = {
  "@type": "Person",
  "@id": personId,
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.name.split(" ").slice(1).join(" "),
  jobTitle: profile.role,
  description: profile.summary,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  telephone: profile.phone.e164,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.city,
    addressRegion: profile.region,
    addressCountry: profile.countryCode,
  },
  worksFor: { "@type": "Organization", name: current.org },
  hasOccupation: {
    "@type": "Occupation",
    name: current.title,
    occupationLocation: { "@type": "City", name: profile.city },
    skills: allSkills.join(", "),
  },
  alumniOf: [...new Set(education.map((e) => e.school))].map((name) => ({ "@type": "CollegeOrUniversity", name })),
  knowsAbout: allSkills,
  ...(profile.linkedin ? { sameAs: [profile.linkedin] } : {}),
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  url: siteUrl,
  name: profile.name,
  inLanguage: "en",
  publisher: { "@id": personId },
};

/** Home page: Google's recommended type for a page about one person. */
export const profilePage = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/#profile`,
  url: siteUrl,
  name: `${profile.name}, ${profile.role}`,
  isPartOf: { "@id": websiteId },
  mainEntity: person,
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

/** Serialises for a <script type="application/ld+json">, escaping "<" so content can't close the tag. */
export const ld = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
