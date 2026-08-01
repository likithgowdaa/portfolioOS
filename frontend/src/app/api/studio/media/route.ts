import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Media API — the shared upload system for Studio.
 *
 * Files are stored in `public/uploads/` (served as static assets) and reused
 * across entities. Allowed: PNG, JPG, WEBP, SVG, PDF. Uploads are auth-guarded.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

interface MediaFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

async function listFiles(): Promise<MediaFile[]> {
  let names: string[];
  try {
    names = await fs.readdir(UPLOAD_DIR);
  } catch {
    return [];
  }
  const files: MediaFile[] = [];
  for (const name of names) {
    try {
      const stat = await fs.stat(path.join(UPLOAD_DIR, name));
      if (!stat.isFile()) continue;
      files.push({
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        type: path.extname(name).slice(1),
      });
    } catch {
      // skip unreadable entries
    }
  }
  return files.sort((a, b) => b.size - a.size);
}

export async function GET(req: NextRequest) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ files: await listFiles() });
}

export async function POST(req: NextRequest) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use PNG, JPG, WEBP, SVG, or PDF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 10 MB limit" }, { status: 400 });
  }

  const storedName = `${randomUUID()}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, storedName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    url: `/uploads/${storedName}`,
    name: file.name,
    size: file.size,
    type: ext.slice(1),
  });
}
