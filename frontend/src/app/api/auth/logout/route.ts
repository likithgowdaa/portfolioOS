import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth";

/** Log out — clears the session cookie and returns to the login page. */
export function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/studio/login", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
