# Archive · Task 1 — Quotes on the home page (MVP V1)

| | |
|---|---|
| **Status** | Done, pending PR review |
| **Completed** | 2026-10-08 |
| **Branch** | `god/laughing-pasteur-q8do3e` |
| **Pull request** | [oreillyross/motivation#2](https://github.com/oreillyross/motivation/pull/2) |

This is the task as planned (copied from `docs/tasks.md` with every box ticked),
followed by what was actually built, the decisions taken along the way, and the
verification evidence.

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
- [x] Init Astro 5 (minimal template, TypeScript strict) in the repo root with `pnpm`.
- [x] Add Tailwind v4 via `@tailwindcss/vite`; import `src/styles/global.css` in the layout.
- [x] Add Vitest; scripts `dev`, `build`, `preview`, `check`, `test`.
- [x] `.gitignore` (node_modules, dist, .astro, .env), `.env.example` (empty for now).

**2. Quote data**
- [x] Create `src/data/quotes.txt` with the 3 sample quotes above (I'll replace them).
- [x] `src/lib/quotes.ts`:
  - `type Quote = { text: string; author?: string }`
  - `parseQuotes(raw: string): Quote[]` — split on `\n` / `\t`, trim, strip
    wrapping quote marks, split author on ` — ` / ` - `, drop empties, de-dupe.
  - `pickQuote(quotes, seed?)` — random by default; deterministic with a seed.
- [x] `src/lib/quotes.test.ts` covering newline, tab, mixed, author/no author,
  blanks, duplicates.
- [x] Load the file at build time (`import raw from "../data/quotes.txt?raw"`).

**3. Layout & style**
- [x] `src/layouts/BaseLayout.astro`: Google Fonts links (only listed weights,
  `display=swap`), inline theme script from the style guide, `<title>`, meta.
- [x] Nav: Caveat wordmark "Paper Kite", light/dark toggle (secondary button, 44px).
- [x] Inline `hero-kite.svg` (decorative → `aria-hidden`) and `divider-string.svg`.
- [x] Favicon (32×32 kite diamond, light + dark) in `public/`.

**4. Home page `/`**
- [x] `QuoteCard.astro`: card fill, `rounded-wobble`, 1px border, accent tape strip,
  quote in Nunito (body or h3 size), author in small/muted.
- [x] Render all parsed quotes into the page as JSON; a tiny client script picks
  one on load, so each visit differs on a static site.
- [x] "Another one" primary button swaps to a different quote (no repeat of current).
- [x] Empty state if the list is empty (friendly copy; empty-state SVG optional).
- [x] No-JS fallback: server-rendered first quote is visible.

**5. Verify**
- [x] `pnpm test`, `pnpm check`, `pnpm build` all green.
- [x] Style guide acceptance checks: contrast both themes, 360px layout, 44px tap
  targets, keyboard focus ring, reduced motion stops kite sway.

### Out of scope

People list, LLM, settings/admin, DB, auth, SSR adapter — later tasks.

### Decisions / notes

- Static output (`output: "static"`); deploy target chosen at the end of Task 1.
- Random pick happens client-side so a static build still feels fresh.

---

## What shipped

| Area | Files |
|---|---|
| Scaffold | `package.json`, `astro.config.mjs` (static output + `@tailwindcss/vite`), `tsconfig.json` (strict), `vitest.config.ts`, `.gitignore`, `.env.example` |
| Quote data | `src/data/quotes.txt` (3 sample quotes), `src/lib/quotes.ts` + `quotes.test.ts` |
| SVG helper | `src/lib/svg.ts` + `svg.test.ts` (`decorative()` turns the hero into an `aria-hidden` inline SVG) |
| Layout | `src/layouts/BaseLayout.astro` (fonts, theme script, meta, favicons), `src/components/Nav.astro` (wordmark + theme toggle) |
| Home page | `src/pages/index.astro`, `src/components/QuoteCard.astro` |
| Assets | `src/assets/svg/empty-cloud.svg` (empty state), `public/favicon.svg`, `public/favicon-dark.svg` |

Versions: Astro 5.18, Tailwind 4.3, Vitest 3.2, TypeScript 5.9, `@astrojs/check` 0.9.

## Decisions made during the build

- **Parser API.** `parseQuotes(raw)` as specced. `pickQuote(quotes, seed?)` is a thin
  wrapper over `pickIndex(length, { seed?, exclude? })`. The page needs the index
  so "Another one" can skip the quote that's showing. Seeded picks use mulberry32.
- **Author separator.** The **last** ` — ` / ` – ` / ` - ` in an entry splits off the
  author, so a spaced hyphen inside the quote still works. En dash was added
  alongside the em dash and hyphen.
- **De-dupe.** Duplicates are matched on quote text only, ignoring case and spacing.
  The first occurrence wins, author included.
- **Wrapping quotes.** `" ' “ ” ‘ ’ « »` are stripped from both ends of the quote
  and the author.
- **No-JS.** The first quote in the file is server-rendered. The "Another one"
  button ships `hidden` and only shows when JS runs and there are 2+ quotes.
- **Theme toggle.** A secondary 44px round button with moon/sun icons (2px stroke
  plus an offset pastel fill). `aria-pressed` reflects dark mode, and the
  `localStorage` access is wrapped in try/catch.
- **Divider** uses `preserveAspectRatio="xMaxYMid slice"`, so at 360px it keeps
  its 32px height and crops from the left instead of shrinking to a hairline.
- **Motion.** Hover and active transforms use Tailwind `motion-safe:`. The kite sway is
  already gated in `global.css`, so under reduced motion only the fill changes.
- **Deploy target: not chosen yet.** `dist/` is plain static files that work on any
  host (Vercel, Netlify, Cloudflare Pages). Carried over to `docs/tasks.md` as an
  open item for Ross.

## Verification (2026-10-08)

- `pnpm test`: 2 files, **19 tests passed**.
- `pnpm check`: **0 errors, 0 warnings, 0 hints** (11 files).
- `pnpm build`: 1 page built, static output in `dist/`.
- Headless Chromium against `pnpm preview`, light + dark × 360px + 1280px:
  - no horizontal scroll (`scrollWidth === innerWidth`) and the h1 doesn't overflow;
  - "Another one" and the theme toggle are both **44×44px** or taller;
  - 11 clicks showed all 3 quotes and never repeated the current one;
  - keyboard Tab gives a **3px solid ring with a 2px offset** (`#7C5CC4` light, `#C9B6F2` dark);
  - kite sway runs (`pk-sway`) normally and is `none` under `prefers-reduced-motion: reduce`;
  - the hero `<title>` is gone (hero is decorative / `aria-hidden`);
  - empty `quotes.txt` renders the empty state with no button;
  - with JS disabled, the first quote shows and the button stays hidden.
- WCAG contrast (computed):
  light fg/bg 12.09, fg/card 12.56, muted-fg/bg 5.78, muted-fg/card 6.00,
  fg/primary 7.43, fg/accent 6.85, ring/bg 4.83;
  dark fg/bg 14.40, fg/card 12.92, muted-fg/bg 8.04, muted-fg/card 7.21,
  primary-fg/primary 9.70, accent-fg/accent 8.95, ring/bg 8.95. All pass.
  Pastel controls carry a 2px `foreground` outline (12:1 / 14.4:1 against the page).
- SVG sizes: hero 3.4 KB, divider 0.6 KB, empty state 1.5 KB, favicons 0.5 KB each. All under 50 KB.
- Fonts: only Caveat 700, Nunito 400/600/700 and Fira Code 400 load, with `display=swap`.
