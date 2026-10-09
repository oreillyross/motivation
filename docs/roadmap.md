# Roadmap

Four tasks, in order. Each ships something usable. The active task is expanded
step-by-step in `docs/tasks.md`; the rest stay at this level until they're next.
Completed tasks are archived in `docs/archive/`.

---

## Task 1 — Quotes on the home page (MVP V1) · **done 2026-10-08**

Archived: [`docs/archive/2026-10-08-task1-quotes-home-page.md`](archive/2026-10-08-task1-quotes-home-page.md).

Scaffold Astro + Tailwind v4 with the Paper Kite style and show a motivational
quote from a static list on `/`.

- Static file `src/data/quotes.txt`, quotes separated by **newline or tab**;
  optional author via `Quote text — Author`.
- Parser in `src/lib/quotes.ts` (+ tests); pick a quote, "another one" shuffle.
- Base layout, nav wordmark, hero kite, divider, quote card, light/dark.
- Static deploy (`dist/` ready; host choice carried into Task 2).

**Done when:** `pnpm build` is green, the home page shows a quote from the
pasted list, and the style guide acceptance checks pass.

---

## Task 2 — Agent-suggested quotes from people I follow · **done 2026-10-09**

Archived: [`docs/archive/2026-10-09-task2-agent-suggested-quotes.md`](archive/2026-10-09-task2-agent-suggested-quotes.md). Live-API checks carried into Task 3.

- Static file `src/data/people.txt` — one person per line (e.g. Tim Ferriss,
  Derek Sivers), editable over time.
- `pnpm quotes:suggest` script: for each person, call the Claude API with the
  web search tool to find real, attributable quotes; return structured JSON
  (`text`, `author`, `sourceUrl`).
- Write results to `src/data/suggestions.json` (pending review) — never straight
  into the live list. De-duplicate against existing quotes.
- Simple review step (CLI prompt or a manual edit) to promote suggestions into
  `quotes.txt`.
- Env: `ANTHROPIC_API_KEY`.

**Done when:** running the script for the people list produces sourced,
de-duplicated suggestions that I can approve into the live list.

---

## Task 3 — Settings page (admin, password-gated) · **next (queued in `docs/tasks.md`)**

Overlaps Task 2: move the agent run and list editing into the browser.

- Add an SSR adapter (e.g. Vercel or Node) — only `/settings` and its API routes
  are server-rendered; the home page stays static/prerendered.
- `/settings` gated by a single env password (`ADMIN_PASSWORD`) → signed,
  httpOnly session cookie. V1 only; replaced in Task 4.
- Edit the quotes list and people list in the browser.
- "Find new quotes" button runs the Task 2 agent server-side; review each
  suggestion (approve / reject / edit) before it goes live.
- Storage moves from files to a small DB (e.g. Turso/libSQL + Drizzle), since
  serverless can't write files. Seed it from `quotes.txt` / `people.txt`.

**Done when:** I can log in with the password, edit both lists, run the agent,
approve suggestions, and see them on the home page — no redeploy needed.

---

## Task 4 — Multi-user accounts (lifestyle app)

- **Better Auth** with Google, Apple, and email/password sign-in.
- Data model goes per-user: each user has their own people list, quotes and
  suggestions. My existing data migrates to my account.
- Replace the env-password gate with real sessions; admin becomes a role.
- Public landing page for signed-out visitors; signed-in home shows *their* quote.
- Basics: sign up, sign in, sign out, delete account.

**Done when:** a new user can sign up with any of the three methods, add people,
get suggested quotes, and see their own daily quote — isolated from other users.

---

## Later (unscheduled ideas)

Daily quote email, favourites, share-as-image using the social card, scheduled
agent runs, PWA/home-screen install.
