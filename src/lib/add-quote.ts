import { parseQuotes, quoteKey, type Quote } from "./quotes";

export type AddQuoteInput = { text: string; author?: string };
export type AddQuoteResult =
  | { ok: true; raw: string; quote: Quote }
  | { ok: false; error: string };

/** Newlines and tabs split entries in quotes.txt, so a pasted quote becomes one line. */
function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Append a pasted quote to the quotes file contents. The paste may already end in
 * `— Author`; a separate `author` wins. Rejects empty and duplicate quotes.
 */
export function addQuote(raw: string, input: AddQuoteInput): AddQuoteResult {
  const text = oneLine(input.text ?? "");
  const author = oneLine(input.author ?? "");
  const line = author ? `${text} — ${author}` : text;

  const [quote] = parseQuotes(line);
  if (!quote) return { ok: false, error: "Paste a quote first." };

  const seen = new Set(parseQuotes(raw).map((q) => quoteKey(q.text)));
  if (seen.has(quoteKey(quote.text))) return { ok: false, error: "That one's already on the list." };

  const sep = raw === "" || raw.endsWith("\n") ? "" : "\n";
  return { ok: true, raw: `${raw}${sep}${line}\n`, quote };
}
