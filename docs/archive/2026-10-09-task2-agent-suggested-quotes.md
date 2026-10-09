# Archive · Task 2 — Agent-suggested quotes from people I follow

| | |
|---|---|
| **Status** | Code done; four items open (need `ANTHROPIC_API_KEY` / Ross) |
| **Completed** | 2026-10-09 |
| **Branch** | `god/eloquent-lamport-2eshsr` |
| **Pull request** | PR_LINK |

The task as planned (from `docs/tasks.md`), then what was built, decisions, and
verification. Boxes left unticked below were **not** done; they are carried into Task 3.

---

## Task 2: Agent-suggested quotes from people I follow

> **Status: code complete; live-API checks pending (see What shipped).**

**Goal:** `pnpm quotes:suggest` reads the people I follow, asks Claude (with web
search) for real, attributable quotes from each person, and writes de-duplicated,
sourced suggestions to a pending file. Nothing goes live until I approve it into
`quotes.txt`.

### Carried over from Task 1

- [ ] Ross picks a static deploy host (Vercel / Netlify / Cloudflare Pages) and
  connects the repo. `pnpm build` → `dist/` works on any of them. This is not
  blocking for Task 2 code.

### Input (from me)

`src/data/people.txt`, one person per line, editable over time:

```
Tim Ferriss
Derek Sivers
```

Blank lines and `#` comments are ignored.

### Steps

**1. Setup**
- [x] Add `@anthropic-ai/sdk` and `zod` (dependencies) and `tsx` (dev) to run the TS script.
- [x] Add `ANTHROPIC_API_KEY=` to `.env.example`. The script loads `.env` with Node's
  `--env-file-if-exists` (no dotenv dependency).
- [x] Script `"quotes:suggest": "tsx --env-file-if-exists=.env scripts/suggest-quotes.ts"`.

**2. Pure logic (`src/lib/`, tested)**
- [x] `src/lib/people.ts`: `parsePeople(raw): string[]` (trim, drop blanks and `#`
  comments, de-dupe case-insensitively) + tests.
- [x] `src/lib/suggestions.ts`:
  - `type Suggestion = Quote & { author: string; sourceUrl: string; person: string; foundAt: string }`
  - zod schema for the model's output: `{ quotes: { text, author, sourceUrl }[] }`.
  - `dedupeSuggestions(found, existingQuotes, existingSuggestions)` drops anything whose
    text already exists, using the same normalisation as `parseQuotes`. Export the
    key function from `quotes.ts` so both share it.
  - `isValidSource(url)` accepts `http(s)` URLs only.
  - `formatForQuotesTxt(s)` gives `text — author`.
  - Tests for each.

**3. Agent call (`scripts/suggest-quotes.ts`)**
- [x] For each person: one `client.messages.parse()` call with
  - model `claude-opus-5-5`, adaptive thinking (default), `output_config.effort: "medium"`;
  - tool `{ type: "web_search_20260209", name: "web_search", max_uses: 5 }`;
  - structured output via the zod schema (`output_config.format`);
  - a system prompt that says: real quotes only, verbatim, each with the URL of the
    page it was found on; skip anything misattributed or paraphrased; up to 5 per
    person; return an empty list rather than guess.
- [x] Handle `stop_reason` `refusal` / `max_tokens` (skip the person and log why).
  Use typed SDK errors (rate limit vs bad request) and keep going to the next person.
- [x] Flags: `--person "Name"` (run just one), `--limit N` (quotes per person).
- [ ] At the start, check that structured outputs and web search work in the same
  request. If they don't, fall back to a strict client tool `save_quotes` with
  `tool_choice: auto`, and record the decision here.

**4. Pending file + review**
- [x] Append results to `src/data/suggestions.json` (array of `Suggestion`, pretty-printed,
  stable order), already de-duplicated against `quotes.txt` and earlier suggestions.
- [x] `pnpm quotes:review`: an interactive CLI (`node:readline`) that walks
  through pending suggestions. **a**pprove appends to `quotes.txt` and removes the
  suggestion from pending; **r**eject records it in `src/data/rejected.json` so it
  isn't suggested again; **s**kip leaves it pending; **e**dit changes the text, then approves.
- [x] Rejected texts are included in the de-dupe set.

**5. Verify**
- [x] `pnpm test`, `pnpm check`, `pnpm build` all green. The site build ignores `suggestions.json`.
- [ ] Real run for the 2 sample people produces sourced suggestions. Spot-check
  that every `sourceUrl` opens and contains the quote.
- [ ] Approve one through `quotes:review` and confirm it shows on the home page after `pnpm build`.
- [x] No API key in git (`git grep -i sk-ant` is empty).

### Out of scope

Browser UI for running the agent or editing lists, a DB, auth, scheduled runs:
those are Task 3 and later.

### Decisions / notes

- The agent only **suggests**. `quotes.txt` stays the single live source, and only
  `quotes:review` (or a manual edit) writes to it.
- One API call per person keeps failures isolated and costs visible. Log token usage per person.
- `sourceUrl` is required; a suggestion without one is dropped.

---

## What shipped

| Area | Files |
|---|---|
| Setup | `package.json` (`@anthropic-ai/sdk` 0.132, `zod` 4, dev `tsx`, `@types/node`; scripts `quotes:suggest`, `quotes:review`), `.env.example` |
| Input | `src/data/people.txt` (Tim Ferriss, Derek Sivers) |
| Pure logic | `src/lib/people.ts`, `src/lib/suggestions.ts` + tests; `quoteKey` now exported from `src/lib/quotes.ts` |
| Scripts | `scripts/suggest-quotes.ts` (agent), `scripts/review-quotes.ts` (CLI review), `scripts/data.ts` (file IO) |
| Pending data | `src/data/suggestions.json`, `src/data/rejected.json` — created on first use, not committed yet |

## Decisions made during the build

- **Dedupe signature.** `dedupeSuggestions(found, existingQuotes, existingSuggestions, rejected = [])`:
  the optional 4th arg carries rejected texts, so the "rejected are in the de-dupe set" rule
  lives in one function. It also drops blank text, repeats inside the batch, and any quote with an invalid `sourceUrl`.
- **Structured output + web search.** Primary path is `messages.parse()` with
  `zodOutputFormat` and `web_search_20260209`. If the API answers a `BadRequestError`
  mentioning `output_config`/`format`/`structured`, the script switches once to the
  fallback: strict client tool `save_quotes`, `tool_choice: auto`. **Which path the live API
  accepts is unconfirmed** (no key in the build environment); the run log prints the mode used.
- **`pause_turn`.** Server-side web search can pause a turn; the script re-sends the assistant
  content and continues, up to 3 times, summing token usage.
- **Failure isolation.** `refusal`, `max_tokens`, rate limit, bad request and other API errors skip that
  person and log why; the file is saved after each person.
- **Review CLI** saves after every decision, so `q` or Ctrl-C loses nothing. Piped/closed stdin counts as quit.
  Edit approves the edited text with the original author.
- **Env.** Node's `--env-file-if-exists`; no dotenv.

## Verification (2026-10-09)

- `pnpm test`: 4 files, **32 tests passed**.
- `pnpm check`: **0 errors, 0 warnings, 0 hints**.
- `pnpm build`: 1 page built; the site ignores `suggestions.json`.
- `quotes:review` exercised against a scratch `suggestions.json`: approve appended to `quotes.txt`,
  reject went to `rejected.json`, edit appended the edited text, pending emptied. Files restored afterwards.
- `quotes:suggest` without a key exits 1 with a clear message.
- `git grep -i sk-ant`: no key in the repo (the only hit is the checklist line in these docs).

### Not verified (carried to Task 3)

- Real `quotes:suggest` run for the 2 people, with `sourceUrl` spot-check.
- Which structured-output path the live API accepts (structured vs `save_quotes` fallback).
- Approving a real suggestion and seeing it on the home page after `pnpm build`.
- Static deploy host (needs Ross).
