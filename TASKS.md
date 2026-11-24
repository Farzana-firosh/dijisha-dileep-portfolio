# Tasks

## Waiting on content

- [x] Real portrait added (`public/portrait/dij-img.jpeg`). Still to do: use it on the share image too, and consider a WebP copy.

- [x] LinkedIn URL → `profile.linkedin` in `src/content/profile.ts` (adds the LinkedIn links and `sameAs` in structured data).
- [ ] Dijisha to confirm pronouns (copy is first person for now; the assistant uses her name).
- [ ] Dijisha to read the site copy written in her voice (About, How I test) and approve or edit.
- [ ] Project details, if wanted: what was tested, her role, tools, and whether the client can be named. A Projects section can follow.
- [ ] "3+ years" is fixed text (set by the user, Nov 2026; the resume PDF still says 2.7+). Update the PDF to match.

## Before launch

- [ ] Custom domain → set `NEXT_PUBLIC_SITE_URL` in Vercel.
- [ ] Submit `/sitemap.xml` in Google Search Console; check structured data in the Rich Results Test.
- [ ] Set `GEMINI_API_KEY` (and optionally Upstash Redis) in Vercel to switch the assistant on.
- [x] Next.js upgraded 16.4.2 → 16.4.6 (security advisory).
- [ ] Optional: `WEB3FORMS_ACCESS_KEY` (web3forms.com) to switch on the "Send a message" form in the contact panel.

## Done

- [x] Home page: hero with lens + live page check, About (signal figure), How I test (STLC + defect lifecycle), Toolkit, Experience, Contact.
- [x] `/resume` HTML resume + PDF download.
- [x] SEO: metadata, canonicals, ProfilePage/Person/WebSite/Breadcrumb JSON-LD, OG image, sitemap, robots, manifest, icons.
- [x] Assistant route + panel (hidden until `GEMINI_API_KEY` is set).
