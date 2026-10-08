/**
 * Mark an inline SVG as decorative: drop role/aria-labelledby and its <title>,
 * add aria-hidden so screen readers skip it.
 */
export function decorative(svg: string): string {
  return svg
    .replace(/\s(role|aria-labelledby)="[^"]*"/g, "")
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/g, "")
    .replace(/<svg(?![^>]*aria-hidden)/, '<svg aria-hidden="true" focusable="false"');
}
