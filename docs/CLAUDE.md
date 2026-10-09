# CLAUDE.md — Paper Kite (daily motivation)

Personal webpage that shows a motivational quote on the home page. Built
iteratively, spec-first: read the docs below before changing anything.

## Read first

| Doc | What it's for |
|---|---|
| `docs/vision.md` | Why this exists, who it's for, what "done" looks like |
| `docs/roadmap.md` | The ordered milestones (Task 1 → Task 4) |
| `docs/tasks.md` | The **current** task, broken into checkable steps — work from here |
| `docs/archive/` | Completed tasks: frozen plan + what shipped + decisions + verification, one file per task |
| `docs/style_guide.md` | Paper Kite visual spec. Source of truth for colors, type, shapes, SVG rules, states and acceptance checks |

## Working rules

- **One task at a time.** Only build what `docs/tasks.md` asks for. Don't pull
  future roadmap work forward (no auth, DB, admin or LLM code until its task).
- **Spec before code.** If a task is ambiguous, update `docs/tasks.md` with the
  decision first, then implement.
- **Tick boxes as you go** in `docs/tasks.md`. When a task is done, archive it
  (`docs/archive/README.md` has the steps), mark it done in `docs/roadmap.md`,
  then move the next one in. The next task starts only after its PR is approved.
- **Style guide is law.** Use only tokens from `src/styles/global.css` (never raw
  hex in components), Caveat only for h1/h2, no uppercase, hard shadows only,
  respect `prefers-reduced-motion`. Run the style guide's acceptance checks
  before calling UI work done.
- **Keep it small.** Prefer plain Astro components and static output. Add a
  dependency only when a task needs it.

## Stack

- **Astro 5** + **TypeScript (strict)**, `pnpm`
- **Tailwind CSS v4** via `@tailwindcss/vite`; tokens live in `src/styles/global.css`
- Static output for Task 1. An SSR adapter is introduced in Task 3 (admin) —
  not before.
- Later tasks: Claude API (Task 2), a DB + admin page (Task 3), Better Auth (Task 4).
  See `docs/roadmap.md`.

## Layout

```
docs/                    specs (this file, vision, roadmap, tasks, style guide)
  archive/               completed tasks, one dated file each
src/
  assets/svg/            illustrations (hero-kite.svg, divider-string.svg, …)
  styles/global.css      Tailwind v4 entry + Paper Kite tokens
  data/                  quotes.txt, people.txt (+ suggestions.json, rejected.json once generated)
  lib/                   pure TS helpers (e.g. quote parsing)            [Task 1+]
  components/            Astro components                                [Task 1+]
  layouts/               BaseLayout.astro (fonts, theme script)          [Task 1+]
  pages/                 routes                                          [Task 1+]
scripts/                 CLI: suggest-quotes.ts (agent), review-quotes.ts, data.ts   [Task 2]
public/                  favicon, social card                            [Task 1+]
```

SVGs in `src/assets/svg/` use `var(--token, #fallback)` and are meant to be
**inlined** (Astro `?raw` import or SVG component) so they follow light/dark.
Use `<img>` only for exported, hex-baked variants (favicon, social card).

## Commands

```bash
pnpm install
pnpm dev          # local dev server
pnpm build        # static build to dist/
pnpm check        # astro check (types)
pnpm test         # vitest (lib/ helpers)
pnpm quotes:suggest [--person "Name"] [--limit N]   # agent -> suggestions.json (needs ANTHROPIC_API_KEY)
pnpm quotes:review                                  # approve/reject/skip/edit -> quotes.txt
```

## Conventions

- Pure logic in `src/lib/*.ts` with a Vitest test next to it; components stay thin.
- Secrets only via env vars (`.env`, never committed). Document each new var in
  `.env.example`.
- Commit messages: imperative, scoped to the task (e.g. `task1: parse quotes file`).
