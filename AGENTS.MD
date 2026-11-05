# AGENTS.md

Root contract for every agent: Cursor (Auto, Grok, Composer), Codex, Gemini, Claude, others.
Pair: `AGENTS.md` + `CLAUDE.md` (same rules, Claude-specific hands). All other markdown lives in `docs/`.

## Project in 5 lines

TradeFlow — B2B distribution CRM (Uzbek UI). Warehouses, products, stock, clients (credit limit + balance), orders, deliveries, payments, audits, field agents, leads, insight agents.
Stack **LOCKED** (`docs/STACK.md`): Next.js 16 + Tailwind v4 · Express 5 + zod · PostgreSQL 16 raw SQL · Docker Compose.
Run: `docker compose up --build` → UI `http://localhost:3001`, API `http://localhost:4000/api/v1`, health `/health`.
Logins: `admin/admin123` · demo (`demo123`): `manager`, `courier1..3`, `auditor1..2`, agents from `backend/src/core/seed.ts`.
Checks: `npm run typecheck` in `frontend/` and `backend/`. UI tests: `docs/TESTING.md`.

## Boot (every session)

1. Read this file. Voice = caveman (below). Hands = `docs/STRICT.md`.
2. `docs/ORCHESTRATION.md` → pick one `[ ]` in `docs/TASKS.md` (or the explicit user task) → mark `[~]`.
3. Route with `docs/skills/00-router.md` → open **one** domain file + at most **one** skill.
4. Grep → small reads → plan (`docs/skills/02-architect.md` for any new write-path) → edit → verify → report.
5. Mark `[x]` (or `[!]` + reason). Stop.

## Read map

| Need | Open |
|---|---|
| Session flow, handoff | `docs/ORCHESTRATION.md` |
| What is allowed | `docs/STRICT.md` |
| Voice / report | `docs/CAVEMAN.md` + `.agents/skills/caveman/SKILL.md` |
| Stack lock, commands | `docs/STACK.md` |
| Modules, invariants | `docs/ARCHITECTURE.md` |
| API work | `docs/BACKEND.md` |
| UI / SEO work | `docs/FRONTEND.md` |
| Tests (UI 3×3 matrix) | `docs/TESTING.md` + `docs/skills/04-ui-testing.md` |
| Lighthouse 100 | `docs/skills/03-lighthouse.md` |
| Ship | `docs/DEPLOY.md` |
| Queue | `docs/TASKS.md` |

Do not open `BACKEND.md` and `FRONTEND.md` in one turn unless the task spans both (e.g. new module end-to-end).

## Skills

| Skill | Use when |
|---|---|
| `docs/skills/00-router.md` | Start of every task: map request → files |
| `docs/skills/01-caveman.md` | Always on: voice + report shape |
| `docs/skills/02-architect.md` | New endpoint, table, page, or state change |
| `docs/skills/03-lighthouse.md` | Public page touched (`/`, `/login`) or Lighthouse asked |
| `docs/skills/04-ui-testing.md` | Any test task, any UI change that needs proof |
| `.agents/skills/caveman/SKILL.md` | Installed caveman voice (also `.claude/skills/caveman`) |

Installed skills live in `.agents/skills/<name>/SKILL.md` (Cursor, Codex) and are symlinked into `.claude/skills/` (Claude Code). Lockfile: `skills-lock.json`; restore with `npx skills experimental_install`. Open at most one per task, after the router.

| Installed skill | Source | Use when |
|---|---|---|
| `playwright-cli` | microsoft/playwright-cli | Drive a real browser from the terminal: screenshots, click-through checks, debugging a UI test (pairs with `04-ui-testing`) |
| `penetration-testing-with-strix` | usestrix/strix | Security scan / pentest of the API or UI with Strix (needs permit: Docker + LLM key or Strix cloud) |
| `fix-security-vulnerabilities-with-strix` | usestrix/strix | Patch findings from a Strix report and re-run to prove the fix |
| `baseline-ui` | ibelick/ui-skills | Any UI change: spacing, type, states baseline (UI Skills) |
| `fixing-accessibility` | ibelick/ui-skills | Labels, focus, contrast, keyboard fixes (Lighthouse a11y < 100) |
| `fixing-metadata` | ibelick/ui-skills | Titles, canonical, OG, robots, JSON-LD (Lighthouse SEO < 100) |
| `fixing-motion-performance` | ibelick/ui-skills | Janky animation, scroll-linked motion, blur cost, TBT from motion |
| `frontend-design` | anthropics/skills | Redesign of a public page: art direction, type, layout plan |
| `design-taste-frontend` | leonxlnx/taste-skill | Polishing visual taste on landing / marketing sections |
| `glassmorphism` | bergside/awesome-design-skills | Glass surfaces (`.glass`, `.glass-dark` in `globals.css`) |
| `gsap-framer-scroll-animation` | github/awesome-copilot | Scroll-linked effects with `motion` (zoom-in sections, pinned horizontal rails). Use `motion` only; no GSAP |
| `web-design-guidelines` | vercel-labs/agent-skills | Review UI code against web interface guidelines |

## Caveman (always on)

Chat replies follow `.agents/skills/caveman/SKILL.md` from the first message. Off only on `stop caveman` / `normal mode`.
Reply in the user's language (usually Uzbek). Code, docs, commits, comments: normal full prose — caveman is chat-only.
End every task with the report from `docs/CAVEMAN.md`: `Did` / `Files` / `Check` / `Next`.

## Hard rules

1. One session = one task. Fat chat → new session.
2. Prompt = allow-list. Undeclared git, install, deploy, delete, Docker, secrets → `Need permit: <thing>.` Stop.
3. Staff code: `router → service → repository`; `app/` thin → `features/<domain>` → `shared/ui`. No extra layers, no drive-by refactor, no new package without permit.
4. Invariants in `docs/ARCHITECTURE.md` never break (stock never negative, credit limit, order state machine, audit approve).
5. Done = typecheck green + task-relevant tests green (UI: 3 states × 3 runs, `docs/TESTING.md`) + Lighthouse 100 on touched public URL.
6. Never claim done without running the check. Can't run it → say so in `Check`.
7. Next.js 16 differs from training data: read `frontend/AGENTS.md` and `frontend/node_modules/next/dist/docs/` before new Next APIs.
