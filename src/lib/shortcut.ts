type KeyLike = {
  key: string;
  repeat?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  defaultPrevented?: boolean;
};
type TargetLike = { tagName?: string; isContentEditable?: boolean } | null;

const OWN_SPACE = new Set(["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "SUMMARY"]);

/**
 * True when a keydown should swap the quote: a bare, non-repeating Space that isn't
 * aimed at something that already uses Space (buttons, links, form fields, editors).
 */
export function isNextQuoteKey(e: KeyLike, target: TargetLike): boolean {
  if (e.key !== " " || e.repeat || e.defaultPrevented) return false;
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return false;
  if (target?.isContentEditable) return false;
  return !OWN_SPACE.has((target?.tagName ?? "").toUpperCase());
}
