import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StudioShell } from "@/features/studio";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Studio dashboard layout — the auth guard.
 *
 * Runs on the server for every `/studio/*` page inside this group. Verifies
 * the signed session cookie; unauthenticated visitors are redirected to the
 * login page before anything renders. The login route lives outside this
 * group so it stays public.
 */
export default async function StudioDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const user = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!user) redirect("/studio/login");

  return <StudioShell user={user}>{children}</StudioShell>;
}
