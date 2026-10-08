# Tasks

Current task only. When it's done, tick everything, then pull the next task in
from `docs/roadmap.md`.

---

## Task 1 — Quotes on the home page (MVP V1)

**Goal:** opening `/` shows one motivational quote from a static list, in the
Paper Kite style, with a way to see another.

### Input (from me)

I'll paste my quotes into `src/data/quotes.txt`:

- Quotes are separated by a **newline or a tab** (either works, mixed is fine).
- Optional author: `Quote text — Author` (em dash, or ` - ` hyphen with spaces).
- Blank entries and surrounding whitespace / quote marks are ignored.

```
The best way out is always through. — Robert Frost
Hell yeah or no. — Derek Sivers
What would this look like if it were easy? — Tim Ferriss
```

### Steps

**1. Scaffold**
- [ ] Init Astro 5 (minimal template, TypeScript strict) in the repo root with `pnpm`.
- [ ] Add Tailwind v4 via `@tailwindcss/vite`; import `src/styles/global.css` in the layout.
- [ ] Add Vitest; scripts `dev`, `build`, `preview`, `check`, `test`.
- [ ] `.gitignore` (node_modules, dist, .astro, .env), `.env.example` (empty for now).

**2. Quote data**
- [ ] Create `src/data/quotes.txt` with the 3 sample quotes above (I'll replace them).
- [ ] `src/lib/quotes.ts`:
  - `type Quote = { text: string; author?: string }`
  - `parseQuotes(raw: string): Quote[]` — split on `\n` / `\t`, trim, strip
    wrapping quote marks, split author on ` — ` / ` - `, drop empties, de-dupe.
  - `pickQuote(quotes, seed?)` — random by default; deterministic with a seed.
- [ ] `src/lib/quotes.test.ts` covering newline, tab, mixed, author/no author,
  blanks, duplicates.
- [ ] Load the file at build time (`import raw from "../data/quotes.txt?raw"`).

**3. Layout & style**
- [ ] `src/layouts/BaseLayout.astro`: Google Fonts links (only listed weights,
  `display=swap`), inline theme script from the style guide, `<title>`, meta.
- [ ] Nav: Caveat wordmark "Paper Kite", light/dark toggle (secondary button, 44px).
- [ ] Inline `hero-kite.svg` (decorative → `aria-hidden`) and `divider-string.svg`.
- [ ] Favicon (32×32 kite diamond, light + dark) in `public/`.

**4. Home page `/`**
- [ ] `QuoteCard.astro`: card fill, `rounded-wobble`, 1px border, accent tape strip,
  quote in Nunito (body or h3 size), author in small/muted.
- [ ] Render all parsed quotes into the page as JSON; a tiny client script picks
  one on load, so each visit differs on a static site.
- [ ] "Another one" primary button swaps to a different quote (no repeat of current).
- [ ] Empty state if the list is empty (friendly copy; empty-state SVG optional).
- [ ] No-JS fallback: server-rendered first quote is visible.

**5. Verify**
- [ ] `pnpm test`, `pnpm check`, `pnpm build` all green.
- [ ] Style guide acceptance checks: contrast both themes, 360px layout, 44px tap
  targets, keyboard focus ring, reduced motion stops kite sway.

### Out of scope

People list, LLM, settings/admin, DB, auth, SSR adapter — later tasks.

### Decisions / notes

- Static output (`output: "static"`); deploy target chosen at the end of Task 1.
- Random pick happens client-side so a static build still feels fresh.
