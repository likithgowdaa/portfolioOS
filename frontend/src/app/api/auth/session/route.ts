import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Read the current session — returns `{ user }` or `{ user: null }`. */
export function GET(req: NextRequest) {
  const user = verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user });
}
