import { randomUUID } from "crypto";

import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * Media storage — server-only Supabase Storage.
 *
 * Studio uploads (profile photo, project covers/gallery, resume PDF, …) live in
 * a single public Storage bucket (`media`) instead of the local filesystem, so
 * the app works on serverless hosts (Vercel) where the filesystem is read-only.
 * Every media upload — `/api/studio/media` — and every read (public URLs) goes
 * through this module; nothing is ever written to `public/uploads`.
 *
 * The bucket is `public`, so objects are readable through their public URL by
 * anyone (they render on the public portfolio). Writes go through the server
 * `service_role` client and are auth-guarded by the Studio passphrase session at
 * the route layer. Never import this module into a client component.
 */

/** Public Storage bucket holding every Studio upload. */
export const MEDIA_BUCKET = "media";

/** Accepted upload types — mirror the route's previous allowlist. */
export const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"]);

/** Upload size cap, in bytes (10 MB). */
export const MAX_BYTES = 10 * 1024 * 1024;

/** Extension → content type, used when the browser supplies no MIME type. */
export const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/** A stored object as returned to the Studio media library. */
export interface StoredMedia {
  /** Stored object name (uuid + extension). */
  name: string;
  /** Public URL of the object in the bucket. */
  url: string;
  /** Size in bytes. */
  size: number;
  /** Extension without the dot (e.g. "jpg"), matching the legacy API. */
  type: string;
}

/** Bucket client — short for `getSupabaseAdmin().storage.from(MEDIA_BUCKET)`. */
function storage() {
  return getSupabaseAdmin().storage.from(MEDIA_BUCKET);
}

// Per-instance guard so the idempotent createBucket call only happens once per
// warm invocation (the serverless instance already ran ensureBucket).
let bucketReady = false;

/**
 * Create the public bucket on first use. Idempotent — creating an existing
 * bucket is a no-op.
 */
export async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  const { error } = await getSupabaseAdmin().storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
  });
  if (error && !/already exists|duplicate/i.test(error.message)) throw error;
  bucketReady = true;
}

/** Public URL for an object name. */
export function getPublicUrl(name: string): string {
  return getSupabaseAdmin().storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl;
}

/** Upload a buffer under `name` and return the stored object. */
export async function uploadFile(
  name: string,
  data: ArrayBuffer | Uint8Array,
  contentType: string
): Promise<StoredMedia> {
  await ensureBucket();
  const { error } = await storage().upload(name, data, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return {
    name,
    url: getPublicUrl(name),
    size: data.byteLength,
    type: name.split(".").pop()?.toLowerCase() ?? "",
  };
}

/** List every object in the bucket, largest first (mirrors the local listing). */
export async function listFiles(): Promise<StoredMedia[]> {
  await ensureBucket();
  const { data, error } = await storage().list();
  if (error) throw error;
  return (data ?? [])
    .map((object) => ({
      name: object.name,
      url: getPublicUrl(object.name),
      size: object.metadata?.size ?? 0,
      type: object.name.split(".").pop()?.toLowerCase() ?? "",
    }))
    .sort((a, b) => b.size - a.size);
}

/** Remove an object. Returns false when nothing was removed. */
export async function deleteFile(name: string): Promise<boolean> {
  await ensureBucket();
  const { data, error } = await storage().remove([name]);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** Generate a unique stored object name from an original filename. */
export function uniqueName(originalName: string): string {
  const ext = originalName.slice(originalName.lastIndexOf(".")).toLowerCase();
  return `${randomUUID()}${ext}`;
}
