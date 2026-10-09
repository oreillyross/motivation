import { describe, expect, it } from "vitest";
import { dedupeSuggestions, formatForQuotesTxt, isValidSource, FoundQuotesSchema } from "./suggestions";

const f = (text: string, sourceUrl = "https://example.com/a") => ({ text, author: "Tim Ferriss", sourceUrl });

describe("isValidSource", () => {
  it("accepts http and https", () => {
    expect(isValidSource("https://example.com/x")).toBe(true);
    expect(isValidSource("http://example.com")).toBe(true);
  });
  it("rejects other schemes and junk", () => {
    expect(isValidSource("javascript:alert(1)")).toBe(false);
    expect(isValidSource("ftp://example.com")).toBe(false);
    expect(isValidSource("example.com")).toBe(false);
    expect(isValidSource("")).toBe(false);
  });
});

describe("dedupeSuggestions", () => {
  it("drops quotes already in the live list (case/space-insensitive)", () => {
    const out = dedupeSuggestions([f("Hell yeah  or no."), f("New one")], [{ text: "hell yeah or no." }], []);
    expect(out.map((q) => q.text)).toEqual(["New one"]);
  });
  it("drops existing suggestions and rejected texts", () => {
    const out = dedupeSuggestions([f("A"), f("B"), f("C")], [], [{ text: "a" }], ["B"]);
    expect(out.map((q) => q.text)).toEqual(["C"]);
  });
  it("drops repeats within the batch and unsourced quotes", () => {
    const out = dedupeSuggestions([f("A"), f("a"), f("B", "nope"), f("  ")], [], []);
    expect(out.map((q) => q.text)).toEqual(["A"]);
  });
});

describe("formatForQuotesTxt", () => {
  it("joins text and author with an em dash", () => {
    expect(formatForQuotesTxt({ text: "Hi.", author: "Me" })).toBe("Hi. — Me");
  });
  it("omits the dash without an author", () => {
    expect(formatForQuotesTxt({ text: "Hi.", author: " " })).toBe("Hi.");
  });
});

describe("FoundQuotesSchema", () => {
  it("parses the model output shape", () => {
    expect(FoundQuotesSchema.parse({ quotes: [f("A")] }).quotes).toHaveLength(1);
    expect(() => FoundQuotesSchema.parse({ quotes: [{ text: "A" }] })).toThrow();
  });
});
