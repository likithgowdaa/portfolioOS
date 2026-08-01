import { NextRequest, NextResponse } from "next/server";

import { getPublicUrl } from "@/lib/media/storage";

type RouteContext = { params: Promise<{ name: string }> };

/** Only stored upload names (uuid + extension) — blocks path traversal. */
const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]+$/i;

/**
 * Legacy uploads URL — redirect to Supabase Storage.
 *
 * Before the media migration, uploads lived in `public/uploads` and were stored
 * in the CMS as `/uploads/<uuid>.<ext>`. New uploads are stored as full public
 * Storage URLs, so this route exists only to keep previously-saved `/uploads/…`
 * references working. It touches no filesystem — it 308-redirects to the
 * object's public Storage URL. The object must already be in the bucket (run
 * `npm run seed:media` to backfill legacy files). Public — uploads render on
 * the public portfolio.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { name } = await params;
  if (!SAFE_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    return NextResponse.redirect(getPublicUrl(name), 308);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
