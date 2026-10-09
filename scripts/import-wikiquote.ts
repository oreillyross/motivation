/**
 * Import sourced quotes from Wikiquote into src/data/quotes.txt.
 *
 *   pnpm quotes:wikiquote [--page "Seneca"] [--topic] [--per-page 10] [--dry-run]
 *
 * Pages come from src/data/wikiquote-pages.txt (or --page). Fetched one at a
 * time with a descriptive User-Agent, as Wikimedia asks. Wikiquote text is
 * CC BY-SA 4.0; the home page footer credits it.
 */
import { parseArgs } from "node:util";
import { PATHS, appendQuoteLine, readQuotes, readText } from "./data";
import { quoteKey } from "../src/lib/quotes";
import { formatForQuotesTxt } from "../src/lib/suggestions";
import { extractQuotes, parsePages, type WikiPage, type WikiQuote } from "../src/lib/wikiquote";

const API = "https://en.wikiquote.org/w/api.php";
const DELAY_MS = 1000;

const { values: args } = parseArgs({
  options: {
    page: { type: "string" },
    topic: { type: "boolean", default: false },
    "per-page": { type: "string", default: "10" },
    "dry-run": { type: "boolean", default: false },
  },
});

const perPage = Number(args["per-page"]);
if (!Number.isInteger(perPage) || perPage < 1) {
  console.error("--per-page must be a positive integer");
  process.exit(1);
}

const contact = process.env.WIKIQUOTE_CONTACT;
if (!contact) {
  console.error("Set WIKIQUOTE_CONTACT (your email or site) in .env. Wikimedia requires a contact in the User-Agent.");
  process.exit(1);
}
const USER_AGENT = `PaperKiteMotivation/0.1 (${contact}) tsx`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWikitext(title: string): Promise<string | null> {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "wikitext",
    redirects: "1",
    format: "json",
    formatversion: "2",
    maxlag: "5",
  }).toString();

  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { parse?: { wikitext: string }; error?: { code: string; info: string } };
  if (json.error) {
    if (json.error.code === "missingtitle") return null;
    throw new Error(json.error.info);
  }
  return json.parse?.wikitext ?? null;
}

/** Evenly spaced pick of `n` items so a long page contributes from all its sections. */
function sample<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  return Array.from({ length: n }, (_, i) => items[Math.floor((i * items.length) / n)]!);
}

const pages: WikiPage[] = args.page
  ? [{ title: args.page, kind: args.topic ? "topic" : "person" }]
  : parsePages(readText(PATHS.wikiquotePages));

if (pages.length === 0) {
  console.error(`No pages. Add titles to ${PATHS.wikiquotePages} or pass --page "Title".`);
  process.exit(1);
}

const seen = new Set(readQuotes().map((q) => quoteKey(q.text)));
let added = 0;

for (const [i, page] of pages.entries()) {
  if (i > 0) await sleep(DELAY_MS);

  let wikitext: string | null;
  try {
    wikitext = await fetchWikitext(page.title);
  } catch (err) {
    console.error(`! ${page.title}: ${(err as Error).message}`);
    continue;
  }
  if (wikitext === null) {
    console.error(`! ${page.title}: no such page`);
    continue;
  }

  const fresh: WikiQuote[] = [];
  for (const q of extractQuotes(wikitext, page.title, { kind: page.kind })) {
    const k = quoteKey(q.text);
    if (seen.has(k)) continue;
    seen.add(k);
    fresh.push(q);
  }

  const picked = sample(fresh, perPage);
  for (const q of picked) {
    if (args["dry-run"]) console.log(`  ${formatForQuotesTxt(q)}`);
    else appendQuoteLine(formatForQuotesTxt(q));
  }
  added += picked.length;
  console.log(`${page.title}: ${picked.length} of ${fresh.length} new`);
}

console.log(`\n${args["dry-run"] ? "Would add" : "Added"} ${added} quote${added === 1 ? "" : "s"}${args["dry-run"] ? "" : " to quotes.txt"}.`);
