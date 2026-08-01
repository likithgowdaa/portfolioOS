-- ─────────────────────────────────────────────────────────────────────────────
-- PortfolioOS CMS — Supabase schema
--
-- Replaces the file-backed CMS store (`frontend/data/cms/store.json`). One table
-- per CMS entity, mirroring the `CmsStore` shape from `frontend/src/lib/cms`:
-- singles (profile, resume, contact, footer, seo) hold one row each; collections
-- (projects, journey, certifications) hold one row per item.
--
-- RLS model: the Next.js server writes through the `service_role` key (bypasses
-- RLS). RLS is enabled everywhere as a defensive layer — the public `anon` key can
-- only read *published* rows; every write is revoked from anon/authenticated.
--
-- Idempotent: safe to run more than once. The enum is created inside a guarded
-- DO block (CREATE TYPE has no IF NOT EXISTS), and policies use drop-then-create
-- (CREATE OR REPLACE POLICY is avoided for compatibility).
--
-- Apply in the Supabase Dashboard → SQL Editor, or from the repo root:
--   psql "$DATABASE_URL" -f supabase/schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- Publish lifecycle, matching the `CmsStatus` union in `cms/types.ts`.
-- CREATE TYPE does not support IF NOT EXISTS, so guard with an exception.
do $$
begin
  create type public.cms_status as enum ('draft', 'published', 'hidden', 'archived');
exception
  when duplicate_object then null;
end $$;

-- ── Singles ───────────────────────────────────────────────────────────────────
-- One row per entity (`id = 1` enforced). `data` is the published content the
-- public site renders; `draft` holds unpublished edits (null = data is current).

create table if not exists public.profile (
  id           integer primary key default 1 check (id = 1),
  status       public.cms_status not null default 'draft',
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.resume (
  id           integer primary key default 1 check (id = 1),
  status       public.cms_status not null default 'draft',
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.contact (
  id           integer primary key default 1 check (id = 1),
  status       public.cms_status not null default 'draft',
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.footer (
  id           integer primary key default 1 check (id = 1),
  status       public.cms_status not null default 'draft',
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.seo (
  id           integer primary key default 1 check (id = 1),
  status       public.cms_status not null default 'draft',
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

-- ── Collections ───────────────────────────────────────────────────────────────
-- One row per item. `sort_order` preserves the JSON `order` field (1-based,
-- ascending); the public site renders published items in this order.

create table if not exists public.projects (
  id           text primary key,
  status       public.cms_status not null default 'draft',
  sort_order   integer not null default 1,
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.journey (
  id           text primary key,
  status       public.cms_status not null default 'draft',
  sort_order   integer not null default 1,
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.certifications (
  id           text primary key,
  status       public.cms_status not null default 'draft',
  sort_order   integer not null default 1,
  data         jsonb not null,
  draft        jsonb,
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

-- Ordered reads (public: published → sort_order; studio: any status → sort_order).
create index if not exists projects_order_idx       on public.projects      (status, sort_order);
create index if not exists journey_order_idx        on public.journey       (status, sort_order);
create index if not exists certifications_order_idx on public.certifications (status, sort_order);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- `service_role` (used by the Next.js store) bypasses RLS — no policies needed.
-- `anon` may only SELECT published rows; all writes are revoked for every
-- non-service role. No Supabase Auth is used by Studio (passphrase session), so
-- the `authenticated` role is locked down too.

alter table public.profile        enable row level security;
alter table public.resume         enable row level security;
alter table public.contact        enable row level security;
alter table public.footer         enable row level security;
alter table public.seo            enable row level security;
alter table public.projects       enable row level security;
alter table public.journey        enable row level security;
alter table public.certifications enable row level security;

-- Drop-then-create keeps the policies idempotent on re-runs.
do $$
declare
  t text;
begin
  foreach t in array array['profile','resume','contact','footer','seo','projects','journey','certifications']
  loop
    execute format('drop policy if exists "anon_read_published" on public.%I', t);
    execute format('create policy "anon_read_published" on public.%I for select to anon using (status = ''published'')', t);
    -- Strip the default full grants Supabase applies to new tables.
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon', t);
  end loop;
end $$;
