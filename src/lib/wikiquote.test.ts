import { describe, expect, it } from "vitest";
import { authorFromCitation, cleanWikitext, extractQuotes, parsePages } from "./wikiquote";

describe("cleanWikitext", () => {
  it("strips links, templates, refs, markup and entities", () => {
    const raw = `'''You''' have [[power]] over [[Mind|your mind]]{{citation needed}}<ref>x</ref> &amp; [http://a.b site] <br/>ok`;
    expect(cleanWikitext(raw)).toBe("You have power over your mind & site ok");
  });

  it("removes nested templates", () => {
    expect(cleanWikitext("a {{x|{{y}}}} b")).toBe("a b");
  });
});

describe("extractQuotes", () => {
  const page = [
    "== Sourced ==",
    "=== ''Meditations'' ===",
    "* You have power over your mind - not outside events. Realize this, and you will find strength.",
    "** Book VIII",
    "* short",
    "== Disputed ==",
    "* Disputed quote that is long enough to otherwise be included here.",
    "== Quotes about Marcus ==",
    "* Somebody else saying something long enough to be a quote about him.",
  ].join("\n");

  it("keeps sourced quotes, attaches the source, skips disputed / about / short", () => {
    expect(extractQuotes(page, "Marcus Aurelius")).toEqual([
      {
        text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        source: "Book VIII",
      },
    ]);
  });

  it("resumes after a nested skipped subsection", () => {
    const wt = [
      "== Quotes ==",
      "=== Disputed ===",
      "* Disputed quote that is long enough to otherwise be included here.",
      "=== Other ===",
      "* A properly sourced quote that comes after the disputed subsection.",
    ].join("\n");
    expect(extractQuotes(wt, "X").map((q) => q.text)).toEqual([
      "A properly sourced quote that comes after the disputed subsection.",
    ]);
  });

  it("drops quotes over the max length", () => {
    const wt = `* ${"a".repeat(301)}\n* ${"b".repeat(60)}`;
    expect(extractQuotes(wt, "X")).toHaveLength(1);
  });

  it("reads the author from the nested bullet on topic pages", () => {
    const wt = [
      "* Courage is resistance to fear, mastery of fear, not absence of fear.",
      "** Mark Twain, ''Pudd'nhead Wilson'' (1894)",
      "* A line with no attributed author that is long enough to count here.",
      "** (1894)",
    ].join("\n");
    expect(extractQuotes(wt, "Courage", { kind: "topic" })).toEqual([
      { text: "Courage is resistance to fear, mastery of fear, not absence of fear.", author: "Mark Twain" },
    ]);
  });
});

describe("authorFromCitation", () => {
  it("takes the name before the first comma or parenthesis", () => {
    expect(authorFromCitation("[[Winston Churchill]], speech (1940)")).toBe("Winston Churchill");
    expect(authorFromCitation("Seneca the Younger in ''Letters''")).toBe("Seneca the Younger");
  });
  it("returns empty when it isn't a name", () => {
    expect(authorFromCitation("(1894)")).toBe("");
    expect(authorFromCitation("lowercase thing")).toBe("");
  });
});

describe("parsePages", () => {
  it("parses titles, topic suffix, comments and duplicates", () => {
    expect(parsePages("# c\nSeneca\n\nCourage | topic\nseneca\n")).toEqual([
      { title: "Seneca", kind: "person" },
      { title: "Courage", kind: "topic" },
    ]);
  });
});
