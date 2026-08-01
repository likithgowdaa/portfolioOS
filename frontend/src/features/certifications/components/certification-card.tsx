"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  AwardIcon,
  CloudIcon,
  CodeIcon,
  LayersIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type {
  Certification,
  CertificationBadge,
  CertificationStatus,
} from "../data/certifications";

/* Status → badge presentation. Labels live here; data stores the enum. */
const STATUS_META: Record<
  CertificationStatus,
  { label: string; variant: "outline" | "secondary"; className?: string }
> = {
  active: {
    label: "Active",
    variant: "outline",
    className: "border-success/30 bg-success/10 text-success",
  },
  expired: { label: "Expired", variant: "outline", className: "text-muted-foreground" },
};

/* Badge key → Lucide component. Icons stay out of the data layer so the data
   module remains CMS-serializable. */
const BADGES: Record<CertificationBadge, LucideIcon> = {
  award: AwardIcon,
  "shield-check": ShieldCheckIcon,
  cloud: CloudIcon,
  server: ServerIcon,
  code: CodeIcon,
  layers: LayersIcon,
};

interface CertificationCardProps {
  certification: Certification;
}

/**
 * A single certification card.
 *
 * Renders the badge icon, title, issuer, dates, description, skill chips,
 * status badge, and a Verify button — each field only when non-empty. Reveal
 * animation is inherited from the parent grid's stagger.
 */
export function CertificationCard({ certification }: CertificationCardProps) {
  const status = STATUS_META[certification.status];
  const BadgeIcon = BADGES[certification.badge] ?? AwardIcon;
  const hasDates = certification.issueDate.length > 0 || certification.expiryDate.length > 0;
  const hasVerify = certification.credentialUrl.length > 0;

  return (
    <motion.article variants={fadeInUp} className="group h-full">
      <Card className={cn("h-full", certification.highlight && "ring-foreground/20")}>
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                certification.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              )}
            >
              <BadgeIcon className="size-5" aria-hidden />
            </div>
            <Badge variant={status.variant} className={status.className}>
              {status.label}
            </Badge>
          </div>

          <h3 className="text-title font-semibold tracking-tight">{certification.title}</h3>

          {certification.issuer.length > 0 && (
            <p className="text-caption text-muted-foreground">{certification.issuer}</p>
          )}

          {hasDates && (
            <div className="flex flex-col gap-0.5">
              {certification.issueDate.length > 0 && (
                <p className="text-caption text-muted-foreground">
                  Issued {certification.issueDate}
                </p>
              )}
              {certification.expiryDate.length > 0 && (
                <p className="text-caption text-muted-foreground">
                  Expires {certification.expiryDate}
                </p>
              )}
            </div>
          )}

          {certification.description.length > 0 && (
            <p className="text-body text-muted-foreground">{certification.description}</p>
          )}

          {certification.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {certification.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-muted-foreground font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          {hasVerify && (
            <div className="mt-auto pt-2">
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Verify ${certification.title} credential`}
                data-slot="button"
                className={buttonVariants({ size: "sm" })}
              >
                Verify Credential
                <ArrowUpRightIcon data-icon="inline-end" className="size-4" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.article>
  );
}
