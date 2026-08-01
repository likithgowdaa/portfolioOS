import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  ALLOWED_EXTENSIONS,
  MAX_BYTES,
  MIME_TYPES,
  listFiles,
  uniqueName,
  uploadFile,
} from "@/lib/media/storage";

/**
 * Media API — the shared upload system for Studio.
 *
 * Files are stored in the Supabase Storage bucket (`media`) and reused across
 * entities; their public Storage URLs are saved in the CMS exactly like any
 * other content. Allowed: PNG, JPG, WEBP, SVG, PDF (≤10 MB). Uploads are
 * auth-guarded. No local filesystem is used — the app runs on read-only
 * serverless filesystems (Vercel).
 */

interface MediaFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Storage is unreachable (e.g. Supabase unconfigured) — writes fail closed. */
function storageUnavailable(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "unknown error";
  return NextResponse.json({ error: `Storage unavailable: ${message}` }, { status: 503 });
}

export async function GET(req: NextRequest) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  try {
    return NextResponse.json({ files: await listFiles() });
  } catch {
    // Reads degrade gracefully: no bucket → empty library (matches the store's
    // read-degrades-to-default behavior).
    return NextResponse.json({ files: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return badRequest("Invalid upload");
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return badRequest("Missing file");
  }
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return badRequest("Unsupported file type. Use PNG, JPG, WEBP, SVG, or PDF.");
  }
  if (file.size > MAX_BYTES) {
    return badRequest("File exceeds the 10 MB limit");
  }

  const storedName = uniqueName(file.name);
  const contentType = file.type || MIME_TYPES[ext] || "application/octet-stream";

  try {
    const stored = await uploadFile(storedName, await file.arrayBuffer(), contentType);
    const created: MediaFile = {
      url: stored.url,
      name: file.name,
      size: stored.size,
      type: stored.type,
    };
    return NextResponse.json(created);
  } catch (error) {
    return storageUnavailable(error);
  }
}
