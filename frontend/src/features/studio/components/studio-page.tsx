import { cn } from "@/lib/utils";

interface StudioPageProps {
  title: string;
  description?: string;
  /** Optional trailing element, e.g. a StatusBadge. */
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Studio page scaffolding — a consistent header (title + description + badge)
 * above the page content. Server-compatible; every Studio page uses it so the
 * heading hierarchy and rhythm stay uniform.
 */
export function StudioPage({ title, description, badge, className, children }: StudioPageProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <header className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-heading font-semibold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description ? <p className="text-body text-muted-foreground">{description}</p> : null}
      </header>
      {children}
    </div>
  );
}
