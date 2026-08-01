import { Badge } from "@/components/ui/badge";

import { PUBLISH_STATUS_META, type PublishStatus } from "../data/studio-config";

/**
 * Publish-status badge — Draft / Published / Hidden / Archived.
 *
 * Presentation lives here; the status enum comes from the data layer, keeping
 * it CMS-serializable.
 */
export function StatusBadge({ status }: { status: PublishStatus }) {
  const meta = PUBLISH_STATUS_META[status];
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}
