import { createHmac, timingSafeEqual } from "crypto";

/**
 * Studio authentication — server-only.
 *
 * Passphrase-based: the single administrator enters a passphrase that is
 * compared timing-safely against `STUDIO_ADMIN_SECRET` (server-side only; the
 * secret never reaches the client). Success issues the same signed, httpOnly
 * session cookie Studio has always used. Session verification is pure (sync)
 * crypto so server layouts can guard every Studio page.
 */

/** httpOnly session cookie name. */
export const SESSION_COOKIE = "studio_session";

/** Session lifetime: 30 days, sliding-ish fixed expiry. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

/** The single Studio user — there is no identity provider anymore. */
export interface StudioUser {
  email: string;
  name: string;
  picture: string;
}

/** Identity attached to every session. Studio has exactly one administrator. */
export const STUDIO_ADMIN: StudioUser = {
  email: "admin@local",
  name: "Administrator",
  picture: "",
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function sessionSecret(): string {
  return requiredEnv("STUDIO_SESSION_SECRET");
}

/** Restrict redirect targets to Studio-internal paths (open-redirect guard). */
export function safeStudioPath(next: string | null | undefined): string {
  if (next && next.startsWith("/studio") && !next.startsWith("//")) return next;
  return "/studio";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/** Create a signed session token from a user. */
export function createSessionToken(user: StudioUser): string {
  const body = Buffer.from(
    JSON.stringify({ user, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Verify a session token; returns the user, or null when invalid/expired. */
export function verifySessionToken(token: string | null | undefined): StudioUser | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!safeEqual(sign(body), signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      user?: StudioUser;
      exp?: number;
    };
    if (!data.user || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data.user;
  } catch {
    return null;
  }
}

/* ── Passphrase login ────────────────────────────────────────────────────── */

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // sliding window per IP
const LOGIN_MAX_ATTEMPTS = 10; // failures allowed per window

/** In-process attempt log: ip → failure timestamps. Clears on restart. */
const loginAttempts = new Map<string, number[]>();

function pruneAttempts(now: number): void {
  const cutoff = now - LOGIN_WINDOW_MS;
  for (const [ip, times] of loginAttempts) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length === 0) loginAttempts.delete(ip);
    else loginAttempts.set(ip, kept);
  }
}

/** Whether this IP is currently locked out of login. */
export function isLoginRateLimited(ip: string): boolean {
  pruneAttempts(Date.now());
  return (loginAttempts.get(ip) ?? []).length >= LOGIN_MAX_ATTEMPTS;
}

/** Record a failed attempt for an IP (timestamps only — never the value). */
export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  pruneAttempts(now);
  const times = loginAttempts.get(ip) ?? [];
  times.push(now);
  loginAttempts.set(ip, times);
}

/** A successful login resets the counter for this IP. */
export function recordLoginSuccess(ip: string): void {
  loginAttempts.delete(ip);
}

/** Timing-safe, length-independent comparison (fixed-size HMAC digests). */
function safeCompare(a: string, b: string): boolean {
  const digest = (value: string) =>
    createHmac("sha256", "portfolioos-passphrase").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * Verify the entered passphrase against `STUDIO_ADMIN_SECRET`.
 * Fail-closed: an unset secret can never authenticate.
 */
export function verifyPassphrase(passphrase: string): boolean {
  const secret = process.env.STUDIO_ADMIN_SECRET;
  if (!secret) return false;
  return safeCompare(passphrase, secret);
}
