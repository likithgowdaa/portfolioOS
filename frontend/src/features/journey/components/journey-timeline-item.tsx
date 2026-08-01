"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CodeIcon,
  GraduationCapIcon,
  RocketIcon,
  SparklesIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { JourneyCategory, JourneyEntry, JourneyIcon, JourneyStatus } from "../data/journey";

/* Status → badge presentation. Labels live here; data stores the enum. */
const STATUS_META: Record<
  JourneyStatus,
  { label: string; variant: "outline" | "secondary"; className?: string }
> = {
  completed: { label: "Completed", variant: "outline" },
  current: {
    label: "Current",
    variant: "outline",
    className: "border-success/30 bg-success/10 text-success",
  },
  planned: { label: "Planned", variant: "outline", className: "text-muted-foreground" },
};

/* Category → label. Labels live here; data stores the enum. */
const CATEGORY_LABELS: Record<JourneyCategory, string> = {
  education: "Education",
  experience: "Experience",
  milestone: "Milestone",
};

/* Icon key → Lucide component. Icons stay out of the data layer so the data
   module remains CMS-serializable. */
const ICONS: Record<JourneyIcon, LucideIcon> = {
  "graduation-cap": GraduationCapIcon,
  briefcase: BriefcaseIcon,
  award: AwardIcon,
  sparkles: SparklesIcon,
  rocket: RocketIcon,
  code: CodeIcon,
};

interface JourneyTimelineItemProps {
  entry: JourneyEntry;
  /** Position in the timeline — drives the desktop alternating layout. */
  index: number;
}

/**
 * A single timeline entry.
 *
 * Three grid zones: the date (beside the connector on tablet, opposite the
 * card on desktop, inside the card on mobile), the connector dot, and the
 * card. Cards render every field only when non-empty. The reveal animation is
 * inherited from the parent timeline's stagger.
 */
export function JourneyTimelineItem({ entry, index }: JourneyTimelineItemProps) {
  const isEven = index % 2 === 0;
  const status = STATUS_META[entry.status];
  const Icon = ICONS[entry.icon] ?? SparklesIcon;

  return (
    <motion.li
      variants={fadeInUp}
      className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:gap-x-6 lg:gap-x-8"
    >
      {/* Date — beside the connector on tablet, opposite the card on desktop.
          Mobile shows it inside the card instead. */}
      <div
        className={cn(
          "hidden items-center md:col-start-1 md:flex md:justify-end",
          isEven ? "lg:col-start-3 lg:justify-start" : "lg:col-start-1 lg:justify-end"
        )}
      >
        <p className="text-title font-semibold tracking-tight">{entry.date}</p>
      </div>

      {/* Connector dot — sits on the shared timeline line. */}
      <div aria-hidden className="col-start-1 flex items-center justify-center md:col-start-2">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            entry.highlight
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground ring-border ring-1"
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>

      {/* Card */}
      <div
        className={cn("col-start-2 md:col-start-3", isEven ? "lg:col-start-1" : "lg:col-start-3")}
      >
        <Card className={cn("h-full", entry.highlight && "ring-foreground/20")}>
          <CardContent className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-caption text-muted-foreground">
                {/* The card-level date only shows on mobile — desktop/tablet
                    date lives beside the connector. */}
                <span className="md:hidden">{entry.date} · </span>
                {CATEGORY_LABELS[entry.category]}
              </p>
              <Badge variant={status.variant} className={status.className}>
                {status.label}
              </Badge>
            </div>

            <h3 className="text-title font-semibold tracking-tight">{entry.title}</h3>

            {entry.subtitle.length > 0 && (
              <p className="text-caption text-muted-foreground">{entry.subtitle}</p>
            )}

            {entry.description.length > 0 && (
              <p className="text-body text-muted-foreground">{entry.description}</p>
            )}

            {entry.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {entry.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-muted-foreground font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {entry.links.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {entry.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${entry.title} — ${link.label}`}
                    data-slot="button"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {link.label}
                    <ArrowUpRightIcon data-icon="inline-end" className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.li>
  );
}
