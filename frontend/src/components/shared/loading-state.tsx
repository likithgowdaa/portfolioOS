import type { ComponentPropsWithoutRef } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps extends ComponentPropsWithoutRef<"div"> {
  /** Optional visible label; an sr-only "Loading" is used when omitted. */
  label?: string;
}

/**
 * Composable loading state. Announce to assistive tech via `role="status"`.
 */
export function LoadingState({ label, className, ...props }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "text-muted-foreground flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
      {label ? (
        <span className="text-caption">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
