import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { deleteFile } from "@/lib/media/storage";

type RouteContext = { params: Promise<{ name: string }> };

/** Only stored upload names (uuid + extension) — blocks path traversal. */
const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]+$/i;

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Delete a stored upload from the Supabase Storage bucket by object name. */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  const { name } = await params;
  if (!SAFE_NAME.test(name)) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  try {
    const removed = await deleteFile(name);
    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json({ error: `Storage unavailable: ${message}` }, { status: 503 });
  }
}
