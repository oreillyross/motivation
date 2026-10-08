import { describe, expect, it } from "vitest";
import { decorative } from "./svg";

describe("decorative", () => {
  it("strips role, aria-labelledby and title, adds aria-hidden", () => {
    const out = decorative('<svg role="img" aria-labelledby="t" viewBox="0 0 1 1"><title id="t">Hi</title><path/></svg>');
    expect(out).toBe('<svg aria-hidden="true" focusable="false" viewBox="0 0 1 1"><path/></svg>');
  });

  it("leaves an already-decorative SVG alone", () => {
    const svg = '<svg viewBox="0 0 1 1" aria-hidden="true" focusable="false"><path/></svg>';
    expect(decorative(svg)).toBe(svg);
  });
});
