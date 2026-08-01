import { TriangleAlertIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  description?: string;
  /** Renders a "Try again" button when provided. */
  onRetry?: () => void;
  /** Alternative custom action (takes precedence over `onRetry`). */
  action?: React.ReactNode;
}

/**
 * Composable error state. Uses `role="alert"` so failures are announced.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-16 text-center",
        className
      )}
      {...props}
    >
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <TriangleAlertIcon className="size-5" aria-hidden />
      </div>
      <h3 className="text-title font-medium">{title}</h3>
      {description ? (
        <p className="text-caption text-muted-foreground max-w-sm">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-2">{action}</div>
      ) : onRetry ? (
        <Button variant="outline" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
