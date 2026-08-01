import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import dynamic from "next/dynamic";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileContent } from "@/lib/cms/types";

// Lazy-loaded: the playground is a separate chunk so the hero text stays the
// primary (fast) content. Sprint 04 will grow this component substantially.
const InfrastructurePlayground = dynamic(
  () => import("./infrastructure-playground").then((m) => m.InfrastructurePlayground),
  {
    loading: () => <Skeleton className="aspect-[4/3] w-full rounded-xl" />,
  }
);

/**
 * Hero — the landing headline.
 *
 * Desktop uses a 55/45 split (text left, playground right) and stacks
 * vertically on mobile. All personal data comes from the CMS profile.
 */
export function Hero({ profile }: { profile: ProfileContent }) {
  // No broken buttons: the Resume CTA only shows once a resume asset exists.
  const hasResume = profile.resumeAvailable && profile.resumeUrl.length > 0;

  return (
    <section id="home">
      <Container>
        <div className="grid min-h-svh items-center gap-12 py-24 lg:grid-cols-12 lg:gap-16">
          {/* Left — text (55%) */}
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            {profile.availability.length > 0 && (
              <span className="border-success/30 bg-success/10 text-success text-caption inline-flex items-center gap-2 rounded-full border px-3 py-1">
                <span className="bg-success size-1.5 rounded-full" aria-hidden />
                {profile.availability}
              </span>
            )}

            <h1 className="text-heading sm:text-display font-semibold tracking-tight">
              {profile.name}
            </h1>
            <p className="text-title text-foreground font-medium">{profile.role}</p>
            <p className="text-body text-muted-foreground max-w-xl">{profile.tagline}</p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#projects" data-slot="button" className={buttonVariants({ size: "lg" })}>
                View Projects
                <ArrowRightIcon className="size-4" />
              </a>
              {hasResume && (
                <a
                  href={profile.resumeUrl}
                  data-slot="button"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Resume
                  <FileTextIcon className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right — playground (45%) */}
          <div className="lg:col-span-5">
            <InfrastructurePlayground />
          </div>
        </div>
      </Container>
    </section>
  );
}
