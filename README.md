# PortfolioOS

A production-grade engineering portfolio and CMS.

> **Status:** Sprint 06 complete — engineering foundation, design system,
> public landing experience, the interactive Infrastructure Playground, the
> full data-driven Projects module (grid, detail pages, gallery, engineering
> decisions, documentation links, related projects), and the data-driven About
> section. Remaining portfolio sections (Journey, Certifications, …) are
> intentionally **not** built yet.

---

## Overview

PortfolioOS is a full-stack content platform for an engineering portfolio. It
combines a fast, modern frontend with a clean, layered API and a hosted
Postgres database.

This repository is currently at **v0.0.8**. Sprint 01 delivered the
engineering foundation (scaffolding, tooling, CI, a health-checked API),
Sprint 02 delivered the reusable design system (tokens, theme, layout, UI
primitives, cursor, motion utilities), Sprint 03 delivered the public
landing experience (opening sequence, navigation, hero), Sprint 04
delivered the interactive Infrastructure Playground (data-driven pipeline
diagram), Sprint 05 delivered the full Projects module (grid, static detail
pages at `/projects/[slug]`, gallery lightbox, engineering decisions,
documentation links, related projects), and Sprint 06 delivered the
data-driven About section — ready for the remaining portfolio sections.

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | Next.js 15 (App Router) · React 19 · TypeScript         |
| Styling    | Tailwind CSS · shadcn/ui                                |
| Motion     | Framer Motion · Lucide React                            |
| Backend    | FastAPI · Python 3.12+                                  |
| Database   | Supabase (Postgres)                                     |
| Container  | Docker · Docker Compose                                 |
| CI/CD      | GitHub Actions                                          |
| Deploy     | Vercel (frontend) · Railway (backend)                   |

## Repository Layout

```txt
.
├── frontend/            # Next.js 15 application
│   ├── src/
│   │   ├── app/         # App Router routes, layout, metadata
│   │   ├── components/  # ui/ (primitives) + shared/ (layout, cursor, state)
│   │   ├── data/        # infrastructure node data (CMS-ready)
│   │   ├── features/    # feature slices — landing + projects are live
│   │   └── lib/         # utils, site config, motion, theme, profile, layout
│   ├── Dockerfile
│   └── package.json
├── backend/             # FastAPI application
│   ├── app/
│   │   ├── api/         # routers + dependencies
│   │   ├── core/        # settings, logging
│   │   ├── middleware/  # CORS, etc.
│   │   ├── schemas/     # Pydantic request/response contracts
│   │   ├── services/    # business logic (Sprint 02+)
│   │   ├── models/      # database models (Sprint 02+)
│   │   ├── database/    # Supabase/Postgres access (Sprint 02+)
│   │   ├── storage/     # blob/media storage (later)
│   │   └── utils/
│   ├── tests/           # pytest suite
│   ├── Dockerfile
│   └── requirements*.txt
├── .github/workflows/   # CI pipeline
├── docs/                # architecture documentation
└── docker-compose.yml
```

## Local Setup

### Option A — Docker (recommended)

```bash
cp .env.example .env      # optional for the public site; Studio needs secrets (see below)
docker compose up --build
```

- Frontend → http://localhost:3000
- API → http://localhost:8000
- API docs → http://localhost:8000/api/docs
- Health → http://localhost:8000/api/health

### Option B — Manual development

**Frontend**

```bash
cd frontend
npm install
npm run dev              # http://localhost:3000
```

**Backend**

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload       # http://localhost:8000
```

### Studio CMS (private)

Studio (`/studio`) is passphrase-protected. To use it, set two values in `.env`:

```bash
STUDIO_ADMIN_SECRET=...    # the access passphrase  (openssl rand -hex 24)
STUDIO_SESSION_SECRET=...  # signs session cookies  (openssl rand -hex 32)
```

Only these two are required for Studio — everything else has a working default.
The passphrase is compared server-side with a timing-safe comparison and never
stored or sent to the client. See `.env.example` for details.

## Development Workflow

1. **Branch** — feature work happens on a branch off `main`.
2. **Lint & format** — `npm run lint` / `npm run format` (frontend),
   `ruff check .` / `ruff format .` (backend).
3. **Type check** — `npm run typecheck` (frontend).
4. **Test** — `pytest` (backend).
5. **CI** — every push runs lint, type check, tests, and builds on GitHub
   Actions. Keep the pipeline green.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/architecture.md`](docs/architecture.md) for details.


## Releases

- **v1.0.0** – Initial production release
  - Supabase CMS
  - Supabase Storage
  - Vercel deployment
  - Studio content management
  - Responsive portfolio

## Project State

Version **v0.0.8** · Status **About Section Complete** · Milestone **Public
Portfolio Pages**. See [`PROJECT_STATE.md`](PROJECT_STATE.md) and
[`CHANGELOG.md`](CHANGELOG.md).
