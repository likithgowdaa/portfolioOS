import { Card, CardContent } from "@/components/ui/card";

export interface ContentRow {
  title: string;
  subtitle?: string;
  /** Optional trailing element, e.g. a status badge. */
  badge?: React.ReactNode;
}

interface ContentListProps {
  rows: ContentRow[];
}

/**
 * Read-only list of content items (projects, journey entries, certifications).
 *
 * A flat, scannable card list. Renders nothing when empty so missing data
 * never shows an empty layout.
 */
export function ContentList({ rows }: ContentListProps) {
  if (rows.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((row) => (
        <li key={row.title}>
          <Card>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-title font-semibold tracking-tight">{row.title}</p>
                {row.subtitle ? (
                  <p className="text-caption text-muted-foreground mt-0.5">{row.subtitle}</p>
                ) : null}
              </div>
              {row.badge}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
