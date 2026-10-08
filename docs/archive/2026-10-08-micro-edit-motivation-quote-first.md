# Micro edit: rename to "Motivation", quote first

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-08 |
| Branch | `god/sleepy-ramanujan-ncyqn9` |

## Why

The app is called **Motivation**, not Paper Kite. The hero kite was so large that
the quote sat below the fold; the quote is the point of the page.

## What changed

- Renamed the wordmark (`Nav.astro`) and default page `<title>` (`BaseLayout.astro`)
  from "Paper Kite" to "Motivation".
- Hero kite shrunk from `max-w-[720px]` to 140px (160px at `md`) and slightly faded.
- h1 dropped from `text-h1` to `text-h2`; spacing above the quote tightened.
- Quote text enlarged (`text-h4` → `sm:text-h3` → `md:text-[2.5rem]`) and the card
  widened to 48rem with more padding on desktop.

Not changed: the docs still call the visual spec "Paper Kite" (style guide name) and
the hero SVG's internal `<title>` is untouched.

## Verification

- `pnpm check` 0 errors, `pnpm test` 19 passed, `pnpm build` ok.
- Headless Chromium: quote card and "Another one" button fully visible without
  scrolling at 1280×720 (card bottom 445px) and 360×640 (card bottom 563px).
