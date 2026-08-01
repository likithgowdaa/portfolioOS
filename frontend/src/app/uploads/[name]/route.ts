import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ name: string }> };

/** Only stored upload names (uuid + extension) — blocks path traversal. */
const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]+$/i;

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/**
 * Uploads — serve stored media.
 *
 * Next.js `next start` only serves `public/` files that existed at build time,
 * so Studio uploads (written to `public/uploads` at runtime) are served from
 * disk through this route instead. Files are immutable once stored, so the
 * response is cached long-term. Public — uploads are meant to render on the
 * public portfolio.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { name } = await params;
  if (!SAFE_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", name);
  try {
    const data = await fs.readFile(filePath);
    const type = MIME_TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
