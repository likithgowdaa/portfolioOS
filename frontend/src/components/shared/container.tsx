import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Page-width content container.
 *
 * Constrains content to the `--container-page` token and applies the
 * responsive horizontal gutter. Mobile-first: the padding scales up at the
 * `sm` and `lg` breakpoints.
 */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("max-w-page mx-auto w-full px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}
