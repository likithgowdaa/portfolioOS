# PortfolioOS — Architecture Notes

Sprint 01 establishes the engineering foundation. This document records the
key decisions so future sprints stay consistent.

## 1. Monorepo Layout

A single repository hosts both applications and all shared infrastructure.

```txt
frontend/   Next.js 15 application (Vercel)
backend/    FastAPI application (Railway)
docker-compose.yml   local orchestration
.github/    CI pipeline
docs/       architecture documentation
```

**Decision:** one repo. The frontend and backend evolve together, CI is
unified, and `docker compose up` runs the whole stack locally. A separate
repo per service would add coordination overhead without benefit at this scale.

## 2. Frontend Architecture

### Framework

- Next.js 15 App Router with React 19 and TypeScript (strict).
- Tailwind CSS v4 (CSS-first configuration, `@theme` tokens).
- shadcn/ui (Base UI primitives) for the design-system layer.
- Framer Motion and Lucide React installed and ready for feature sprints.

### Folder Structure

```txt
src/
  app/           App Router routes; layout + metadata + static routes
  components/
    ui/          shadcn primitives (Button, ...) — added via `shadcn add`
    shared/      reusable, cross-feature components (e.g. ThemeProvider)
  features/      feature slices — one folder per portfolio section
  lib/           helpers and site configuration
```

- **Features are slices:** each feature owns its `components/`, `hooks/`, and
  `data/`, and exposes only a public `index.ts`. Features depend on `ui`/`lib`
  and never on each other. This keeps sections independent and removable.
- **Themes:** class-based dark/light switching via next-themes. All tokens are
  CSS variables in `globals.css` (see `:root` and `.dark`). No hard-coded
  colors in components.

## 3. Backend Architecture

FastAPI with a layered, clean-architecture layout:

```txt
app/
  api/          routers (HTTP) and dependencies
  core/         settings, logging
  schemas/      Pydantic contracts — the API surface
  services/     business logic (thin routers delegate here)
  models/       persisted data model (Supabase/Postgres)
  middleware/   ASGI middleware (CORS)
  database/     DB access / repositories
  storage/      blob & media storage
  utils/        small shared helpers
```

**Decision:** routers stay thin. Business rules live in `services`, and data
access in `database`/`models`. Schemas are explicit contracts — internal
models never leak to the API.

**Sprint 02 wiring:** `models/`, `services/`, and `database/` are defined as
packages now but contain no implementation yet. They will be filled when
Supabase is connected.

## 4. Health Endpoint

`GET /api/health` → `200 {"status":"healthy"}`

Served by `app/api/routers/health.py`, mounted under `/api`. It is the
liveness probe used by Docker's `HEALTHCHECK` and, later, by orchestrators.

## 5. Configuration

Settings are environment-driven end to end:

- Frontend reads `NEXT_PUBLIC_*` variables (browser-exposed by design).
- Backend reads typed settings via pydantic-settings (`app/core/config.py`).
- `docker compose` interpolates the root `.env` file.

`.env.example` documents every variable. Secrets are never committed and never
put in the repository.

## 6. Docker & Local Dev

- Frontend image: multi-stage; deps → build (`output: "standalone"`) → slim
  non-root runtime.
- Backend image: multi-stage; `pip install --prefix` → slim non-root runtime
  with a healthcheck.
- `docker compose up --build` starts both with port mappings `3000` / `8000`.

## 7. CI

`.github/workflows/ci.yml` runs on every push/PR to `main`:

- Frontend: `npm ci` → lint → typecheck → build.
- Backend: `pip install` → ruff → pytest → import/build check.

No deployment step yet — deployment (Vercel/Railway) lands in a later sprint.

## 8. Explicitly Deferred (Sprint 01)

Hero, Navbar, Projects, Studio, authentication, analytics, resources, theme
UI, portfolio pages, and animations are **not** built in Sprint 01. The
foundation above is scoped so those land cleanly in Sprint 02+.
