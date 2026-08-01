import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (service role).
 *
 * The CMS store runs entirely server-side (Studio auth is the passphrase session,
 * not Supabase Auth), so every read and write goes through the `service_role` key,
 * which bypasses RLS. RLS still protects the tables for the public `anon` key.
 * Never import this module into a client component — the key must not leave the
 * server. The client is created lazily (and cached) so importing this module is
 * safe even when Supabase is not configured, e.g. during a CI build.
 */

const REQUEST_TIMEOUT_MS = 10_000;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment."
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Bound the request so a missing/unreachable project never hangs a build
      // or a request indefinitely.
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }),
    },
  });
  return cachedClient;
}
