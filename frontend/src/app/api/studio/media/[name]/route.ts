import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

type RouteContext = { params: Promise<{ name: string }> };

/** Only stored upload names (uuid + extension) — blocks path traversal. */
const SAFE_NAME = /^[a-f0-9-]{36}\.[a-z0-9]+$/i;

/** Delete a stored upload by filename. */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await params;
  if (!SAFE_NAME.test(name)) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const target = path.join(process.cwd(), "public", "uploads", name);
  try {
    await fs.unlink(target);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
