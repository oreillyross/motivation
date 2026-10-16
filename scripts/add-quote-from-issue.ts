import { appendFileSync, writeFileSync } from "node:fs";
import { addQuote } from "../src/lib/add-quote";
import { parseQuoteIssue } from "../src/lib/quote-issue";
import { PATHS, readText } from "./data";

// Used by .github/workflows/add-quote.yml: ISSUE_BODY is the "Add a quote" issue form.
const result = addQuote(readText(PATHS.quotes), parseQuoteIssue(process.env.ISSUE_BODY ?? ""));
const message = result.ok
  ? `Added: ${result.quote.text}${result.quote.author ? ` — ${result.quote.author}` : ""}`
  : result.error;

if (result.ok) writeFileSync(PATHS.quotes, result.raw);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `added=${result.ok}\nmessage<<EOF_MESSAGE\n${message}\nEOF_MESSAGE\n`);
}
console.log(message);
