# Dijisha Dileep — QA portfolio

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · pnpm.

## Develop

```
pnpm install
pnpm dev
```

Checks before pushing: `pnpm lint`, `pnpm typecheck`, `pnpm build`. GitHub Actions runs the same three on every push to `main` and every pull request (`.github/workflows/ci.yml`). To build while `pnpm dev` is running, use `NEXT_DIST_DIR=.next-verify pnpm build` so the dev server's `.next` is left alone (then undo the include it adds to `tsconfig.json`).

## Content

All facts live in `src/content/` (profile, experience, skills, process). The resume PDF is `public/cv/Dijisha-Dileep-QA-Engineer-Resume.pdf`; replace it with the same name when the resume changes, and update `src/content` to match.

## Environment variables

| Name | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, share cards | e.g. `https://dijishadileep.com`. Falls back to Vercel's production domain. |
| `GEMINI_API_KEY` | Assistant | Server-only. The Ask button appears only when set at build time. |
| `GEMINI_MODEL` | Assistant (optional) | Overrides the default free-tier model. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Assistant rate limit (optional) | Shared daily limit; without them the limit is per server instance. |
| `WEB3FORMS_ACCESS_KEY` | Contact form (optional) | From web3forms.com. Shows the "Send a message" form in the contact panel; public by design. |

Copy `.env.example` to `.env.local` for local development. Never commit `.env*` files.

## Deploy (Vercel)

1. Import the repository in Vercel (framework: Next.js, package manager: pnpm).
2. Add the environment variables above.
3. After the first deploy: add the domain, set `NEXT_PUBLIC_SITE_URL`, redeploy, then submit `/sitemap.xml` in Google Search Console.
