"use client";

import { EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import type { EntitySchema } from "../schemas";

interface PreviewPaneProps {
  open: boolean;
  onClose: () => void;
  schema: EntitySchema;
  data: Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Preview mode — renders the edited content the way the public portfolio
 * structures it (cards, badges, lists). Matches the public design language;
 * a pixel-perfect preview is a documented refinement.
 */
export function PreviewPane({ open, onClose, schema, data }: PreviewPaneProps) {
  const title = asString(data.title) || asString(data.name) || schema.label;
  const subtitle =
    asString(data.shortDescription) || asString(data.subtitle) || asString(data.role);
  const description =
    asString(data.longDescription) || asString(data.description) || asString(data.summary);
  const tags = [
    ...asArray(data.techStack),
    ...asArray(data.technologies),
    ...asArray(data.skills),
  ] as string[];
  const badge = asString(data.status) || asString(data.category) || "";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle>Preview — {schema.label}</DialogTitle>
        <DialogDescription>How this content appears on the public portfolio.</DialogDescription>

        <div className="bg-muted/30 flex flex-col gap-3 rounded-xl p-4">
          <Card>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-title font-semibold tracking-tight">{title}</h3>
                {badge ? <Badge variant="outline">{badge}</Badge> : null}
              </div>
              {subtitle ? <p className="text-caption text-muted-foreground">{subtitle}</p> : null}
              {description ? (
                <p className="text-body text-muted-foreground">{description}</p>
              ) : null}
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-muted-foreground font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <p className="text-caption text-muted-foreground">
            Empty fields are hidden on the public site, and the layout rebalances automatically.
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <EyeIcon data-icon="inline-start" className="size-4" />
            Close preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
