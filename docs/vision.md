# Vision — Paper Kite

## One line

A gentle, personal page that hands me one good quote every time I open it —
drawn from the people I actually follow.

## Why

I collect ideas from people like Tim Ferriss and Derek Sivers, but they end up
scattered across notes, books and podcasts. I want one calm place that surfaces
them back to me, a little at a time, in a design that feels like a sketchbook
rather than a dashboard.

## Who it's for

1. **Me first.** A single-user personal page (Tasks 1–3).
2. **Then others.** A small lifestyle app where anyone can sign up, follow their
   own people and get their own daily quote (Task 4).

## What it feels like

Playful, gentle, personal — picture-book endpapers, washi tape, a paper kite.
Never childish, saccharine or messy. Friendly first-person microcopy, light
humour, short. Full spec: `docs/style_guide.md`.

## Core experience

- Open the home page → one motivational quote, beautifully set, with its author.
- A small "another one" action to shuffle.
- Nothing else competing for attention.

## How it grows

| Stage | Capability | Source of quotes |
|---|---|---|
| V1 (Task 1) | Show quotes on the home page | Static list I paste in |
| Task 2 | Agent suggests new quotes from people I follow | Static "people" list → LLM + web search → reviewed suggestions |
| Task 3 | Password-gated settings page to edit lists and run the agent in the browser | Editable store |
| Task 4 | Multi-user accounts (Google, Apple, email/password via Better Auth) | Per-user lists |

Details and order: `docs/roadmap.md`.

## Principles

- **Ship small, ship often.** Each task is usable on its own.
- **Human in the loop.** The agent suggests; I approve. No quote goes live
  without a yes.
- **Attribution matters.** Every quote carries its author, and agent-found quotes
  carry a source URL so they can be checked.
- **Accessible by default.** WCAG contrast, keyboard friendly, reduced motion
  respected, works from 360px.

## Non-goals (for now)

Social feeds, likes/comments, push notifications, native apps, payments.
