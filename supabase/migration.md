# Migrating the CMS store from JSON to Supabase

The Studio CMS used to persist every entity in a local JSON file
(`frontend/data/cms/store.json`). This migration moves the persistence layer to
Supabase. The store API, the Studio UI, the public site, the draft/publish
lifecycle, ordering, and CRUD behavior are unchanged — only where the data lives
is different.

**What changed**

- `frontend/src/lib/cms/store.ts` now reads and writes Supabase through a
  server-side `service_role` client (`frontend/src/lib/supabase/server.ts`).
  No filesystem persistence remains for CMS content.
- 8 tables mirror the store shape: singles `profile`, `resume`, `contact`,
  `footer`, `seo` (one row each) and collections `projects`, `journey`,
  `certifications` (one row per item).
- RLS is enabled on every table: the public `anon` key can only read
  *published* rows; all writes are reserved for `service_role` (server-side).

## Prerequisites

1. **Supabase service role key.** Not the same as the anon key. Get it at
   Supabase Dashboard → **Settings → API → Project API keys → `service_role`**.
   It is a secret — it must never ship to the browser. The server-only store is
   the only consumer.
2. A database connection. Apply the schema in the **Dashboard → SQL Editor**,
   or from the repo root with psql:
   `psql "$DATABASE_URL" -f supabase/schema.sql`

## Steps

### 1. Apply the schema

Run `supabase/schema.sql` (SQL Editor or psql). It is idempotent — safe to re-run.

### 2. Configure the environment

The frontend reads `frontend/.env`:

```
SUPABASE_URL=<project url>                     # e.g. https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # from Settings → API
```

For Docker deployments, add the same two variables to the root `.env` (used by
`docker-compose.yml`, which passes them to the frontend container).

### 3. Seed the existing content

`store.json` is kept on disk as the seed source (git-ignored). From `frontend/`:

```
npm run seed:cms
```

This imports every entity from `frontend/data/cms/store.json`. It is **additive**:
rows that already exist are left untouched, so it never overwrites Studio edits
and is safe to re-run.

### 4. Verify

- `cd frontend && npm run typecheck && npm run lint && npm run build` — passes
  without any env vars/network (reads degrade to the default store).
- `npm run dev` → sign in to `/studio` → every editor loads the seeded content.
- Save Draft / Publish / hide / archive / reorder / delete round-trip through
  Supabase; the public site reflects publishes immediately (home page is dynamic).
- Studio stays functional only when `SUPABASE_SERVICE_ROLE_KEY` is set. Without
  it, the public site renders defaults and Studio writes fail — the same
  fail-open/fail-closed behavior as the old file store missing its file.

## Rollback / cleanup

- **Rollback:** point the store back at the JSON file (restore the previous
  `store.ts`) — nothing about Supabase blocks a revert.
- **Cleanup:** once the seed is confirmed, the local `data/cms/store.json` is
  just a backup. Keep it for reference or delete it; the app never reads it
  anymore. Media uploads (`public/uploads`) are intentionally still file-backed —
  migrating those to Supabase Storage is a separate task.

## RLS model

| Role          | Access                                                       |
| ------------- | ------------------------------------------------------------ |
| `service_role`| Full CRUD (used by the Next.js store; bypasses RLS)          |
| `anon`        | `SELECT` of `status = 'published'` rows only                 |
| `authenticated`| None (Studio uses a passphrase session, not Supabase Auth)  |

All INSERT/UPDATE/DELETE are revoked from `anon`/`authenticated`; grants are
explicit in `supabase/schema.sql`.
