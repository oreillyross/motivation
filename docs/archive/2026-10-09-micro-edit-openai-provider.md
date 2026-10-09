# Micro edit: choose Anthropic or OpenAI for quotes:suggest

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-09 |
| Branch | `god/eloquent-lamport-2eshsr` |
| Pull request | [oreillyross/motivation#5](https://github.com/oreillyross/motivation/pull/5) |

## Why

Run the quote agent with an OpenAI key as well as an Anthropic key, using the cheapest model of each.

## What changed

- `scripts/suggest-quotes.ts` picks a provider: `--provider anthropic|openai`, else Anthropic if
  `ANTHROPIC_API_KEY` is set, else OpenAI if `OPENAI_API_KEY` is set. It prints the provider and model at the start.
- **Anthropic:** `claude-haiku-5-5` (the model the script already used by then; $0.10 / $0.50 per MTok).
- **OpenAI:** `gpt-5-nano` (cheapest in the SDK's model list, about $0.05 / $0.40 per MTok from third-party
  price tables), overridable with `OPENAI_MODEL`. Uses the Responses API with the `web_search` tool,
  zod structured output (`zodTextFormat`) and `reasoning.effort: "low"` (web search doesn't work with "minimal").
- Refusals, incomplete output, rate limits, bad requests and API errors skip that person for both providers.
- New dependency `openai`. `.env.example` lists `OPENAI_API_KEY` and `OPENAI_MODEL`.
  The workflow passes `OPENAI_API_KEY` through; Anthropic wins if both secrets exist.

## Verification

- `pnpm check` 0 errors, `pnpm test` 32 passed. No key gives a clear error; `OPENAI_API_KEY` alone selects
  OpenAI. The OpenAI call itself could not be exercised (no network to OpenAI from the build environment).
- **Not verified:** that `gpt-5-nano` accepts the web search tool. If the first run fails on that, set
  `OPENAI_MODEL=gpt-5-mini`.
