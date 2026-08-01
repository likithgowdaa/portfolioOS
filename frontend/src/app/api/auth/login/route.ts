import { NextRequest, NextResponse } from "next/server";

import {
  createSessionToken,
  isLoginRateLimited,
  recordLoginFailure,
  recordLoginSuccess,
  safeStudioPath,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  STUDIO_ADMIN,
  verifyPassphrase,
} from "@/lib/auth";

const LOGIN_ERROR = "/studio/login?error=1";

/** Client IP from the forwarded headers, falling back to a local marker. */
function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/**
 * Passphrase login — the only way to enter Studio.
 *
 * Verifies the passphrase server-side (timing-safe) and, on success, issues
 * the same signed httpOnly session cookie Studio has always used. Failures —
 * wrong passphrase, missing secret, or rate-limited IP — all return the same
 * generic redirect; the client never learns why.
 */
export async function POST(req: NextRequest) {
  const next = safeStudioPath(req.nextUrl.searchParams.get("next"));
  const ip = clientIp(req);

  if (isLoginRateLimited(ip)) {
    return NextResponse.redirect(new URL(LOGIN_ERROR, req.url));
  }

  let passphrase = "";
  try {
    const form = await req.formData();
    const value = form.get("passphrase");
    if (typeof value === "string") passphrase = value;
  } catch {
    // A malformed body is treated as a failed login below.
  }

  // Spend the same time on success and failure to damp timing-based probing.
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!process.env.STUDIO_SESSION_SECRET || !verifyPassphrase(passphrase)) {
    recordLoginFailure(ip);
    return NextResponse.redirect(new URL(LOGIN_ERROR, req.url));
  }

  recordLoginSuccess(ip);
  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set(SESSION_COOKIE, createSessionToken(STUDIO_ADMIN), SESSION_COOKIE_OPTIONS);
  return res;
}
