import { describe, expect, it } from "vitest";
import { parseQuoteIssue, quoteIssueUrl } from "./quote-issue";

describe("quoteIssueUrl", () => {
  it("prefills the issue form fields", () => {
    const url = new URL(quoteIssueUrl("https://github.com/me/site/", { text: " Start now. ", author: "Me" }));
    expect(url.pathname).toBe("/me/site/issues/new");
    expect(url.searchParams.get("template")).toBe("add-quote.yml");
    expect(url.searchParams.get("quote")).toBe("Start now.");
    expect(url.searchParams.get("author")).toBe("Me");
  });

  it("leaves out empty fields", () => {
    const url = new URL(quoteIssueUrl("https://github.com/me/site", { text: "" }));
    expect(url.searchParams.has("quote")).toBe(false);
    expect(url.searchParams.has("author")).toBe(false);
  });
});

describe("parseQuoteIssue", () => {
  it("reads the quote and author sections", () => {
    const body = "### Quote\n\nStart now.\nKeep going.\n\n### Author\n\nMe";
    expect(parseQuoteIssue(body)).toEqual({ text: "Start now.\nKeep going.", author: "Me" });
  });

  it("treats a skipped author as empty", () => {
    expect(parseQuoteIssue("### Quote\r\n\r\nStart now.\r\n\r\n### Author\r\n\r\n_No response_")).toEqual({
      text: "Start now.",
      author: "",
    });
  });

  it("returns empty text when there is no quote section", () => {
    expect(parseQuoteIssue("just some text").text).toBe("");
  });
});
