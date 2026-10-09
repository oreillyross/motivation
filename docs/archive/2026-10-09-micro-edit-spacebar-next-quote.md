# Micro edit: Space bar shows another quote

| | |
|---|---|
| Type | Micro edit (not a roadmap task) |
| Date | 2026-10-09 |
| Branch | `god/eloquent-lamport-2eshsr` |
| Pull request | PR_LINK |

## Why

"Another one" needed a mouse click. Pressing Space should do the same.

## What changed

- `src/lib/shortcut.ts` + `shortcut.test.ts`: `isNextQuoteKey(event, target)` is true for a bare,
  non-repeating Space that isn't aimed at something that already uses Space (button, link, input,
  textarea, select, summary, contenteditable) and has no Ctrl/Meta/Alt/Shift.
- `src/pages/index.astro`: a `keydown` listener on `document` calls the same "another one" function
  as the button (never repeats the current quote) and `preventDefault()`s so the page doesn't scroll.
  It only exists when there are 2+ quotes, like the button.
- The button gets `aria-keyshortcuts="Space"`, and a small muted hint "or press space" shows under it
  (hidden without JS, like the button).

## Decisions

- Space on a focused button is left to the browser (it clicks the button), so it can't fire twice.
- Held keys (`repeat`) are ignored so holding Space doesn't flicker through quotes.

## Verification

- `pnpm check` 0 errors, `pnpm test` 36 passed (4 new), `pnpm build` ok.
- Headless Chromium against `pnpm preview` at 1280x720: 8 of 8 Space presses changed the quote
  (9 distinct quotes seen), `scrollY` stayed 0, Space on the focused button changed it once,
  Ctrl+Space was ignored, and the hint was visible.
