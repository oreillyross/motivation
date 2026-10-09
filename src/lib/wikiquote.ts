export type WikiQuote = { text: string; author: string; source?: string };

export type ExtractOptions = {
  /** `person`: every quote is by `title`. `topic`: the author is read from the first nested bullet. */
  kind?: "person" | "topic";
  minLength?: number;
  maxLength?: number;
};

/** Sections that hold unsourced, disputed or third-party text. Skipped up to the next heading of the same or higher level. */
const SKIP_HEADING =
  /^(disputed|misattributed|attributed|unsourced|quotes about|about|see also|external links|further reading|notes|references|sources|bibliography|gallery)\b/i;

const HEADING = /^(=+)\s*(.*?)\s*=+\s*$/;

/** Wikitext -> plain text: links, templates, refs, tags, bold/italic, entities. */
export function cleanWikitext(input: string): string {
  let s = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ref[^>]*\/>/gi, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "")
    .replace(/<br\s*\/?>/gi, " ");

  // Templates can nest, so peel the innermost ones until none are left.
  for (let prev = ""; prev !== s; ) {
    prev = s;
    s = s.replace(/\{\{[^{}]*\}\}/g, "");
  }

  return s
    .replace(/\[\[(?:File|Image|Category):[^\]]*\]\]/gi, "")
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1") // wikilinks
    .replace(/\[(?:https?:)?\/\/\S+\s+([^\]]+)\]/g, "$1") // [url label]
    .replace(/\[(?:https?:)?\/\/\S+\]/g, "") // [url]
    .replace(/'{2,}/g, "") // bold / italic
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&[lr]dquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** `Albert Einstein, <i>Title</i> (1931)` -> `Albert Einstein`. Empty when it doesn't look like a name. */
export function authorFromCitation(citation: string): string {
  const name = cleanWikitext(citation)
    .replace(/^[—–-]\s*/, "")
    .split(/,|;|\s+(?:in|from|as quoted)\s+|\(/i)[0]!
    .trim();
  return /^[A-Z][\p{L}.'’-]+(?:\s+[\p{L}.'’-]+){0,4}$/u.test(name) ? name : "";
}

/**
 * Pull the sourced quotes out of a Wikiquote page's wikitext.
 * Top-level bullets are quotes; nested bullets are citations (the source on
 * person pages, the author on topic pages). Disputed / misattributed / "quotes
 * about" sections are skipped. Quotes outside the length window are dropped.
 */
export function extractQuotes(wikitext: string, title: string, opts: ExtractOptions = {}): WikiQuote[] {
  const { kind = "person", minLength = 20, maxLength = 300 } = opts;
  const out: (WikiQuote & { cited: boolean })[] = [];
  let skipLevel = 0; // 0 = not skipping

  for (const line of wikitext.split(/\r?\n/)) {
    const heading = HEADING.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      if (skipLevel && level <= skipLevel) skipLevel = 0;
      if (!skipLevel && SKIP_HEADING.test(cleanWikitext(heading[2]!))) skipLevel = level;
      continue;
    }
    if (skipLevel) continue;

    if (/^\*[^*]/.test(line)) {
      out.push({ text: cleanWikitext(line.slice(1)), author: kind === "person" ? title : "", cited: false });
    } else if (/^\*\*[^*]/.test(line) && out.length) {
      const last = out[out.length - 1]!;
      const citation = line.replace(/^\*+/, "");
      if (kind === "topic" && !last.cited) last.author = authorFromCitation(citation);
      else if (kind === "person" && !last.source) last.source = cleanWikitext(citation);
      last.cited = true;
    }
  }

  return out
    .filter((q) => q.author && q.text.length >= minLength && q.text.length <= maxLength)
    .map(({ text, author, source }) => (source ? { text, author, source } : { text, author }));
}

export type WikiPage = { title: string; kind: "person" | "topic" };

/** pages file: one title per line, `#` comments, optional ` | topic` suffix (default `person`). */
export function parsePages(raw: string): WikiPage[] {
  const seen = new Set<string>();
  const pages: WikiPage[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const [title = "", kind = ""] = line.split("|").map((p) => p.trim().replace(/\s+/g, " "));
    if (!title || title.startsWith("#")) continue;
    const k = title.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    pages.push({ title, kind: kind.toLowerCase() === "topic" ? "topic" : "person" });
  }
  return pages;
}
