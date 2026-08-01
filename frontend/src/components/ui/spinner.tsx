import { Loader2Icon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const spinnerSizes = {
  sm: "size-4",
  default: "size-5",
  lg: "size-8",
} as const;

interface SpinnerProps extends Omit<ComponentPropsWithoutRef<typeof Loader2Icon>, "size"> {
  size?: keyof typeof spinnerSizes;
}

/**
 * Loading spinner.
 *
 * Purely visual (icon is hidden from assistive tech) — pair it with a
 * `LoadingState` or an `aria-live` label for accessible loading feedback.
 */
export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      aria-hidden
      data-slot="spinner"
      className={cn("animate-spin text-current", spinnerSizes[size], className)}
      {...props}
    />
  );
}
