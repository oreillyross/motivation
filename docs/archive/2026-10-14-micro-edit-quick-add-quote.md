# Micro edit: Trim quotes to the original 74 + quick-add form

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-14 |
| Branch | `god/friendly-fermat-yk16r6` |
| Pull request | – |

## Why

The imported/agent quotes (lines 75+ of `src/data/quotes.txt`) diluted the hand-picked list, and
adding a new quote meant opening the file by hand.

## What changed

- `src/data/quotes.txt`: cut back to the first 74 lines (Ross's originals).
- `src/lib/add-quote.ts` + test: `addQuote(raw, { text, author? })` flattens a pasted quote to one
  line, reads a trailing `— Author` from the paste (a separate author field wins), rejects empty and
  duplicate quotes (same `quoteKey` as the parser), and returns the new file contents.
- `src/integrations/quick-add.ts`: a dev-server-only `POST /api/quotes` (Vite middleware via
  `astro:server:setup`) that appends to `quotes.txt`. Registered in `astro.config.mjs`.
- `src/pages/index.astro`: under the quote and "Another one", an "Add a quote" form (paste box,
  optional author, "Add to my list"). On success the new quote is shown in the card and the status
  line says how many quotes are on the list. Rendered only when `import.meta.env.DEV`.

## Decisions

- **Dev only.** The site is static with no host or DB yet (Task 3), so production has nowhere to
  write. Workflow: `pnpm dev`, paste, add, then commit `quotes.txt`. The form isn't in `dist/`.
- No adapter or new dependency; output stays `static`.
- Writing `quotes.txt` can make the dev server reload the page, so the new quote is carried across
  in `sessionStorage` and shown again after reload.

## Verification

- `pnpm test` 50 passed (5 new), `pnpm check` 0 errors, `pnpm build` ok; the form is absent from
  `dist/index.html`.
- Headless Chromium against `pnpm dev` at 390px: a pasted two-line quote with `— Tester` was
  appended as one line, shown in the card with "Added. 75 quotes on your list."; re-adding it gave
  "That one's already on the list." Test line removed afterwards.
