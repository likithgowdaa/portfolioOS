# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## Repository

- **Monorepo:** `frontend/` (Next.js 15) + `backend/` (FastAPI) + shared
  Docker/CI/docs at the root.
- **Project state:** always read `PROJECT_STATE.md` before making changes.
- **Version:** v0.0.1. Current sprint is tracked in `PROJECT_STATE.md`.

## Commands

Frontend (`cd frontend`):

- `npm run dev` — development server
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — production build (standalone output)
- `npm run format` / `npm run format:check` — Prettier

Backend (`cd backend`, `.venv` active):

- `uvicorn app.main:app --reload` — development server
- `ruff check .` / `ruff format .` — lint / format
- `pytest` — test suite

## Architecture Rules

- **Feature-slice frontend:** features live under `src/features/<feature>/`
  with `components/`, `hooks/`, `data/`, and a public `index.ts`. Features
  import from `src/components/ui` and `src/lib` only — never each other.
- **Clean-architecture backend:** routers stay thin; business logic belongs in
  `app/services`; API contracts in `app/schemas`; data access in
  `app/database`/`app/models`. Follow the existing pattern.
- **Dark/light theme:** class-based via next-themes. Theme tokens are the CSS
  variables in `src/app/globals.css` (`.dark` variant). Do not hard-code colors.
- **shadcn/ui:** primitives in `src/components/ui`, added via `shadcn add`.
  Reusable composition goes in `src/components/shared`.
- **Design system:** never hard-code values — consume tokens/utilities from
  `globals.css` (see `docs/design-system.md`). Typography tiers are
  `text-display|heading|title|body|caption` (+ muted color). Use the semantic
  z-index tokens (`z-modal`, `z-cursor`, …), not raw numbers.
- **Motion:** JS variants live in `src/lib/motion.ts`; CSS keyframes/tokens in
  `globals.css`. Respect `prefers-reduced-motion`; the global collapse is in
  `globals.css`.
- **State components:** use `EmptyState` / `LoadingState` / `ErrorState` from
  `src/components/shared` for async UI; they carry the a11y roles.
- **Custom cursor:** mounted in the root layout. Use `data-cursor="hover|
  clickable|text|loading|none"` to opt elements in; it auto-disables on touch
  and reduced motion.

## Scope Discipline

The following are **not implemented and must not be added without a scheduled
sprint**: Hero, Navbar, Projects, Journey, About, Studio, Authentication,
Analytics, Resources, Theme UI toggle, animations on pages, portfolio content.
Sprints 01–02 delivered the engineering foundation and the design system only.

- No placeholder folders, no empty scaffolding, no dead code.
- Only production-ready, real files.
- Keep `docker compose up` working.
