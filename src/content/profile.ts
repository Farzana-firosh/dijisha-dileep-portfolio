/** Everything here comes from Dijisha's resume (public/cv). Don't add claims the resume doesn't make. */

/** Production URL for canonicals, sitemap and share cards. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
 *  on Vercel it otherwise falls back to the project's production domain. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const profile = {
  name: "Dijisha Dileep",
  firstName: "Dijisha",
  role: "Software Tester / QA Engineer",
  /** Wording from the resume summary; update the resume and this together. */
  experience: "3+ years",
  city: "Bangalore",
  region: "Karnataka",
  country: "India",
  countryCode: "IN",
  email: "dijishadileep@gmail.com",
  /** Display form and E.164 form of the same number. */
  phone: { display: "+91 85471 71712", e164: "+918547171712" },
  /** Public LinkedIn URL. The LinkedIn link and `sameAs` in structured data appear once this is set. */
  linkedin: "" as string,
  cv: "/cv/Dijisha-Dileep-QA-Engineer-Resume.pdf",
  /** Hero photo, shown on the CRT screen (4:3, cropped from the centre). */
  portrait: {
    src: "/portrait/dij-img.jpeg",
    alt: "Portrait of Dijisha Dileep",
    width: 1376,
    height: 768,
  },
  currentRole: { title: "Software Tester", company: "Kiebot", since: "2023" },
  summary:
    "Software QA engineer with 3+ years of experience. I test web and mobile applications through end-to-end manual testing, automation testing using Selenium WebDriver and Playwright, and API testing with Postman. I also have experience working in Agile Scrum environments, ensuring software quality through effective test planning, execution and defect tracking.",
  /** Search description: name, role, place and the main skills, under 160 characters. */
  seoDescription:
    "Dijisha Dileep, QA engineer in Bangalore: manual and automation testing with Selenium WebDriver and Playwright, API testing with Postman, Agile Scrum.",
  ask: {
    dailyLimit: 6,
  },
};

export const telHref = `tel:${profile.phone.e164}`;
export const mailHref = `mailto:${profile.email}`;
/** WhatsApp chat with the same number (wa.me takes digits only). */
export const whatsappHref = `https://wa.me/${profile.phone.e164.replace(/\D/g, "")}`;
