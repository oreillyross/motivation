import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseQuotes } from "../src/lib/quotes";
import type { Suggestion } from "../src/lib/suggestions";

const dataFile = (name: string) => fileURLToPath(new URL(`../src/data/${name}`, import.meta.url));

export const PATHS = {
  quotes: dataFile("quotes.txt"),
  people: dataFile("people.txt"),
  wikiquotePages: dataFile("wikiquote-pages.txt"),
  suggestions: dataFile("suggestions.json"),
  rejected: dataFile("rejected.json"),
};

function readJson<T>(path: string): T[] {
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T[]) : [];
}

const writeJson = (path: string, data: unknown) => writeFileSync(path, JSON.stringify(data, null, 2) + "\n");

export const readText = (path: string) => (existsSync(path) ? readFileSync(path, "utf8") : "");
export const readQuotes = () => parseQuotes(readText(PATHS.quotes));
export const readSuggestions = () => readJson<Suggestion>(PATHS.suggestions);
export const writeSuggestions = (s: Suggestion[]) => writeJson(PATHS.suggestions, s);
export const readRejected = () => readJson<string>(PATHS.rejected);
export const writeRejected = (r: string[]) => writeJson(PATHS.rejected, r);

/** Append a line to quotes.txt, keeping it newline-terminated. */
export function appendQuoteLine(line: string) {
  const raw = readText(PATHS.quotes);
  writeFileSync(PATHS.quotes, raw + (raw === "" || raw.endsWith("\n") ? "" : "\n") + line + "\n");
}
