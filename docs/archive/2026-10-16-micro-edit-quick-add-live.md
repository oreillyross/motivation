# Micro edit: Quick add on the live site (via GitHub issue)

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-16 |
| Branch | `god/elegant-einstein-ati2yu` |
| Pull request | – |

## Why

The home page "Add a quote" form (2026-10-14) only worked under `pnpm dev`. Ross wanted to add
quotes from the live site too, without pulling Task 3 (SSR, auth, DB) forward.

## What changed

- `src/pages/index.astro`: the form now renders in production too. Under `pnpm dev` it still writes
  `quotes.txt` directly ("Add to my list"). On the static site the button reads "Add via GitHub" and
  opens a new issue in a new tab with the quote and author prefilled.
- `src/lib/quote-issue.ts` + test: `quoteIssueUrl()` builds the prefilled issue link;
  `parseQuoteIssue()` reads `### Quote` / `### Author` back out of the issue body.
- `.github/ISSUE_TEMPLATE/add-quote.yml`: the "Add a quote" issue form (title `[quote] Add a quote`).
- `scripts/add-quote-from-issue.ts` (`pnpm quotes:from-issue`): reads `ISSUE_BODY` and appends via
  the existing `addQuote()` (same one-line flattening and de-dupe as the dev form).
- `.github/workflows/add-quote.yml`: on a new `[quote]` issue **opened by the repo owner**, appends
  the quote, pushes to `main` (Vercel redeploys) and closes the issue with a comment. Duplicates or
  empty quotes get a "Not added" comment and the issue stays open.

## Decisions

- **GitHub issue, not a write API.** It keeps output `static` with no auth code: GitHub login is the
  auth, and the workflow ignores issues from anyone but the repo owner.
- The form is visible to every visitor. A non-owner's issue does nothing beyond the issue itself.
- No new dependency; the workflow reuses the setup steps from `suggest-quotes.yml`.

## Verification

- `pnpm test` 55 passed (5 new), `pnpm check` 0 errors, `pnpm build` ok; `dist/index.html` has the
  form in issue mode.
- `pnpm quotes:from-issue` with a sample issue body appended one flattened line and wrote
  `added`/`message` outputs; the same quote again gave "That one's already on the list." Reverted.
- Headless Chromium against `pnpm preview` at 390px: "Add via GitHub" opened
  `…/issues/new?template=add-quote.yml&title=…&quote=…&author=…` and showed the status line.
- The workflow itself runs only after merge to `main`; the first real issue is its live test.
