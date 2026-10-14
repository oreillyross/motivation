import { describe, expect, it } from "vitest";
import { addQuote } from "./add-quote";

const raw = "Keep going. — Someone\n";

describe("addQuote", () => {
  it("appends text and author as one line", () => {
    const r = addQuote(raw, { text: "Start now.", author: "Me" });
    expect(r).toEqual({ ok: true, raw: `${raw}Start now. — Me\n`, quote: { text: "Start now.", author: "Me" } });
  });

  it("reads an author already in the paste", () => {
    const r = addQuote(raw, { text: "“Start now.” - Me" });
    expect(r.ok && r.quote).toEqual({ text: "Start now.", author: "Me" });
  });

  it("flattens pasted newlines and tabs", () => {
    const r = addQuote(raw, { text: "Line one\n\tline two  " });
    expect(r.ok && r.raw).toBe(`${raw}Line one line two\n`);
  });

  it("adds a newline when the file doesn't end with one", () => {
    const r = addQuote("A — B", { text: "C" });
    expect(r.ok && r.raw).toBe("A — B\nC\n");
  });

  it("rejects empty and duplicate quotes", () => {
    expect(addQuote(raw, { text: "   " }).ok).toBe(false);
    expect(addQuote(raw, { text: "keep  going." }).ok).toBe(false);
  });
});
