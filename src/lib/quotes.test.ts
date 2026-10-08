import { describe, expect, it } from "vitest";
import { parseQuotes, pickIndex, pickQuote } from "./quotes";

describe("parseQuotes", () => {
  it("splits on newlines", () => {
    expect(parseQuotes("One.\nTwo.\r\nThree.")).toEqual([
      { text: "One." },
      { text: "Two." },
      { text: "Three." },
    ]);
  });

  it("splits on tabs", () => {
    expect(parseQuotes("One.\tTwo.")).toEqual([{ text: "One." }, { text: "Two." }]);
  });

  it("handles mixed newlines and tabs", () => {
    expect(parseQuotes("One.\tTwo.\nThree.")).toHaveLength(3);
  });

  it("splits author on em dash, en dash or spaced hyphen", () => {
    expect(parseQuotes("Hell yeah or no. — Derek Sivers\tKeep going – Anon\nShip it - Me")).toEqual([
      { text: "Hell yeah or no.", author: "Derek Sivers" },
      { text: "Keep going", author: "Anon" },
      { text: "Ship it", author: "Me" },
    ]);
  });

  it("uses the last separator so hyphens inside the quote survive", () => {
    expect(parseQuotes("Well-being - first - Someone")).toEqual([
      { text: "Well-being - first", author: "Someone" },
    ]);
  });

  it("leaves quotes without an author alone", () => {
    expect(parseQuotes("No author here.")).toEqual([{ text: "No author here." }]);
  });

  it("strips surrounding whitespace and wrapping quote marks", () => {
    expect(parseQuotes('  "Straight."  \n“Curly.” — A\n\'Single.\'')).toEqual([
      { text: "Straight." },
      { text: "Curly.", author: "A" },
      { text: "Single." },
    ]);
  });

  it("drops blank entries", () => {
    expect(parseQuotes("\n\n  \t\t One. \n\n")).toEqual([{ text: "One." }]);
    expect(parseQuotes("")).toEqual([]);
    expect(parseQuotes('"" — Nobody')).toEqual([]);
  });

  it("de-dupes by text, ignoring case and spacing, keeping the first", () => {
    expect(parseQuotes("Be kind. — A\nbe  KIND.\nBe kind. — B")).toEqual([
      { text: "Be kind.", author: "A" },
    ]);
  });
});

describe("pickIndex", () => {
  it("returns -1 for an empty list", () => {
    expect(pickIndex(0)).toBe(-1);
  });

  it("is deterministic with a seed", () => {
    expect(pickIndex(10, { seed: 42 })).toBe(pickIndex(10, { seed: 42 }));
  });

  it("stays in range", () => {
    for (let seed = 0; seed < 200; seed++) {
      const i = pickIndex(7, { seed });
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(7);
    }
  });

  it("never returns the excluded index when there is a choice", () => {
    for (let seed = 0; seed < 200; seed++) {
      expect(pickIndex(3, { seed, exclude: 1 })).not.toBe(1);
    }
    expect(pickIndex(2, { exclude: 0 })).toBe(1);
  });

  it("returns the only index even if excluded", () => {
    expect(pickIndex(1, { exclude: 0 })).toBe(0);
  });
});

describe("pickQuote", () => {
  const quotes = [{ text: "a" }, { text: "b" }, { text: "c" }];

  it("returns undefined for an empty list", () => {
    expect(pickQuote([])).toBeUndefined();
  });

  it("returns a quote from the list", () => {
    expect(quotes).toContain(pickQuote(quotes));
  });

  it("is deterministic with a seed", () => {
    expect(pickQuote(quotes, 7)).toBe(pickQuote(quotes, 7));
  });
});
