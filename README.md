# AI Workbench (`aiw`)

A local CLI for tracking and optimizing how you use AI coding tools — ChatGPT Plus, Claude Code, Cursor, and GitHub Copilot.

The goal is to **route real work to the best tool** and keep a lightweight record of what you used and why, so you can make better decisions over time.

---

## Philosophy

- Usage tracking is **manual and intentional** — no scraping, no fake activity, no automation.
- Recommendations are based on **legitimate work routing**, not subscription optimization tricks.
- Data lives entirely on your machine (`~/.ai-workbench/workbench.db`).

---

## Tool routing

| Task type      | Recommended tool  | Reason |
|----------------|-------------------|--------|
| implementation | **claude-code**   | Multi-file repo changes with broad context |
| refactor       | **cursor**        | In-editor agent/refactor over open files |
| boilerplate    | **github-copilot**| Fast inline completions for repetitive scaffolding |
| architecture   | **chatgpt**       | High-level design discussion and tradeoff analysis |
| debugging      | **chatgpt**       | Reasoning through error chains and hypotheses |
| docs           | **chatgpt**       | Well-structured prose for different audiences |
| review         | **chatgpt**       | Thorough review commentary and logical issue detection |
| general        | **claude-code**   | Broad capability default |

---

## Setup

```bash
npm install
```

Run commands in dev mode with `tsx` (no build step needed):

```bash
npm run dev -- <command>
# or alias it locally:
alias aiw="NODE_NO_WARNINGS=1 npx tsx /path/to/ai-workbench/src/cli.ts"
```

> `node:sqlite` is marked experimental in Node 22–25. `NODE_NO_WARNINGS=1` suppresses that noise; remove it if you want to see all node warnings.

To build and install globally:

```bash
npm run build
npm link
aiw --help
```

---

## Commands

### `aiw task create`

```bash
aiw task create --title "Scaffold auth module" --type implementation
aiw task create --title "Write API docs" --type docs --description "OpenAPI 3 spec"
aiw task create \
  --title "Scaffold auth module" \
  --type implementation \
  --tool claude-code \
  --outcome "Initial auth module generated"
```

Options: `--title` (required), `--type` (default: `general`), `--description`, `--tool`, `--outcome`

Valid tools: `chatgpt`, `claude-code`, `cursor`, `github-copilot`, `manual`, `other`

### `aiw task list`

```bash
aiw task list
aiw task list --status in_progress
aiw task list --tool claude-code
```

### `aiw task start`

```bash
aiw task start --id 3 --tool claude-code
```

Marks the task `in_progress` and records which tool you're using.

### `aiw task finish`

```bash
aiw task finish --id 3 --outcome "Auth module scaffolded, tests passing"
```

Marks the task `done` with a short outcome note.

### `aiw task delete`

```bash
aiw task delete --id 4
```

Permanently removes the task from the database.

### `aiw usage snapshot`

```bash
# Record a snapshot manually after a work session
aiw usage snapshot --record --tool claude-code --period "2024-06-W1" --tasks 4 --notes "Finished API layer"

# List recent snapshots
aiw usage snapshot
```

### `aiw recommend`

```bash
# See all routing rules
aiw recommend

# Get a recommendation for a specific task type
aiw recommend --type debugging
```

---

## Development

```bash
npm test          # run tests once
npm run test:watch  # watch mode
npm run typecheck   # type-check without emitting
```

---

## Data model

```
tools             — chatgpt | claude-code | cursor | github-copilot
tasks             — title, type, status, tool used, outcome, timestamps
usage_snapshots   — manual records of tasks done per tool per period
recommendations   — log of recommendations generated (future use)
```

Database: `~/.ai-workbench/workbench.db` (SQLite, created automatically on first run).
