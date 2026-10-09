# Micro edit: Import quotes from Wikiquote

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-09 |
| Branch | `god/great-turing-tlv0f9` |
| Pull request | see branch |

## Why

Fill `quotes.txt` with real, sourced quotes. Wikiquote separates sourced quotes from
"Disputed" and "Misattributed" sections, which avoids the bad attribution in scraped datasets.

## What changed

- `src/lib/wikiquote.ts` + `wikiquote.test.ts`: `extractQuotes` (top-level `*` bullets are quotes,
  nested `**` bullets are the source; on topic pages the nested bullet gives the author),
  `cleanWikitext` (links, nested templates, refs, markup, entities), `parsePages`.
- `scripts/import-wikiquote.ts` (`pnpm quotes:wikiquote`): fetches each page in
  `src/data/wikiquote-pages.txt` one at a time (1s apart, descriptive User-Agent, `maxlag`),
  de-dupes against `quotes.txt` and appends `text — Author`. Flags: `--page`, `--topic`,
  `--per-page` (default 10, evenly sampled), `--dry-run`.
- `src/data/wikiquote-pages.txt`: ~50 seed pages (people + `| topic` pages).
- `.env.example`: `WIKIQUOTE_CONTACT` (required, goes in the User-Agent).
- Home page footer credits Wikiquote and CC BY-SA 4.0.

## Decisions

- Skipped sections are `Disputed`, `Misattributed`, `Attributed`, `Unsourced`, `Quotes about`, plus
  See also / External links / notes. A skipped subsection ends at the next heading of the same or higher
  level, so sourced quotes after a nested "Disputed" are kept.
- Length window 20-300 characters.
- Sources are not stored (the `quotes.txt` format is `text — Author`). The DB schema with `source` and
  `wikiquote_page` columns is left to Task 3; no DB code was added.
- Review the results by hand once: some bullets are commentary. Share-alike applies if the compiled
  dataset is ever published.

## Verification

- `pnpm test`, `pnpm check`, `pnpm build`: 45 tests pass, 0 type errors, build ok.
- The live Wikiquote API was not reachable from the cloud sandbox (proxy 403), so the fetch/dedupe/append
  path was run against a stubbed response: 3 quotes appended, second run added 0.
