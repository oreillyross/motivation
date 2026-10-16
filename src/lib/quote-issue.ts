import type { AddQuoteInput } from "./add-quote";

export const QUOTE_ISSUE_TEMPLATE = "add-quote.yml";
export const QUOTE_ISSUE_TITLE = "[quote] Add a quote";

/**
 * Link to a new "Add a quote" issue with the form fields prefilled. Issue forms read
 * query params by field id (`quote`, `author`).
 */
export function quoteIssueUrl(repoUrl: string, input: AddQuoteInput): string {
  const params = new URLSearchParams({ template: QUOTE_ISSUE_TEMPLATE, title: QUOTE_ISSUE_TITLE });
  const text = (input.text ?? "").trim();
  const author = (input.author ?? "").trim();
  if (text) params.set("quote", text);
  if (author) params.set("author", author);
  return `${repoUrl.replace(/\/$/, "")}/issues/new?${params}`;
}

/** GitHub writes this for an optional issue-form field that was left empty. */
const NO_RESPONSE = "_No response_";

/**
 * Read the quote back out of an issue-form body: `### Quote` and `### Author`
 * sections, as GitHub renders them.
 */
export function parseQuoteIssue(body: string): AddQuoteInput {
  const sections = new Map<string, string>();
  for (const part of body.replace(/\r\n/g, "\n").split(/^###\s+/m).slice(1)) {
    const [heading = "", ...rest] = part.split("\n");
    const value = rest.join("\n").trim();
    sections.set(heading.trim().toLowerCase(), value === NO_RESPONSE ? "" : value);
  }
  return { text: sections.get("quote") ?? "", author: sections.get("author") ?? "" };
}
