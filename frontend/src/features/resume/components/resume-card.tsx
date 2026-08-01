import { ArrowUpRightIcon, DownloadIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResumeCardProps {
  title: string;
  description: string;
  /** Download / open target — guaranteed non-empty by the caller. */
  url: string;
  lastUpdated: string;
  fileSize: string;
}

/**
 * Resume information card.
 *
 * Renders the resume title, description, last-updated and file-size meta rows,
 * and the Download / Open buttons. Every field renders only when non-empty, so
 * partially-populated resume data degrades gracefully.
 */
export function ResumeCard({ title, description, url, lastUpdated, fileSize }: ResumeCardProps) {
  const hasMeta = lastUpdated.length > 0 || fileSize.length > 0;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {title.length > 0 && <h3 className="text-title font-semibold tracking-tight">{title}</h3>}

        {description.length > 0 && <p className="text-body text-muted-foreground">{description}</p>}

        {hasMeta && (
          <dl className="flex flex-col gap-1">
            {lastUpdated.length > 0 && (
              <div className="flex gap-2">
                <dt className="text-caption text-muted-foreground">Last updated</dt>
                <dd className="text-caption">{lastUpdated}</dd>
              </div>
            )}
            {fileSize.length > 0 && (
              <div className="flex gap-2">
                <dt className="text-caption text-muted-foreground">File size</dt>
                <dd className="text-caption">{fileSize}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={url}
            download
            aria-label="Download resume"
            data-slot="button"
            className={buttonVariants({ size: "sm" })}
          >
            <DownloadIcon data-icon="inline-start" className="size-4" />
            Download Resume
          </a>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open resume in a new tab"
            data-slot="button"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Open Resume
            <ArrowUpRightIcon data-icon="inline-end" className="size-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
