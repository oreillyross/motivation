import { describe, expect, it } from "vitest";
import { isNextQuoteKey } from "./shortcut";

const space = { key: " " };
const body = { tagName: "BODY" };

describe("isNextQuoteKey", () => {
  it("accepts a bare Space on the page", () => {
    expect(isNextQuoteKey(space, body)).toBe(true);
    expect(isNextQuoteKey(space, null)).toBe(true);
  });
  it("ignores other keys", () => {
    expect(isNextQuoteKey({ key: "Enter" }, body)).toBe(false);
    expect(isNextQuoteKey({ key: "a" }, body)).toBe(false);
  });
  it("ignores held keys, modifiers and handled events", () => {
    expect(isNextQuoteKey({ ...space, repeat: true }, body)).toBe(false);
    expect(isNextQuoteKey({ ...space, ctrlKey: true }, body)).toBe(false);
    expect(isNextQuoteKey({ ...space, metaKey: true }, body)).toBe(false);
    expect(isNextQuoteKey({ ...space, altKey: true }, body)).toBe(false);
    expect(isNextQuoteKey({ ...space, shiftKey: true }, body)).toBe(false);
    expect(isNextQuoteKey({ ...space, defaultPrevented: true }, body)).toBe(false);
  });
  it("leaves Space alone on controls that use it", () => {
    for (const tagName of ["button", "A", "INPUT", "TEXTAREA", "SELECT"]) {
      expect(isNextQuoteKey(space, { tagName })).toBe(false);
    }
    expect(isNextQuoteKey(space, { tagName: "DIV", isContentEditable: true })).toBe(false);
  });
});
