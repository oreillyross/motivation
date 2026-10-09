import { describe, expect, it } from "vitest";
import { parsePeople } from "./people";

describe("parsePeople", () => {
  it("returns one name per line", () => {
    expect(parsePeople("Tim Ferriss\nDerek Sivers")).toEqual(["Tim Ferriss", "Derek Sivers"]);
  });

  it("ignores blanks and # comments", () => {
    expect(parsePeople("# follow list\n\nTim Ferriss\n   \n# Naval\n")).toEqual(["Tim Ferriss"]);
  });

  it("trims and collapses whitespace, handles CRLF", () => {
    expect(parsePeople("  Tim   Ferriss  \r\nDerek Sivers\r\n")).toEqual(["Tim Ferriss", "Derek Sivers"]);
  });

  it("de-dupes case-insensitively, first spelling wins", () => {
    expect(parsePeople("Tim Ferriss\ntim ferriss\nTIM FERRISS")).toEqual(["Tim Ferriss"]);
  });

  it("returns [] for empty input", () => {
    expect(parsePeople("")).toEqual([]);
  });
});
