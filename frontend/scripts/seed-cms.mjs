#!/usr/bin/env node
/**
 * Seed Supabase with the existing CMS store (`data/cms/store.json`).
 *
 * Usage (from `frontend/`):
 *   npm run seed:cms                       # imports frontend/data/cms/store.json
 *   npm run seed:cms -- path/to/store.json # imports a specific file
 *
 * Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (loaded from
 * `frontend/.env`). The service role key is required because the store writes
 * through the server-side client.
 *
 * The seed is additive and safe to re-run: rows that already exist are left
 * untouched (`ignoreDuplicates`), so it never overwrites content edited in
 * Studio after a previous seed. Apply `supabase/schema.sql` first.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

// Load frontend/.env (Next.js style) when the vars are not already in the env.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    process.loadEnvFile(path.join(process.cwd(), ".env"));
  } catch {
    // .env is optional; the check below reports the missing vars.
  }
}

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error(
    "Missing Supabase config. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in frontend/.env\n" +
      "(service role key: Supabase Dashboard → Settings → API → service_role)."
  );
  process.exit(1);
}

const storePath = process.argv[2] ?? path.join(process.cwd(), "data", "cms", "store.json");

let store;
try {
  store = JSON.parse(await readFile(storePath, "utf8"));
} catch (error) {
  console.error(`Cannot read ${storePath}: ${error.message}`);
  console.error(
    "The store file is written on first Studio use and is git-ignored. If it does not\n" +
      "exist yet, open /studio once (any save) so defaults are persisted, then re-run."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

const SINGLES = ["profile", "resume", "contact", "footer", "seo"];
const COLLECTIONS = ["projects", "journey", "certifications"];

/** Normalize a timestamp to an ISO string (null stays null). */
function toIso(value) {
  if (value == null) return null;
  return new Date(value).toISOString();
}

async function fail(message, hint) {
  console.error(`✖ ${message}`);
  if (hint) console.error(`  → ${hint}`);
  process.exit(1);
}

let inserted = 0;
let skipped = 0;

for (const name of SINGLES) {
  const entity = store[name];
  if (!entity) {
    console.warn(`  skip ${name}: not present in ${storePath}`);
    continue;
  }
  const { count, error } = await supabase
    .from(name)
    .upsert(
      {
        id: 1,
        status: entity.status,
        data: entity.data,
        draft: entity.draft,
        updated_at: toIso(entity.updatedAt),
        published_at: toIso(entity.publishedAt),
      },
      { onConflict: "id", ignoreDuplicates: true }
    )
    .select("*", { count: "exact" });
  if (error) await fail(`${name}: ${error.message}`, "Apply supabase/schema.sql first?");
  if (count === 0) skipped++;
  else inserted++;
}

for (const name of COLLECTIONS) {
  const items = store[name]?.items ?? [];
  for (const item of items) {
    const { count, error } = await supabase
      .from(name)
      .upsert(
        {
          id: item.id,
          status: item.status,
          sort_order: item.order,
          data: item.data,
          draft: item.draft,
          updated_at: toIso(item.updatedAt),
          published_at: toIso(item.publishedAt),
        },
        { onConflict: "id", ignoreDuplicates: true }
      )
      .select("*", { count: "exact" });
    if (error)
      await fail(`${name}/${item.id}: ${error.message}`, "Apply supabase/schema.sql first?");
    if (count === 0) skipped++;
    else inserted++;
  }
}

console.log(`✓ Seeded ${storePath}`);
console.log(`  ${inserted} row(s) inserted, ${skipped} row(s) already present (skipped).`);
