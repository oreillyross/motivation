import { z } from "zod";
import { quoteKey, type Quote } from "./quotes";

export type Suggestion = Quote & {
  author: string;
  sourceUrl: string;
  person: string;
  foundAt: string;
};

/** Shape the model must return for one person. */
export const FoundQuotesSchema = z.object({
  quotes: z.array(
    z.object({
      text: z.string(),
      author: z.string(),
      sourceUrl: z.string(),
    }),
  ),
});

export type FoundQuote = z.infer<typeof FoundQuotesSchema>["quotes"][number];

/** Only http(s) URLs count as a source. */
export function isValidSource(url: string): boolean {
  try {
    const { protocol } = new URL(url.trim());
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Drop found quotes that are empty, unsourced, or already known (live quotes,
 * pending suggestions, rejected texts) or repeated within `found`.
 */
export function dedupeSuggestions(
  found: FoundQuote[],
  existingQuotes: Quote[],
  existingSuggestions: Pick<Quote, "text">[],
  rejected: string[] = [],
): FoundQuote[] {
  const seen = new Set<string>([
    ...existingQuotes.map((q) => quoteKey(q.text)),
    ...existingSuggestions.map((s) => quoteKey(s.text)),
    ...rejected.map(quoteKey),
  ]);

  const out: FoundQuote[] = [];
  for (const f of found) {
    const text = f.text.trim();
    if (!text || !isValidSource(f.sourceUrl)) continue;
    const k = quoteKey(text);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ ...f, text, sourceUrl: f.sourceUrl.trim() });
  }
  return out;
}

/** Line for quotes.txt: `text — author`. */
export function formatForQuotesTxt(s: Pick<Suggestion, "text" | "author">): string {
  const author = s.author.trim();
  return author ? `${s.text.trim()} — ${author}` : s.text.trim();
}
