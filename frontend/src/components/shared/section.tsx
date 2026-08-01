import type { ComponentPropsWithoutRef } from "react";

import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  /** Render full-bleed (skip the container) — for section-level backgrounds. */
  fullWidth?: boolean;
}

/**
 * Vertical rhythm section.
 *
 * Applies consistent section spacing and, by default, constrains children to
 * the page container. Use `fullWidth` when a section needs its own
 * full-bleed background while keeping inner spacing.
 */
export function Section({ className, children, fullWidth = false, ...props }: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props}>
      {fullWidth ? children : <Container>{children}</Container>}
    </section>
  );
}
