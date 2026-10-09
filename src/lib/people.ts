/** Parse people.txt: one name per line, `#` comments and blanks ignored, case-insensitive de-dupe. */
export function parsePeople(raw: string): string[] {
  const seen = new Set<string>();
  const people: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const name = line.trim().replace(/\s+/g, " ");
    if (!name || name.startsWith("#")) continue;

    const k = name.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    people.push(name);
  }

  return people;
}
