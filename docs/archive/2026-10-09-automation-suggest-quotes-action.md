# Automation: add quotes when people.txt changes

| | |
|---|---|
| Type | Automation (outside the roadmap; builds on Task 2) |
| Date | 2026-10-09 |
| Branch | `god/eloquent-lamport-2eshsr` |
| Pull request | [oreillyross/motivation#5](https://github.com/oreillyross/motivation/pull/5) |

## Why

Task 2's agent only ran by hand (`pnpm quotes:suggest`, then `pnpm quotes:review`). Adding
someone to `people.txt` should be enough: quotes appear on the site without a manual step.

## What changed

- **Workflow** `.github/workflows/suggest-quotes.yml`. Triggers: a push to `main` that touches
  `src/data/people.txt`, or a manual run (`workflow_dispatch`, optional single person).
  - It runs only for names **added** in that push (diff of `people.txt` against the previous
    commit), so existing people don't cost tokens again. A manual run with no name runs everyone.
  - For each name: `pnpm quotes:suggest --auto-approve --person "<name>"`.
  - Commits `src/data/quotes.txt` as `github-actions[bot]` and pushes to `main`; Vercel redeploys.
  - `concurrency` group so two runs can't race, 30 min timeout.
- **`--auto-approve` flag** in `scripts/suggest-quotes.ts`: skips `suggestions.json` and the
  review step and appends de-duplicated, sourced quotes straight to `quotes.txt`.
  Without the flag nothing changes.
- Docs: `docs/CLAUDE.md` layout and commands list the workflow and the flag.

## Decisions

- **Review is skipped on purpose.** Quotes go live unreviewed. `quotes.txt` has no field for the
  source URL, so the Actions log is the only place it survives.
- **Loop-safe.** The workflow only triggers on `people.txt` and only commits `quotes.txt`; pushes made
  with `GITHUB_TOKEN` don't start workflows anyway.
- **Secrets.** Repo secrets `ANTHROPIC_API_KEY` / `OPENAI_API_KEY`. The Vercel env var isn't
  visible to Actions. If `main` is protected, `github-actions[bot]` must be allowed to push.
- **SonarCloud fix.** The first version failed the gate ("C Security Rating on New Code", needs A).
  It used the third-party `pnpm/action-setup@v4` and a workflow-wide `contents: write`. Changed to
  `corepack enable && corepack prepare pnpm@10 --activate`, with `permissions: {}` at the top and
  `contents: write` on the job only. The gate then passed.

## Verification

- Before merge: `pnpm check` clean, 32 tests, workflow YAML parses, the added-lines diff logic checked locally.
- **First live run (after merge, 2026-10-09 09:29 UTC):** Ross added "Jordan B Peterson" to
  `people.txt` (`f025e3c`); `github-actions[bot]` pushed `5aeb2c6` "quotes: auto-add suggestions for
  new people", adding 5 quotes to `quotes.txt`. So the trigger, per-person run, commit and push all work.
- **Not checked:** which provider ran, whether each quote's source page actually contains it, and
  quote quality. At least one of the five (about gun legislation) is a poor fit for a motivation page.
  Unreviewed auto-accept makes that likely to recur.
