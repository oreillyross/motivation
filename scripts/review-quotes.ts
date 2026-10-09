import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { formatForQuotesTxt } from "../src/lib/suggestions";
import { appendQuoteLine, readRejected, readSuggestions, writeRejected, writeSuggestions } from "./data";

const pending = readSuggestions();
if (pending.length === 0) {
  console.log("No pending suggestions. Run: pnpm quotes:suggest");
  process.exit(0);
}

const rl = createInterface({ input: stdin, output: stdout });
// Piped input can close mid-question; treat that as quitting instead of hanging.
const lines: string[] = [];
let waiting: ((line: string | null) => void) | null = null;
let closed = false;
rl.on("line", (l) => (waiting ? ((w) => ((waiting = null), w(l)))(waiting) : lines.push(l)));
rl.on("close", () => ((closed = true), waiting?.(null)));
async function ask(prompt: string): Promise<string> {
  stdout.write(prompt);
  const line = lines.shift() ?? (closed ? null : await new Promise<string | null>((r) => (waiting = r)));
  if (line === null) throw new Error("quit");
  return line;
}
const rejected = readRejected();
const remaining = [...pending];
let approved = 0;
let rejectedCount = 0;

try {
  for (const [i, s] of pending.entries()) {
    console.log(`\n[${i + 1}/${pending.length}] ${s.person}\n  "${s.text}" — ${s.author}\n  source: ${s.sourceUrl}`);

    let done = false;
    while (!done) {
      const answer = (await ask("  (a)pprove  (r)eject  (s)kip  (e)dit  (q)uit > ")).trim().toLowerCase();
      if (answer === "a") {
        appendQuoteLine(formatForQuotesTxt(s));
        remaining.splice(remaining.indexOf(s), 1);
        approved++;
        done = true;
      } else if (answer === "r") {
        rejected.push(s.text);
        remaining.splice(remaining.indexOf(s), 1);
        rejectedCount++;
        done = true;
      } else if (answer === "s") {
        done = true;
      } else if (answer === "e") {
        const edited = (await ask("  new text (empty = cancel) > ")).trim();
        if (edited) {
          appendQuoteLine(formatForQuotesTxt({ text: edited, author: s.author }));
          remaining.splice(remaining.indexOf(s), 1);
          approved++;
          done = true;
        }
      } else if (answer === "q") {
        throw new Error("quit");
      }
    }
    // persist after each decision so quitting never loses work
    writeSuggestions(remaining);
    writeRejected(rejected);
  }
} catch (err) {
  if (!(err instanceof Error && err.message === "quit")) throw err;
} finally {
  rl.close();
}

console.log(`\nApproved ${approved}, rejected ${rejectedCount}, ${remaining.length} still pending.`);
