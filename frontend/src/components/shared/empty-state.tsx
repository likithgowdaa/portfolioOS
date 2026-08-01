import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps extends ComponentPropsWithoutRef<"div"> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional action node rendered below the description. */
  action?: React.ReactNode;
}

/**
 * Composable empty state (no data / zero results).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center",
        className
      )}
      {...props}
    >
      {Icon ? (
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Icon className="size-5" aria-hidden />
        </div>
      ) : null}
      <h3 className="text-title font-medium">{title}</h3>
      {description ? (
        <p className="text-caption text-muted-foreground max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
