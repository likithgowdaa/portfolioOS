import { cn } from "@/lib/utils";

export interface SummaryRow {
  label: string;
  value: React.ReactNode;
}

interface SummaryListProps {
  rows: SummaryRow[];
  className?: string;
}

/**
 * Read-only label/value rows rendered as a description list.
 *
 * Rows with empty values are skipped so missing data never renders as blank
 * entries. Callers source rows from the data layer; this stays server-safe.
 */
export function SummaryList({ rows, className }: SummaryListProps) {
  const visible = rows.filter(
    (row) => row.value !== undefined && row.value !== null && row.value !== ""
  );
  if (visible.length === 0) return null;

  return (
    <dl className={cn("", className)}>
      {visible.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[8rem_1fr] gap-x-4 py-3 sm:grid-cols-[12rem_1fr]"
        >
          <dt className="text-caption text-muted-foreground">{row.label}</dt>
          <dd className="text-body min-w-0 break-words">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
