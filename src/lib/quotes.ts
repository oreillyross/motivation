export type Quote = { text: string; author?: string };

/** Last ` — `, ` – ` or ` - ` in the entry separates quote from author. */
const AUTHOR_SEPARATOR = /\s+[—–-]\s+(?!.*\s[—–-]\s)/;
const WRAPPING_QUOTES = /^["'“”‘’«»]+|["'“”‘’«»]+$/g;

function clean(s: string): string {
  return s.trim().replace(WRAPPING_QUOTES, "").trim();
}

/** Normalised identity of a quote's text, shared by every de-dupe check. */
export function quoteKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ");
}

/** Parse a quotes file: entries split on newline or tab, optional `— Author`. */
export function parseQuotes(raw: string): Quote[] {
  const seen = new Set<string>();
  const quotes: Quote[] = [];

  for (const entry of raw.split(/[\r\n\t]+/)) {
    const [body, author] = entry.trim().split(AUTHOR_SEPARATOR, 2);
    const text = clean(body ?? "");
    if (!text) continue;

    const k = quoteKey(text);
    if (seen.has(k)) continue;
    seen.add(k);

    const name = author ? clean(author) : "";
    quotes.push(name ? { text, author: name } : { text });
  }

  return quotes;
}

/** Small seeded PRNG (mulberry32) so picks are reproducible in tests. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick an index in `[0, length)`. Random by default, deterministic with `seed`.
 * `exclude` is skipped whenever there is another option. Returns -1 if empty.
 */
export function pickIndex(length: number, opts: { seed?: number; exclude?: number } = {}): number {
  if (length <= 0) return -1;
  if (length === 1) return 0;

  const rand = opts.seed === undefined ? Math.random : seeded(opts.seed);
  const { exclude } = opts;
  const canExclude = exclude !== undefined && exclude >= 0 && exclude < length;
  const i = Math.floor(rand() * (canExclude ? length - 1 : length));
  return canExclude && i >= exclude ? i + 1 : i;
}

export function pickQuote(quotes: Quote[], seed?: number): Quote | undefined {
  return quotes[pickIndex(quotes.length, { seed })];
}
