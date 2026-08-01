#!/usr/bin/env node
/**
 * Backfill the Supabase Storage bucket with legacy local uploads.
 *
 * Before the media migration, Studio uploads were written to `public/uploads`
 * and stored in the CMS as `/uploads/<uuid>.<ext>`. This script uploads every
 * file currently in `public/uploads` to the `media` bucket (same names), so the
 * legacy `/uploads/…` references resolve through the redirect route and the
 * public portfolio keeps rendering them.
 *
 * Usage (from `frontend/`):
 *   npm run seed:media
 *
 * Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (loaded from
 * `frontend/.env`). The service role key is required because uploads go through
 * the server-side client. The bucket is created as public if it does not exist.
 *
 * The seed is additive and safe to re-run: objects that already exist are left
 * untouched (`upsert: false`), so it never overwrites files uploaded in Studio
 * after a previous seed. After the bucket is backfilled, `public/uploads` is
 * only a migration source — nothing writes to it anymore, and it can be removed
 * (`git rm -r public/uploads`).
 */

import { readdir, readFile } from "node:fs/promises";
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

const BUCKET = "media";
const MAX_BYTES = 10 * 1024 * 1024;
const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};
const uploadsDir = path.join(process.cwd(), "public", "uploads");

async function fail(message, hint) {
  console.error(`✖ ${message}`);
  if (hint) console.error(`  → ${hint}`);
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

// Create the public bucket on first run — idempotent when it already exists.
const { error: createError } = await supabase.storage.createBucket(BUCKET, {
  public: true,
  fileSizeLimit: MAX_BYTES,
});
if (createError && !/already exists|duplicate/i.test(createError.message)) {
  await fail(`createBucket: ${createError.message}`);
}

let names;
try {
  names = await readdir(uploadsDir);
} catch {
  console.warn(`  no ${uploadsDir} — nothing to backfill (no legacy local uploads).`);
  process.exit(0);
}

let uploaded = 0;
let skipped = 0;

for (const name of names) {
  const data = await readFile(path.join(uploadsDir, name));
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  const { error } = await supabase.storage.from(BUCKET).upload(name, data, {
    upsert: false,
    contentType: MIME_TYPES[ext] ?? "application/octet-stream",
  });
  if (error) {
    if (/already exists|duplicate/i.test(error.message)) skipped++;
    else await fail(`${name}: ${error.message}`);
  } else {
    uploaded++;
  }
}

const publicUrl = supabase.storage.from(BUCKET).getPublicUrl("").data.publicUrl.replace(/\/$/, "");
console.log(`✓ Backfilled ${uploadsDir}`);
console.log(`  ${uploaded} file(s) uploaded, ${skipped} already present (skipped).`);
console.log(`  Bucket: ${BUCKET} (public). Example: ${publicUrl}/<uuid>.<ext>`);
