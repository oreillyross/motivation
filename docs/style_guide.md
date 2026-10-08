BUILD BRIEF: Paper Kite · website for Daily Motivation
You are building a website for me based on who I follow. Audience: Me. Apply this visual style exactly. Use only the colors, fonts, and motifs defined here; where the brief is silent, choose what best fits the mood.

MOOD
- Feels: playful, gentle, personal. References: picture-book endpapers, a sketchbook with washi tape.
- Must not feel: childish, saccharine, messy.
- Voice for headings and microcopy: friendly first person, light humor, short.

COLOR (token: light / dark)
background: #FFFAF3 / #241C2E
foreground: #3A2F45 / #F7EFE6
card: #FFFFFF / #2E2439
card-foreground: #3A2F45 / #F7EFE6
muted: #F6EDE2 / #382C46
muted-foreground: #6B5E78 / #BFB0CC
border: #EBDCCB / #4A3B5C
input: #86779A / #8D7BA3
primary: #FFB5A7 / #FFB5A7
primary-foreground: #3A2F45 / #241C2E
accent: #C9B6F2 / #C9B6F2
accent-foreground: #3A2F45 / #241C2E
ring: #7C5CC4 / #C9B6F2
destructive: #B3261E / #FF8A80
success: #2F7D4F / #8FD9A8
warning: #8A5A00 / #FFD27A
Usage: primary peach and accent lavender are fills only, always carrying dark foreground text and (in light mode) a 2px foreground outline so the boundary reaches 3:1. Extra pastel fills #BEE3DB (mint) and #FFE8A3 (butter) are decorative only. Never use a pastel as text color.
Contrast (≈, verify; light / dark): foreground/background ≈ 12:1 / 14.5:1 · muted-foreground/background ≈ 5.8:1 / 8:1 · primary-foreground/primary ≈ 7.7:1 / 9.8:1 · accent-foreground/accent ≈ 7.1:1 / 9:1 · ring/background ≈ 5:1 / 9:1

TYPOGRAPHY
- Display: Caveat 700, fallback "Comic Sans MS", "Segoe Print", cursive
- Body: Nunito 400, 600, 700, fallback system-ui, "Segoe UI", sans-serif
- Mono: Fira Code 400, fallback ui-monospace, Menlo, monospace
- Scale: 17px base, ratio 1.333 (h1 54 / h2 40 / h3 30 / body 17 / small 14). Line-height: body 1.65, headings 1.05.
- Rules: Caveat for h1 and h2 only (it runs small, hence the larger sizes); h3 and below in Nunito 700; headings sentence case; no uppercase; line length 62ch.

SHAPE AND SPACE
- Radius 18px, slightly uneven (e.g. 18px 22px 16px 20px) on cards · Borders 2px foreground on interactive elements, 1px border token on dividers · Shadows hard offset 3px 3px 0 foreground (no blur) · Spacing unit 4px, density comfortable · Content width 1040px

IMAGERY (SVG)
- Motif: a paper kite with a looping tail, plus stars, squiggles, and clouds.
- Construction: hand-wobbled paths, 2.5px foreground stroke, round caps and joins; pastel fills deliberately offset 3px from their outlines, like misregistered print. No gradients.
- Produce: hero illustration (1200×600), section divider (1200×32, a looping kite string), pattern tile (96×96, scattered stars and dots), empty-state illustration (320×240, kite caught in a cloud), favicon (32×32, kite diamond), social card (1200×630).
- Icons: 24×24 grid, 2px stroke, round caps and joins, outline with offset pastel fill.

ELEMENTS
- Nav: plain background, wordmark in Caveat, active item circled with a hand-drawn SVG ellipse.
- Buttons: primary peach fill with 2px outline and hard shadow; secondary card fill with 2px outline; ghost text with squiggle underline. Hover shifts 1px up-left; active drops shadow to 1px; focus-visible 3px ring, 2px offset; disabled muted fill, dashed outline.
- Links: foreground color, wavy underline in ring color.
- Cards: card fill, uneven radius, 2px outline; optional "tape" strip in accent at top.
- Inputs: card fill, 2px input outline, ring on focus.
- Code blocks: muted fill, 1px border, mono 14px, 12px radius.

MOTION
- 150ms ease-out with slight overshoot on hover; kite tail sways ±3° over 4s. Turn off under prefers-reduced-motion.

DELIVERABLE
- Tailwind v4. Define tokens as CSS variables on :root and .dark. Expose them with @theme inline { --color-<token>: var(--<token>); } and add --font-display, --font-sans, --font-mono, and --radius-*. Enable class-based dark mode with @custom-variant dark (&:where(.dark, .dark *)); default the class from prefers-color-scheme. Token names follow shadcn/ui; also set --popover and --popover-foreground to the card values, and --secondary and --secondary-foreground to the muted and foreground values.

ACCEPTANCE CHECKS
- Check every text/background pair with a WCAG contrast checker: at least 4.5:1 for body text, 3:1 for large text, UI, and graphics. If a pair fails, change its lightness, not its hue.
- Load only the listed weights, with display=swap and the fallback stacks.
- SVGs are valid, self-contained, accessible (role="img" + <title> when meaningful, aria-hidden when decorative), and under 50 KB each after SVGO.
- Every pastel-filled control has a 3:1 boundary against the page; layout holds from 360px; both themes checked.

- # Paper Kite: production spec (website for `[SUBJECT]`)

This is the full build spec for style 7. Hand the whole thing to your builder agent; it replaces the short brief. Contrast figures are estimates (≈) and are flagged for verification in the checks at the end.

## 1. Token file (`app.css`, Tailwind v4)

````css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #FFFAF3;
  --foreground: #3A2F45;
  --card: #FFFFFF;
  --card-foreground: #3A2F45;
  --popover: #FFFFFF;
  --popover-foreground: #3A2F45;
  --muted: #F6EDE2;
  --muted-foreground: #6B5E78;
  --secondary: #F6EDE2;
  --secondary-foreground: #3A2F45;
  --border: #EBDCCB;
  --input: #86779A;
  --primary: #FFB5A7;
  --primary-hover: #FFA492;
  --primary-foreground: #3A2F45;
  --accent: #C9B6F2;
  --accent-foreground: #3A2F45;
  --ring: #7C5CC4;
  --destructive: #B3261E;
  --success: #2F7D4F;
  --warning: #8A5A00;

  /* Decorative only: never text, never the sole carrier of meaning */
  --deco-mint: #BEE3DB;
  --deco-butter: #FFE8A3;
}

.dark {
  --background: #241C2E;
  --foreground: #F7EFE6;
  --card: #2E2439;
  --card-foreground: #F7EFE6;
  --popover: #2E2439;
  --popover-foreground: #F7EFE6;
  --muted: #382C46;
  --muted-foreground: #BFB0CC;
  --secondary: #382C46;
  --secondary-foreground: #F7EFE6;
  --border: #4A3B5C;
  --input: #8D7BA3;
  --primary: #FFB5A7;
  --primary-hover: #FFC7BC;
  --primary-foreground: #241C2E;
  --accent: #C9B6F2;
  --accent-foreground: #241C2E;
  --ring: #C9B6F2;
  --destructive: #FF8A80;
  --success: #8FD9A8;
  --warning: #FFD27A;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-deco-mint: var(--deco-mint);
  --color-deco-butter: var(--deco-butter);

  --font-display: "Caveat", "Comic Sans MS", "Segoe Print", cursive;
  --font-sans: "Nunito", system-ui, "Segoe UI", sans-serif;
  --font-mono: "Fira Code", ui-monospace, Menlo, monospace;

  --text-small: 0.875rem;
  --text-small--line-height: 1.5;
  --text-body: 1.0625rem;
  --text-body--line-height: 1.65;
  --text-h4: 1.4375rem;
  --text-h4--line-height: 1.3;
  --text-h3: 1.875rem;
  --text-h3--line-height: 1.2;
  --text-h2: clamp(2rem, 1.5rem + 2.2vw, 2.5rem);
  --text-h2--line-height: 1.05;
  --text-h1: clamp(2.5rem, 1.6rem + 4vw, 3.375rem);
  --text-h1--line-height: 1.05;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.125rem;
  --radius-full: 9999px;

  --shadow-hard: 3px 3px 0 var(--foreground);
  --shadow-hard-lg: 4px 4px 0 var(--foreground);
  --shadow-hard-sm: 1px 1px 0 var(--foreground);

  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@utility rounded-wobble {
  border-radius: 18px 22px 16px 20px;
}

@layer base {
  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: 1.65;
  }
  h1, h2 { font-family: var(--font-display); font-weight: 700; }
  h3, h4 { font-family: var(--font-sans); font-weight: 700; }
  :focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; }

  @media (prefers-reduced-motion: no-preference) {
    .pk-kite { transform-origin: 812px 239px; animation: pk-sway 4s ease-in-out infinite alternate; }
  }
  @keyframes pk-sway { from { transform: rotate(-2deg); } to { transform: rotate(2deg); } }
}
````

**Fonts** (only these weights):

````html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fira+Code:wght@400&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
````

**Theme default** (inline in `<head>`, before first paint):

````html
<script>
  (function () {
    var s = localStorage.getItem("theme");
    var d = s ? s === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", d);
  })();
</script>
````

## 2. Type scale (root 16px, base 17px, ratio 1.333)

| Role | rem | px | Family / weight | Line-height | Notes |
|---|---|---|---|---|---|
| h1 | clamp(2.5, fluid, 3.375) | 40–54 | Caveat 700 | 1.05 | Sentence case, max 14 words |
| h2 | clamp(2, fluid, 2.5) | 32–40 | Caveat 700 | 1.05 | |
| h3 | 1.875 | 30 | Nunito 700 | 1.2 | |
| h4 | 1.4375 | 23 | Nunito 700 | 1.3 | |
| body | 1.0625 | 17 | Nunito 400 | 1.65 | Max 62ch |
| label / button | 1 | 16 | Nunito 700 | 1.2 | |
| small | 0.875 | 14 | Nunito 600 | 1.5 | Helper text, captions |
| code | 0.875 | 14 | Fira Code 400 | 1.6 | Ligatures on |

Rules: no uppercase anywhere; Caveat never below 2rem; emphasis is Nunito 700, not italics.

## 3. Shape and space

- Spacing unit 4px. Section padding 96px desktop, 56px mobile. Card padding 24px. Content width 1040px, 20px gutters at 360px.
- Interactive elements: 2px solid `foreground` outline in both modes. Dividers and static containers: 1px `border`.
- Shadows are hard offsets only (`shadow-hard`), never blurred.
- Cards use `rounded-wobble`; buttons and inputs use `radius-full` and `radius-md`.

## 4. Element specs with states

**Buttons** (height 44px, padding 0 20px, `radius-full`, Nunito 700 16px, transition 150ms `ease-bounce` on transform and box-shadow)

| Variant | Default | Hover | Focus-visible | Active | Disabled |
|---|---|---|---|---|---|
| Primary | `primary` fill, `primary-foreground` text, 2px `foreground` outline, `shadow-hard` | `primary-hover` fill, translate(-1px,-1px), `shadow-hard-lg` | Default + 3px `ring` outline, 2px offset | translate(2px,2px), `shadow-hard-sm` | `muted` fill, `muted-foreground` text, 2px dashed `input` outline, no shadow, `cursor: not-allowed` |
| Secondary | `card` fill, `foreground` text, 2px `foreground` outline, `shadow-hard` | `accent` fill, `accent-foreground` text, translate(-1px,-1px) | Same ring | translate(2px,2px), `shadow-hard-sm` | Same as primary disabled |
| Ghost | Transparent, `foreground` text, wavy underline in `ring` (2px, offset 5px) | `muted` fill pill | Same ring | `border` fill | `muted-foreground` text, no underline |
| Destructive | `card` fill, `destructive` text and 2px outline, leading icon | `destructive` at 10% tint fill | Same ring | translate(2px,2px) | Same as primary disabled |

**Links**: `foreground` text, wavy underline in `ring`, thickness 1.5px, offset 4px. Hover: underline becomes solid 2px. Focus-visible: ring, 2px offset, 4px radius. Visited: unchanged. Never color-only.

**Nav**: 64px tall, `background` fill, 1px `border` bottom on scroll. Wordmark in Caveat 700 at 1.75rem. Items Nunito 600. Hover: `muted` pill. Active page: hand-drawn SVG ellipse around the label (2px `foreground` stroke, `aria-hidden`), plus `aria-current="page"`. Mobile under 768px: menu button (secondary style, 44px) opening a full-width `card` sheet.

**Cards**: `card` fill, `rounded-wobble`, 2px `foreground` outline if clickable, otherwise 1px `border`. Optional tape strip: 64×18px `accent` rectangle rotated -4° overlapping the top edge. Clickable hover: translate(-1px,-1px) with `shadow-hard`. Focus-visible: ring on the whole card. Active: translate(1px,1px).

**Inputs** (height 44px, `radius-md`, `card` fill, 2px `input` outline, Nunito 400 17px)

| State | Treatment |
|---|---|
| Default | 2px `input` outline, placeholder in `muted-foreground` |
| Hover | Outline becomes `foreground` |
| Focus-visible | Outline `foreground` + 3px `ring`, 2px offset |
| Filled | Same as default |
| Invalid | 2px `destructive` outline, error icon, helper text in `destructive` with `aria-describedby` |
| Disabled | `muted` fill, dashed `input` outline, `muted-foreground` text |

Labels sit above in Nunito 700 16px. Checkboxes and radios are 22px with 2px `foreground` outline; checked state fills `primary` with a hand-drawn tick or dot in `primary-foreground`.

**Code blocks**: `muted` fill, 1px `border`, `radius-md`, 16px padding, Fira Code 14px. Syntax uses `foreground`, `muted-foreground`, and `ring` only. Inline code: `muted` fill, 4px radius, 2px 6px padding. Copy button is ghost style.

**Status messages**: `card` fill, 2px outline in `success`, `warning`, or `destructive`, matching icon and a text label. Body text stays `foreground`.

## 5. SVG assets

Both SVGs are written for inline use and read the theme tokens through CSS variables, so one source serves both modes. Each variable carries its light hex as fallback. For non-inline contexts (`<img>`, social card, favicon), export two files and replace each `var(...)` with the hex from the token table for that mode.

**Hero** (`hero-kite.svg`, viewBox 1200×600). If it sits beside a text headline and adds no information, swap `role`/`aria-labelledby`/`<title>` for `aria-hidden="true"`.

````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-labelledby="pk-hero-title" fill="none" stroke="var(--foreground,#3A2F45)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <title id="pk-hero-title">A paper kite with a looping tail flying past clouds and stars</title>
  <defs>
    <path id="pk-star" d="M0-14 3.5-4.9 13.3-4.3 5.7 1.9 8.2 11.3 0 6-8.2 11.3-5.7 1.9-13.3-4.3-3.5-4.9Z"/>
    <path id="pk-bow" d="M-13-9 0 0-13 9ZM13-9 0 0 13 9Z"/>
    <path id="pk-cloud" d="M40 80C10 80 0 40 35 35 40 0 95-5 105 30c35-15 65 20 40 45-5 10-95 10-105 5Z"/>
  </defs>

  <!-- clouds -->
  <use href="#pk-cloud" x="113" y="113" fill="var(--muted,#F6EDE2)" stroke="none"/>
  <use href="#pk-cloud" x="110" y="110"/>
  <g transform="translate(950 370) scale(1.15)">
    <use href="#pk-cloud" x="3" y="3" fill="var(--muted,#F6EDE2)" stroke="none"/>
    <use href="#pk-cloud"/>
  </g>

  <!-- stars -->
  <g transform="translate(470 120) rotate(-12)">
    <use href="#pk-star" x="3" y="3" fill="var(--deco-butter,#FFE8A3)" stroke="none"/>
    <use href="#pk-star"/>
  </g>
  <g transform="translate(1080 110) rotate(10) scale(1.4)">
    <use href="#pk-star" x="2" y="2" fill="var(--deco-butter,#FFE8A3)" stroke="none"/>
    <use href="#pk-star"/>
  </g>
  <g transform="translate(600 330) rotate(20) scale(.8)">
    <use href="#pk-star" x="3" y="3" fill="var(--accent,#C9B6F2)" stroke="none"/>
    <use href="#pk-star"/>
  </g>
  <g transform="translate(250 380) rotate(-6) scale(1.1)">
    <use href="#pk-star" x="3" y="3" fill="var(--primary,#FFB5A7)" stroke="none"/>
    <use href="#pk-star"/>
  </g>

  <!-- squiggles, wind curls, dots -->
  <path d="M90 470q12-16 24 0t24 0 24 0 24 0"/>
  <path d="M520 220q10-14 20 0t20 0 20 0"/>
  <path d="M1040 200c30-20 60 10 40 30-14 14-34 0-24-14"/>
  <path d="M380 250c26-18 52 8 36 26-12 12-30 0-22-12"/>
  <g stroke="none">
    <circle cx="330" cy="150" r="5" fill="var(--accent,#C9B6F2)"/>
    <circle cx="560" cy="460" r="6" fill="var(--primary,#FFB5A7)"/>
    <circle cx="1130" cy="300" r="5" fill="var(--deco-mint,#BEE3DB)"/>
    <circle cx="700" cy="90" r="4" fill="var(--deco-mint,#BEE3DB)"/>
    <circle cx="160" cy="300" r="4" fill="var(--deco-butter,#FFE8A3)"/>
  </g>

  <!-- kite + tail -->
  <g class="pk-kite">
    <g stroke="none" transform="translate(5 4)">
      <path d="M820 70 812 239 690 230Z" fill="var(--primary,#FFB5A7)"/>
      <path d="M820 70 960 250 812 239Z" fill="var(--accent,#C9B6F2)"/>
      <path d="M690 230 812 239 800 470Z" fill="var(--deco-mint,#BEE3DB)"/>
      <path d="M812 239 960 250 800 470Z" fill="var(--deco-butter,#FFE8A3)"/>
    </g>
    <path d="M820 70Q893 157 960 250 884 362 800 470 742 352 690 230 752 148 820 70Z"/>
    <path d="M820 70Q814 240 800 470M690 230q122 4 270 20"/>
    <path d="M800 470c-30 70-110 90-160 50-40-32 0-80 36-50 40 34-36 110-136 90-80-16-120-60-180-40s-80 60-140 52"/>
    <g transform="translate(728 536) rotate(-20)">
      <use href="#pk-bow" x="2" y="2" fill="var(--accent,#C9B6F2)" stroke="none"/>
      <use href="#pk-bow"/>
    </g>
    <g transform="translate(540 560) rotate(12)">
      <use href="#pk-bow" x="2" y="2" fill="var(--primary,#FFB5A7)" stroke="none"/>
      <use href="#pk-bow"/>
    </g>
    <g transform="translate(360 520) rotate(-8)">
      <use href="#pk-bow" x="2" y="2" fill="var(--deco-butter,#FFE8A3)" stroke="none"/>
      <use href="#pk-bow"/>
    </g>
  </g>
</svg>
````

**Section divider** (`divider-string.svg`, viewBox 1200×32, decorative). Render at `width: 100%; height: 32px`.

````svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 32" aria-hidden="true" focusable="false" fill="none" stroke="var(--foreground,#3A2F45)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 18C90 8 170 26 260 16c30-4 44-12 34-13s-14 11 6 14c100 11 200-9 300-1 30-4 44-12 34-13s-14 11 6 14c100 11 200-9 290-1 30-4 44-12 34-13s-14 11 6 14c80 9 140-5 190-1"/>
  <path d="M1180 6 1192 17 1179 31 1168 18Z" fill="var(--primary,#FFB5A7)" stroke="none"/>
  <path d="M1178 4 1190 15 1177 29 1166 16Z"/>
  <path d="M1178 4 1177 29M1166 16 1190 15" stroke-width="1.5"/>
</svg>
````

**Remaining assets** (builder produces, same construction rules: 2.5px wobbly `foreground` strokes, round caps and joins, pastel fills offset 3px, no gradients):

- Pattern tile 96×96, seamless: three stars and five dots reusing `pk-star`, decorative.
- Empty state 320×240: the kite caught in a cloud, tail hanging down.
- Favicon 32×32: kite diamond only, 2px stroke, four-color fill, no tail. Ship light and dark files.
- Social card 1200×630: hero composition on `background`, hex values baked in (light mode), headline area left 55%.
- Icons 24×24: 2px stroke, outline with one offset pastel fill shape.

## 6. Motion

- Buttons and cards: 150ms `ease-bounce` on transform and box-shadow.
- Kite: ±2° sway over 4s via `.pk-kite` (already in the token file, gated behind `prefers-reduced-motion: no-preference`).
- Under reduced motion, hover feedback is the fill change only; remove all transforms.

## 7. Acceptance checks

- Run every pair through a WCAG checker. Expected (≈): foreground/background 12:1 light, 14.5:1 dark; muted-foreground/background 5.8:1, 8:1; primary-foreground/primary 7.7:1, 9.8:1; accent-foreground/accent 7.1:1, 9:1; ring/background 5:1, 9:1; input/background 3.8:1, 4.3:1. If one fails, change lightness, not hue.
- `destructive`, `success`, and `warning` are used as text on `background` and `card`; confirm each reaches 4.5:1 in both modes.
- Every pastel-filled control has a 2px `foreground` outline; no pastel is ever a text color.
- Only Caveat 700, Nunito 400/600/700, and Fira Code 400 are loaded, with `display=swap`.
- Both SVGs validate, stay under 50 KB after SVGO (keep `viewBox`, IDs, and `<title>`), and render correctly with `.dark` toggled.
- Layout holds from 360px: h1 does not overflow, hard shadows cause no horizontal scroll, tap targets are at least 44px.
- Keyboard pass: every interactive element shows the 3px ring; active nav item has `aria-current`.

Follow-ups: `mix 7+<n>` · `more like 7` · `expand <n>` for another style.
