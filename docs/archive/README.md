# Archive

The audit trail of completed tasks, oldest first. Each file is a frozen copy
of the task exactly as it was planned in `docs/tasks.md` (boxes ticked). It
also records what shipped, the decisions made during the build, and the
verification evidence. Don't edit an archived file after its PR merges. If
something changes later, record it in the task that changed it.

| # | Task | Completed | Branch | PR | File |
|---|---|---|---|---|---|
| 1 | Quotes on the home page (MVP V1) | 2026-10-08 | `god/laughing-pasteur-q8do3e` | [oreillyross/motivation#2](https://github.com/oreillyross/motivation/pull/2) | [2026-10-08-task1-quotes-home-page.md](2026-10-08-task1-quotes-home-page.md) |
| – | Micro edit: rename to Motivation, quote first | 2026-10-08 | `god/sleepy-ramanujan-ncyqn9` | – | [2026-10-08-micro-edit-motivation-quote-first.md](2026-10-08-micro-edit-motivation-quote-first.md) |
| 2 | Agent-suggested quotes from people I follow | 2026-10-09 | `god/eloquent-lamport-2eshsr` | [oreillyross/motivation#4](https://github.com/oreillyross/motivation/pull/4) | [2026-10-09-task2-agent-suggested-quotes.md](2026-10-09-task2-agent-suggested-quotes.md) |
| – | Automation: add quotes when people.txt changes | 2026-10-09 | `god/eloquent-lamport-2eshsr` | [oreillyross/motivation#5](https://github.com/oreillyross/motivation/pull/5) | [2026-10-09-automation-suggest-quotes-action.md](2026-10-09-automation-suggest-quotes-action.md) |
| – | Micro edit: Anthropic or OpenAI provider | 2026-10-09 | `god/eloquent-lamport-2eshsr` | [oreillyross/motivation#5](https://github.com/oreillyross/motivation/pull/5) | [2026-10-09-micro-edit-openai-provider.md](2026-10-09-micro-edit-openai-provider.md) |
| – | Micro edit: Space bar shows another quote | 2026-10-09 | `god/eloquent-lamport-2eshsr` | [oreillyross/motivation#6](https://github.com/oreillyross/motivation/pull/6) | [2026-10-09-micro-edit-spacebar-next-quote.md](2026-10-09-micro-edit-spacebar-next-quote.md) |
| – | Micro edit: Import quotes from Wikiquote | 2026-10-09 | `god/great-turing-tlv0f9` | – | [2026-10-09-micro-edit-wikiquote-import.md](2026-10-09-micro-edit-wikiquote-import.md) |

## How to archive a task

1. Tick every box in `docs/tasks.md`.
2. Copy the task into `docs/archive/YYYY-MM-DD-taskN-<slug>.md`. Add a header
   table (status, date, branch, PR), then **What shipped**, **Decisions** and
   **Verification**.
3. Add a row to the table above.
4. Mark the task done in `docs/roadmap.md` and link the archive file.
5. Replace `docs/tasks.md` with the next task from the roadmap, broken into steps.
