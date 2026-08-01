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
  anymore. Media uploads are in Supabase Storage (see below) — once the bucket is
  backfilled, `public/uploads` is only a migration source and can be deleted.

## Media uploads → Supabase Storage (v2.4.0)

Studio uploads (profile photo, project covers/gallery, resume PDF, …) used to be
written to `frontend/public/uploads` and served from disk — which fails on
serverless hosts (Vercel) whose filesystem is read-only (`EROFS`). Since v2.4.0
every upload goes to a public **Storage bucket** (`media`) and the CMS stores the
full public Storage URL, exactly like the rest of the migrated content.

**What changed**

- `src/lib/media/storage.ts` — server-only Supabase Storage wrapper (bucket
  `media`, public, 10 MB cap). `uploadFile` / `listFiles` / `deleteFile` /
  `getPublicUrl`.
- `/api/studio/media` (GET/POST) and `/api/studio/media/[name]` (DELETE) use
  Storage; no `fs` reads or writes remain.
- `/uploads/[name]` now 308-redirects to the object's public Storage URL. It
  exists only to keep previously-saved `/uploads/…` references working — new
  uploads store full Storage URLs and never hit it.
- `npm run seed:media` backfills legacy `public/uploads/*` files into the bucket
  (additive — safe to re-run).

### 5. Backfill legacy uploads

From `frontend/`:

```
npm run seed:media
```

Uploads every file in `public/uploads` into the `media` bucket under the same
name, so existing CMS rows that still reference `/uploads/<uuid>.<ext>` keep
rendering (via the redirect route). Additive: files already in the bucket are
left untouched. Once it succeeds, `public/uploads` can be removed —
`git rm -r public/uploads`.

No other setup is needed: the bucket is created automatically on first upload
(`ensureBucket`).

## RLS model

| Role          | Access                                                       |
| ------------- | ------------------------------------------------------------ |
| `service_role`| Full CRUD (used by the Next.js store; bypasses RLS)          |
| `anon`        | `SELECT` of `status = 'published'` rows only                 |
| `authenticated`| None (Studio uses a passphrase session, not Supabase Auth)  |

All INSERT/UPDATE/DELETE are revoked from `anon`/`authenticated`; grants are
explicit in `supabase/schema.sql`.
