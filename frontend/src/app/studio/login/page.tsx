import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { STUDIO_NAME, STUDIO_SUBTITLE } from "@/features/studio";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Studio login — the only public Studio route.
 *
 * Passphrase-only: an "Access Passphrase" form posts to `/api/auth/login`,
 * which verifies the secret server-side and issues the session cookie. It is
 * reachable only by visiting `/studio/login` (or being redirected here);
 * there is no login button anywhere in the public portfolio.
 */
export default async function StudioLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const failed = error === "1";

  return (
    <main className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-title font-semibold tracking-tight">
              {`${STUDIO_NAME} ${STUDIO_SUBTITLE}`}
            </h1>
            <p className="text-caption text-muted-foreground mt-0.5">Administrator Access</p>
          </div>

          {failed && (
            <p
              role="alert"
              className="border-destructive/20 bg-destructive/5 text-destructive text-caption rounded-lg border px-3 py-2"
            >
              Invalid passphrase.
            </p>
          )}

          <form action="/api/auth/login" method="POST" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="passphrase" className="text-caption text-muted-foreground">
                Access Passphrase
              </label>
              <Input
                id="passphrase"
                name="passphrase"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={buttonVariants({ className: "w-full" })}
              data-cursor="clickable"
              data-slot="button"
            >
              Enter Studio
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
