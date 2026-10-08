# Tasks

Current task only. When it's done, tick everything, archive it (see
`docs/archive/README.md`), then pull the next task in from `docs/roadmap.md`.

Completed tasks: `docs/archive/`.

---

## Task 2: Agent-suggested quotes from people I follow

> **Status: queued.** Don't start this until Ross has reviewed and merged the Task 1 PR
> and gives the go-ahead.

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
- [ ] Add `@anthropic-ai/sdk` and `zod` (dependencies) and `tsx` (dev) to run the TS script.
- [ ] Add `ANTHROPIC_API_KEY=` to `.env.example`. The script loads `.env` with Node's
  `--env-file-if-exists` (no dotenv dependency).
- [ ] Script `"quotes:suggest": "tsx --env-file-if-exists=.env scripts/suggest-quotes.ts"`.

**2. Pure logic (`src/lib/`, tested)**
- [ ] `src/lib/people.ts`: `parsePeople(raw): string[]` (trim, drop blanks and `#`
  comments, de-dupe case-insensitively) + tests.
- [ ] `src/lib/suggestions.ts`:
  - `type Suggestion = Quote & { author: string; sourceUrl: string; person: string; foundAt: string }`
  - zod schema for the model's output: `{ quotes: { text, author, sourceUrl }[] }`.
  - `dedupeSuggestions(found, existingQuotes, existingSuggestions)` drops anything whose
    text already exists, using the same normalisation as `parseQuotes`. Export the
    key function from `quotes.ts` so both share it.
  - `isValidSource(url)` accepts `http(s)` URLs only.
  - `formatForQuotesTxt(s)` gives `text — author`.
  - Tests for each.

**3. Agent call (`scripts/suggest-quotes.ts`)**
- [ ] For each person: one `client.messages.parse()` call with
  - model `claude-opus-5-5`, adaptive thinking (default), `output_config.effort: "medium"`;
  - tool `{ type: "web_search_20260209", name: "web_search", max_uses: 5 }`;
  - structured output via the zod schema (`output_config.format`);
  - a system prompt that says: real quotes only, verbatim, each with the URL of the
    page it was found on; skip anything misattributed or paraphrased; up to 5 per
    person; return an empty list rather than guess.
- [ ] Handle `stop_reason` `refusal` / `max_tokens` (skip the person and log why).
  Use typed SDK errors (rate limit vs bad request) and keep going to the next person.
- [ ] Flags: `--person "Name"` (run just one), `--limit N` (quotes per person).
- [ ] At the start, check that structured outputs and web search work in the same
  request. If they don't, fall back to a strict client tool `save_quotes` with
  `tool_choice: auto`, and record the decision here.

**4. Pending file + review**
- [ ] Append results to `src/data/suggestions.json` (array of `Suggestion`, pretty-printed,
  stable order), already de-duplicated against `quotes.txt` and earlier suggestions.
- [ ] `pnpm quotes:review`: an interactive CLI (`node:readline`) that walks
  through pending suggestions. **a**pprove appends to `quotes.txt` and removes the
  suggestion from pending; **r**eject records it in `src/data/rejected.json` so it
  isn't suggested again; **s**kip leaves it pending; **e**dit changes the text, then approves.
- [ ] Rejected texts are included in the de-dupe set.

**5. Verify**
- [ ] `pnpm test`, `pnpm check`, `pnpm build` all green. The site build ignores `suggestions.json`.
- [ ] Real run for the 2 sample people produces sourced suggestions. Spot-check
  that every `sourceUrl` opens and contains the quote.
- [ ] Approve one through `quotes:review` and confirm it shows on the home page after `pnpm build`.
- [ ] No API key in git (`git grep -i sk-ant` is empty).

### Out of scope

Browser UI for running the agent or editing lists, a DB, auth, scheduled runs:
those are Task 3 and later.

### Decisions / notes

- The agent only **suggests**. `quotes.txt` stays the single live source, and only
  `quotes:review` (or a manual edit) writes to it.
- One API call per person keeps failures isolated and costs visible. Log token usage per person.
- `sourceUrl` is required; a suggestion without one is dropped.
