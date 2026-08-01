import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface PageWrapperProps extends ComponentPropsWithoutRef<"main"> {
  /** Center children vertically within the viewport (for shell pages). */
  center?: boolean;
  /** Anchor id for the skip link (defaults to `content`). */
  id?: string;
}

/**
 * Page-level wrapper.
 *
 * Establishes the minimum viewport height and vertical flex flow that every
 * page shares. `center` is useful for non-content splash shells. Doubles as
 * the skip-link target (`#content`).
 */
export function PageWrapper({
  className,
  center = false,
  id = "content",
  ...props
}: PageWrapperProps) {
  return (
    <main
      id={id}
      tabIndex={-1}
      className={cn("flex min-h-svh flex-col", center && "items-center justify-center", className)}
      {...props}
    />
  );
}
