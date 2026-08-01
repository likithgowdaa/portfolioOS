import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
}

/**
 * Dashboard summary card — a label, a prominent value, and an optional hint.
 * Purely presentational; the dashboard page feeds it real data.
 */
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-caption text-muted-foreground">{label}</p>
          <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
        </div>
        <p className="text-heading font-semibold tracking-tight">{value}</p>
        {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
