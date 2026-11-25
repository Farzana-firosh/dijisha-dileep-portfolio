# Dijisha Dileep — portfolio

Portfolio for a Software Tester / QA Engineer (Bangalore). Static Next.js site with one API route (the assistant). Coding standards follow `D:\farzana-portfolio`; its design does not apply here. Open items live in `TASKS.md`; setup and deployment in `README.md`.

## Stack

Next.js 16 (App Router, `cacheComponents`) · React 19 · TypeScript strict · Tailwind CSS v4 via `@tailwindcss/postcss` · pnpm only. Version-specific APIs must be checked against `node_modules/next/dist/docs/` before use.

Dependencies beyond Next/React: `simple-icons` (Selenium, Postman, Git, GitLab logos only) and `lucide-react` (interface icons, at the user's request), `@vercel/analytics` (visitor and page-view counts, `<Analytics />` in the root layout; enable Web Analytics in the Vercel project). No animation, 3D or smooth-scroll libraries: motion is CSS (scroll-driven `animation-timeline: view()`, transitions) plus small client components. Add a dependency only with a stated reason.

## Structure

- `src/content/` — every fact on the site, typed. Source of truth is the resume PDF in `public/cv/`.
- `src/app/_sections/` — home page sections (used once). `src/app/resume/` — HTML resume page.
- `src/components/` — reused UI and Client Components. `shared.ts` holds constants Server Components need from client files.
- `src/lib/seo.ts` — schema.org JSON-LD (ProfilePage → Person, WebSite, BreadcrumbList).
- `src/app/api/ask/route.ts` — Gemini assistant (REST, no SDK, key server-only, per-IP daily limit; Upstash Redis when configured, else memory).

## Design: "Inspection Layer"

Cool drafting paper with a 40px grid, graphite ink, ultramarine (`accent`) for annotations/redlines, highlighter lime (`mark`) as backgrounds only. Type: Instrument Sans (body; display at `wdth` 75 via `font-display`), Shantell Sans as a marker-pen hand for notes and labels (`annot`), VT323 pixel type for the CRT and the test report (`pixel`). No small monospace caps labels: the user reads them as AI-generated. Tokens in `globals.css`, redefined for dark mode; `night`/`chalk` stay fixed (Contact section). Use token classes, never raw hex in components. Theme: `ThemeCord`, a pull cord hanging from the header (tap, or drag the knob down; no header button), stores `theme` in localStorage; `themeScript` sets `data-theme` on `<html>` before paint; dark tokens apply under `[data-theme="dark"]` or the OS setting when nothing is stored. Cursor: native SVG cursors in `globals.css` (lime arrow; click-burst arrow on clickable things), plus `ClickPing` rings; fine pointers only. A reading-progress line under the header runs on a CSS scroll timeline.

Page order: Intro → Hero → About → Skills → How I test → Experience → Defect lifecycle (+ page check) → Contact footer.

Contact (modelled on the reference repo's contact, at the user's request): `SiteFooter` is the contact band on every page (big "Let's talk" plus an outlined copy, the DEF-05 rule, email/phone with copy buttons, buttons, bottom bar with links and back to top). `ContactPanel` is a chat-style native popover (message form via Web3Forms once `WEB3FORMS_ACCESS_KEY` is set; Ask tab via `AskChat` once `GEMINI_API_KEY` is set; email/WhatsApp/resume always), opened by the floating `ChatLauncher`, the footer and the header's Ask (`data-contact-tab="ask"`). WhatsApp links use `whatsappHref`.

Media: originals (AI video, source images) live in git-ignored `source-assets/`; the site serves small derived files. Experience shows Dijisha at her desk as a transparent WebP (`public/experience/desk.webp`, 73 KB, background cut out from `source-assets/dij-ed.jpeg`), beside the folder from `xl`; its cut-off right and floor edges fade out (`.feather-edge`). Icons: lucide (`lucide-react`) through `components/icons.tsx`; brand logos stay custom/simple-icons. Only redesign the part the user names; keep the rest.

Signature pieces:
- **Intro** (`Intro`, home only): dark glass folder (the only glass on the site; back panel and tab drawn as one SVG, loose sheets inside, typed documents with a paper clip, a light sweep over the front, a floor shadow) with a bug eating its edge; tapping it (DEF-00) opens the folder, the files fly out and the light page shows. Decided before paint by `introScript` in the root layout: once per session, not with reduced motion, data saver or crawler UAs; `/?intro=1` forces it. Skip button, Esc, auto-advance; the head script removes it after 14s even if JS fails. The page is always rendered underneath.
- **Hero**: a rubber stamp ("Now testing at Kiebot, Bangalore"; no pill badges), the name on one line sized to the left column and "selected" like a design-tool element (`.name-frame`: frame, handles, `h1` tag, all CSS so it stays out of the heading text), facts as checkboxes that tick in (`.tick-box`), the CRT beside it.
- **Hero → About** (`PageCurl`, `.turn-book` / `.turn-page` / `.turn-under`, html[data-curl] from `curlScript`): wherever the hero fits one screen (`CURL_MEDIA`), it is a sticky page that curls over during the first 85svh of scroll, revealing About underneath: sideways like a book page on wide screens, up like a notepad page on narrow ones. Below `lg` the computer is a faded backdrop behind the hero text so the hero fits. `scroll-margin-top` on About keeps `/#about` landing after the turn.
- **Hero computer** (`Crt`): the portrait (`profile.portrait`, a placeholder until the real one arrives) on an old beige CRT with sticky notes. CSS loop: a bug crawls on, the picture glitches into a `defect_found.exe` error, "Retest passed", back to normal. Static with reduced motion. Keyframes that fade use `visibility` too (keeps hidden boxes inert; opacity-only animations don't show in headless screenshots).
- **About**: two columns that fit one screen on wide displays. Left, a black wire grid memo board (`.wire-board`, steel in dark mode, wall mounts, shadow of the grid): then → now polaroids (one on a wooden `.peg`, one taped: DEF-01), the clipped "Electronics → QA" note, and an ID card in a clear holder (`.idcard-holder`) hanging from a lanyard with the portrait and the facts. Right, the story on a sheet under a large `Magnifier` (follows the mouse, draggable; enlarged view is a runtime clone so text is in the HTML once). `.micro` print and `.micro-bug` show only through the glass; micro print only repeats facts shown elsewhere. No hint copy.
- **Evidence board** (Skills): yellow "Testing & QA" note in the centre (binder clip, curling corner `.curl`), present from the start; cards pinned around it, all swaying from their pins (`.hang`, origin = pin so strings stay attached). `PinOnView` plays the entrance once well in view: each card (`.pin-in`, turn `--i`) glides in from its side, its pin pushes in, then its own thread draws (`BoardStrings`, positions from layout offsets so transforms don't matter). Leaving (scroll-linked, `--board` view timeline): cards fly off (`.fly`), threads fade; the note is held on screen while a bug (`.crumple-bug`) walks on and crumples it into a paper ball (`.fly-note`: clip-path morph + crease overlay), the ball drops and the bug walks on down into How I test; the section is `z-10` so they pass over the dark stage.
- **Crumpled sheets** (`.crumple-in`, `.crumple-sq`): the About story and the lifecycle sheet arrive as a crumpled paper ball and unfold as they scroll in, on every screen size (scroll-linked; ball size/place from `--cy/--rx/--ry`, so it stays round on wide, square and tall sheets).
- **How I test** (`StepDrum`): one dark section throughout. The six STLC steps as a vertical 3D stack of cards that rolls with scroll (sticky below the header) and rests on each card; neighbours dimmed; big step number/title left (slides in on change), step list right (click to jump). No `preserve-3d` (cards would intersect). A step's line drawing can be replaced by `image` in `content/process.ts`. Separately (after Experience), on a white sheet on the paper background, `DefectLifecycle` (from `lg`: a light disc with title, status and controls, the seven main states as cards orbiting its edge, the wheel turns the current one to the front; a branch stamps the card it leaves from; below `lg` a card grid) and the page-check printout (`.receipt`).
- **Experience** (`CareerStack`, `lg`+ with motion): heading and timeline rail on the left of the sticky stage, the violet folder on the right, so there's no gap between heading and files; one paper file per stage (each role, then education, latest first) with a staggered index tab; files rise out in turn and rest so they can be read, clipped under the folder; the left side is the folder's taped "Index" sheet (Education / Work, open file highlighted, click to jump).
- Scroll scenes share `useScrollScene` (`scroll-scene.ts`): eased towards the scroll position every frame (no jumps on wheel steps), with a rest on each item. They render a plain list in the HTML and switch to the live scene after hydration only with motion allowed.
- **Physical props** (`board-bits.tsx`, `.sheet-paper`, `.note-paper`, `.tape`, `.pin`) use fixed `sheet*`/`note`/`board`/`yarn` tokens in both themes.
- **Inspect mode** (`InspectToggle`, `data-inspect` on `<html>`): outlines every `[data-spec]` element with its label.
- **Page check** (`PageCheck`, on the board as a test report): real checks run against the page in the browser. Results and timings are measured; a failure must show as a failure.
- **Planted defects** (`defects.tsx`): five deliberate bugs (peeling tape, report typo, card missing its pin, crooked folder label, short rule). Clicking reports/fixes; the header tracker lists them for keyboard users. Each defect's open/fixed look is CSS on `.defect-<id>[data-state]`.
- **Defect lifecycle** (`DefectLifecycle`): standard states with a "Play" walkthrough.

## SEO (high priority)

- Every page static and fully server-rendered; content never depends on JS.
- One `h1` per page; headings never skip levels; popovers use no headings before the `h1`.
- Per-page `alternates.canonical`; site URL from `siteUrl` (`NEXT_PUBLIC_SITE_URL` → Vercel production domain → localhost).
- JSON-LD only states facts visible on the page. `sameAs` appears once `profile.linkedin` is set.
- Meta description 50–160 chars (the page check verifies it).

## Content accuracy (non-negotiable)

- Only facts from the resume. No invented projects, clients, metrics, tool names (no bug-tracker brand: the resume says "bug tracking tools"), certifications or testimonials.
- Selenium with Java was learned in training; don't present it as Java development experience. Playwright (JavaScript) comes from Dijisha's own summary (given by the user); it is not tied to a specific role.
- Dijisha's pronouns are unconfirmed: site copy is first person; the assistant uses her name.

## Conventions

- Server Components by default; `"use client"` only for interaction.
- Respect `prefers-reduced-motion`; overlays use native `popover`. Touch targets ≥ 44px; visible `:focus-visible`; AA contrast.
- Comments short, only for non-obvious reasons.

## Commands

```
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

Run lint, typecheck and build before calling work done. Never commit, push or switch branches without explicit approval.
