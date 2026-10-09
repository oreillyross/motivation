import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { parseArgs } from "node:util";
import { parsePeople } from "../src/lib/people";
import {
  FoundQuotesSchema,
  dedupeSuggestions,
  formatForQuotesTxt,
  type FoundQuote,
  type Suggestion,
} from "../src/lib/suggestions";
import { PATHS, appendQuoteLine, readQuotes, readRejected, readSuggestions, readText, writeSuggestions } from "./data";

// Cheapest model per provider. Override OpenAI with OPENAI_MODEL.
const MODEL = "claude-haiku-5-5";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";
const MAX_TOKENS = 16000;
const MAX_CONTINUATIONS = 3;

const SYSTEM = `You find real quotes by a named person, using web search.
Rules:
- Real quotes only, copied verbatim from a page you actually found. Never paraphrase, never reconstruct from memory.
- Every quote needs sourceUrl: the URL of the page where you found that exact wording.
- Skip anything misattributed, paraphrased, or that you cannot find on a page.
- Prefer short, motivating, self-contained quotes.
- Return an empty list rather than guess.`;

const WEB_SEARCH = { type: "web_search_20260209", name: "web_search", max_uses: 5 } as const;

// Fallback when structured outputs can't be combined with web search.
const SAVE_QUOTES: Anthropic.Tool = {
  name: "save_quotes",
  description: "Save the verified quotes found for the person. Call once, at the end.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      quotes: {
        type: "array",
        items: {
          type: "object",
          properties: { text: { type: "string" }, author: { type: "string" }, sourceUrl: { type: "string" } },
          required: ["text", "author", "sourceUrl"],
          additionalProperties: false,
        },
      },
    },
    required: ["quotes"],
    additionalProperties: false,
  },
};

const { values: args } = parseArgs({
  options: {
    person: { type: "string" },
    limit: { type: "string" },
    provider: { type: "string" }, // anthropic | openai; default: whichever API key is set
    // Skip the review step: write straight to quotes.txt (used by the CI workflow).
    "auto-approve": { type: "boolean", default: false },
  },
});
const limit = Math.max(1, Number(args.limit ?? 5) || 5);

const wanted = args.provider?.toLowerCase();
if (wanted && wanted !== "anthropic" && wanted !== "openai") {
  console.error(`--provider must be "anthropic" or "openai", got "${args.provider}"`);
  process.exit(1);
}
const provider: "anthropic" | "openai" | undefined =
  (wanted as "anthropic" | "openai" | undefined) ??
  (process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.OPENAI_API_KEY ? "openai" : undefined);
if (!provider || !process.env[provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY"]) {
  console.error(
    provider
      ? `${provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY"} is not set (needed for --provider ${provider}).`
      : "Set ANTHROPIC_API_KEY or OPENAI_API_KEY (copy .env.example to .env).",
  );
  process.exit(1);
}
const anthropic = provider === "anthropic" ? new Anthropic() : undefined;
const openai = provider === "openai" ? new OpenAI() : undefined;

console.log(`Provider: ${provider} (${provider === "anthropic" ? MODEL : OPENAI_MODEL})`);

let mode: "structured" | "tool" = "structured";

type Usage = { input_tokens: number; output_tokens: number };

type Result = { found: FoundQuote[]; usage: Usage } | { skipped: string };

const prompt = (person: string) =>
  `Find up to ${limit} real, attributable quotes by ${person}. Use web search and give the source page URL for each.`;

async function findQuotesOpenAI(person: string): Promise<Result> {
  const response = await openai!.responses.parse({
    model: OPENAI_MODEL,
    instructions: SYSTEM,
    input: prompt(person),
    tools: [{ type: "web_search" }],
    reasoning: { effort: "low" }, // web search doesn't work with "minimal"
    text: { format: zodTextFormat(FoundQuotesSchema, "found_quotes") },
  });
  const usage = { input_tokens: response.usage?.input_tokens ?? 0, output_tokens: response.usage?.output_tokens ?? 0 };
  if (response.status === "incomplete") return { skipped: `incomplete: ${response.incomplete_details?.reason ?? "unknown"}` };
  if (response.output.some((o) => o.type === "message" && o.content.some((c) => c.type === "refusal"))) {
    return { skipped: "model refused" };
  }
  if (!response.output_parsed) return { skipped: "no parseable output" };
  return { found: response.output_parsed.quotes, usage };
}

async function findQuotes(person: string): Promise<Result> {
  if (provider === "openai") return findQuotesOpenAI(person);
  const client = anthropic!;
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: prompt(person),
    },
  ];
  const usage: Usage = { input_tokens: 0, output_tokens: 0 };

  for (let turn = 0; turn <= MAX_CONTINUATIONS; turn++) {
    const base = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      messages,
    } as const;

    const response =
      mode === "structured"
        ? await client.messages.parse({
            ...base,
            output_config: { effort: "medium", format: zodOutputFormat(FoundQuotesSchema) },
            tools: [WEB_SEARCH],
          })
        : await client.messages.create({
            ...base,
            output_config: { effort: "medium" },
            tools: [WEB_SEARCH, SAVE_QUOTES],
            tool_choice: { type: "auto" },
          });

    usage.input_tokens += response.usage.input_tokens;
    usage.output_tokens += response.usage.output_tokens;

    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }
    if (response.stop_reason === "refusal") return { skipped: "model refused" };
    if (response.stop_reason === "max_tokens") return { skipped: "hit max_tokens" };

    if (mode === "structured") {
      const parsed = (response as { parsed_output?: { quotes: FoundQuote[] } | null }).parsed_output;
      if (!parsed) return { skipped: "no parseable output" };
      return { found: parsed.quotes, usage };
    }

    const call = response.content.find((b) => b.type === "tool_use" && b.name === "save_quotes");
    if (!call || call.type !== "tool_use") return { skipped: "model never called save_quotes" };
    const result = FoundQuotesSchema.safeParse(call.input);
    return result.success ? { found: result.data.quotes, usage } : { skipped: "invalid save_quotes input" };
  }
  return { skipped: "too many pause_turn continuations" };
}

/** Run one person. On a 400 about structured outputs + web search, switch to the tool fallback once. */
async function runPerson(person: string): Promise<Result> {
  try {
    return await findQuotes(person);
  } catch (err) {
    if (mode === "structured" && err instanceof Anthropic.BadRequestError && /output_config|format|structured/i.test(err.message)) {
      console.warn(`  structured outputs + web search rejected (${err.message}); falling back to save_quotes tool`);
      mode = "tool";
      return await findQuotes(person);
    }
    throw err;
  }
}

const allPeople = parsePeople(readText(PATHS.people));
const people = args.person
  ? allPeople.filter((p) => p.toLowerCase() === args.person!.trim().toLowerCase())
  : allPeople;
if (people.length === 0) {
  console.error(args.person ? `"${args.person}" is not in src/data/people.txt` : "src/data/people.txt has no people");
  process.exit(1);
}

const live = readQuotes();
const rejected = readRejected();
let pending = readSuggestions();
let added = 0;

for (const person of people) {
  console.log(`\n${person}`);
  try {
    const res = await runPerson(person);
    if ("skipped" in res) {
      console.warn(`  skipped: ${res.skipped}`);
      continue;
    }
    const fresh = dedupeSuggestions(res.found.slice(0, limit), live, pending, rejected);
    const foundAt = new Date().toISOString();
    const items: Suggestion[] = fresh.map((f) => ({ ...f, person, foundAt }));
    if (args["auto-approve"]) {
      for (const item of items) appendQuoteLine(formatForQuotesTxt(item));
      live.push(...items); // keep later people de-duped against this run
    } else {
      pending = [...pending, ...items];
      writeSuggestions(pending); // save per person so a later failure loses nothing
    }
    added += items.length;
    console.log(
      `  ${res.found.length} found, ${items.length} new · tokens in ${res.usage.input_tokens} / out ${res.usage.output_tokens} (${provider === "openai" ? OPENAI_MODEL : `${MODEL}, ${mode}`})`,
    );
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError || err instanceof OpenAI.RateLimitError) {
      console.warn("  rate limited, skipping this person; re-run later");
    } else if (err instanceof Anthropic.BadRequestError || err instanceof OpenAI.BadRequestError) {
      console.warn(`  bad request: ${err.message}`);
    } else if (err instanceof Anthropic.APIError || err instanceof OpenAI.APIError) {
      console.warn(`  API error ${err.status ?? ""}: ${err.message}`);
    } else {
      throw err;
    }
  }
}

console.log(`\nDone. ${added} new quote(s) ${args["auto-approve"] ? "added to quotes.txt" : `pending (${pending.length} total). Review with: pnpm quotes:review`}`);
