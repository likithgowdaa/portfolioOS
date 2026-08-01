# Contributing to PortfolioOS

Thanks for helping! This is a small, standards-first project — here is how to
keep it that way.

## Getting Started

1. Read [`README.md`](README.md) for setup instructions.
2. Read [`PROJECT_STATE.md`](PROJECT_STATE.md) to see the current sprint and
   what is explicitly out of scope.
3. Create a feature branch off `main`.

## Development Loop

| Step      | Frontend (`cd frontend`)        | Backend (`cd backend`)          |
| --------- | ------------------------------- | ------------------------------- |
| Install   | `npm install`                   | `pip install -r requirements-dev.txt` |
| Serve     | `npm run dev`                   | `uvicorn app.main:app --reload` |
| Lint      | `npm run lint`                  | `ruff check .`                  |
| Format    | `npm run format:check`          | `ruff format --check .`         |
| Type      | `npm run typecheck`             | —                               |
| Test      | —                               | `pytest`                        |

## Before Opening a PR

- [ ] Lint passes (frontend + backend).
- [ ] Type check passes (frontend).
- [ ] Tests pass (backend).
- [ ] Production builds succeed (`npm run build`).
- [ ] New code follows the existing folder structure and conventions in
      [`CLAUDE.md`](CLAUDE.md) — no placeholder files or dead code.

## Commits

Keep commits focused and messages descriptive. CI runs on every push, so keep
the pipeline green.

## Scope

Do not implement features that belong to a scheduled sprint (Hero, Navbar,
Projects, Studio, auth, analytics, …) unless the current sprint calls for
them — check [`PROJECT_STATE.md`](PROJECT_STATE.md) first.
