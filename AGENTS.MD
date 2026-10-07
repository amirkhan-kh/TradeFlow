# AGENTS.md

Root file. **Not** inside `docs/`. Pair: `AGENTS.md` + `CLAUDE.md` + `docs/`.

Any agent: Cursor Auto, Codex, Grok, Gemini, Cursor Grok, others. Read this first. Then **one** file under `docs/`.

## First prompt

`docs/STACK.md` is `UNLOCKED` until the user names `react` | `next` | `vue` | `astro` (+ backend if any). Write the lock. No scaffold before lock. No framework switch later.

## Read map

| Need | Open |
|---|---|
| Session | `docs/ORCHESTRATION.md` |
| Extra commands | `docs/STRICT.md` |
| Short voice | `docs/CAVEMAN.md` |
| Stack / folders | `docs/STACK.md` |
| System | `docs/ARCHITECTURE.md` |
| API | `docs/BACKEND.md` |
| UI / SEO | `docs/FRONTEND.md` |
| Lighthouse 100 | `docs/skills/03-lighthouse.md` |
| Tests | `docs/TESTING.md` |
| Ship | `docs/DEPLOY.md` |
| Queue | `docs/TASKS.md` |

Do not read BACKEND and FRONTEND in one turn unless the user asked both.

## Rules

1. One session = one `docs/TASKS.md` item (or one explicit user task).
2. Prompt = allow-list. No undeclared git, install, deploy, delete. Say `Need permit: …` and stop.
3. Reply caveman: `Did` / `Files` / `Next`.
4. Staff/architect code. No extra layers. No drive-by refactor.
5. Lighthouse 100 on the URL you touch.

Optional one skill: `docs/skills/00-router.md` · `01-caveman.md` · `02-architect.md` · `03-lighthouse.md`.