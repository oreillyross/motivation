# Tasks

Current task only. When it's done, tick everything, archive it (see
`docs/archive/README.md`), then pull the next task in from `docs/roadmap.md`.

Completed tasks: `docs/archive/`.

---

## Task 3: Settings page (admin, password-gated)

> **Status: queued.** Don't start until Ross has reviewed and merged the Task 2 PR
> and gives the go-ahead. Steps below are a first cut; refine them (and record
> decisions) before coding.

**Goal:** from the browser, behind one password, I can edit the quotes and people
lists, run the Task 2 agent, and approve/reject/edit suggestions. Changes show on
the home page with no redeploy.

### Carried over from Task 2

- [ ] Spot-check the sources. The GitHub Action has already run live once (2026-10-09, 5 quotes added for
  Jordan B Peterson, commit `5aeb2c6`), so the agent works end to end in CI. Still open: check each quote's
  source page in the Actions log, and whether the first quotes suit the site (one was political).
- [ ] Confirm which path the live API accepts: structured output + web search, or the
  `save_quotes` fallback. Record it in the archive and here.
- [ ] Approve one real suggestion via `quotes:review` and confirm it shows after `pnpm build`.
- [ ] Ross picks a deploy host. Task 3 needs one that supports SSR (Vercel or Node-friendly
  Netlify/Cloudflare), so this now blocks.

### Steps (draft)

**1. Decisions first (update this file before coding)**
- [ ] Pick the SSR adapter from the chosen host.
- [ ] Pick the DB (Turso/libSQL + Drizzle per the roadmap) and the home page strategy:
  prerender at build vs. read from the DB at request time. "No redeploy needed" means
  the home page must read the DB (SSR or a client fetch).

**2. Server + auth**
- [ ] Add the adapter; only `/settings` and `/api/*` are server-rendered.
- [ ] `ADMIN_PASSWORD` + `SESSION_SECRET` in `.env.example`; login form sets a signed,
  httpOnly, SameSite cookie; constant-time password compare; logout.
- [ ] Gate every `/settings` and `/api/*` route.

**3. Storage**
- [ ] Drizzle schema: `quotes`, `people`, `suggestions`, `rejected`.
- [ ] Seed script from `quotes.txt` / `people.txt`; reuse `parseQuotes` / `parsePeople`.

**4. Settings UI (Paper Kite style)**
- [ ] Edit quotes list and people list.
- [ ] "Find new quotes" button runs the Task 2 agent server-side (extract the agent call
  from `scripts/suggest-quotes.ts` into `src/lib`, shared by CLI and route).
- [ ] Review suggestions: approve / reject / edit.

**5. Verify**
- [ ] `pnpm test`, `pnpm check`, `pnpm build` green; style guide acceptance checks on `/settings`.
- [ ] Login works, wrong password rejected, unauthenticated API calls get 401.
- [ ] End to end: add a person, run the agent, approve, see it on `/` without a redeploy.

### Out of scope

Multi-user accounts, OAuth, per-user data (Task 4); scheduled agent runs.
