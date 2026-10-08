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
