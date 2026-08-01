"use client";

import { motion } from "framer-motion";
import { ArrowUpRightIcon, GitBranchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/motion";

import type { Project, ProjectStatus } from "../data/projects";

/** Status → badge presentation. Labels live here; data stores the enum. */
const STATUS_META: Record<
  ProjectStatus,
  { label: string; variant: "default" | "secondary" | "outline"; className?: string }
> = {
  live: {
    label: "Live",
    variant: "outline",
    className: "border-success/30 bg-success/10 text-success",
  },
  beta: { label: "Beta", variant: "secondary" },
  "in-development": { label: "In Development", variant: "outline" },
  archived: { label: "Archived", variant: "outline", className: "text-muted-foreground" },
};

interface ProjectCardProps {
  project: Project;
}

/**
 * Project card for the listing grid.
 *
 * Renders the cover, title, description, technology chips, status badge, and
 * the GitHub / Live Demo links. An empty `github` or `demo` hides that button
 * (no disabled states). Reveal animation is inherited from the parent grid's
 * stagger; hover effects are pure CSS (lift, ring highlight, subtle zoom).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const status = STATUS_META[project.status];
  const hasSource = project.github.length > 0;
  const hasDemo = project.demo.length > 0;

  return (
    <motion.article variants={fadeInUp} className="group h-full">
      <Card className="duration-base ease-out-quart group-hover:ring-foreground/25 relative h-full transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
        {/* Covers are hand-authored SVG — served as-is via `unoptimized`,
            still lazy-loaded by next/image. */}
        <Image
          src={project.coverImage}
          alt=""
          width={1200}
          height={750}
          unoptimized
          sizes="(max-width: 639px) 100vw, (max-width: 1535px) 50vw, 33vw"
          className="duration-slower ease-out-quart object-cover transition-transform group-hover:scale-[1.02]"
          style={{ width: "100%", height: "auto" }}
        />

        {/* Whole-card link to the detail page. Sits beneath the action
            buttons (z-20) so they stay clickable above it. */}
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`View ${project.title} details`}
          data-cursor="clickable"
          className="focus-visible:ring-ring absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        />

        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle>
              <h3>{project.title}</h3>
            </CardTitle>
            <Badge variant={status.variant} className={status.className}>
              {status.label}
            </Badge>
          </div>

          <CardDescription>{project.shortDescription}</CardDescription>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-muted-foreground font-normal">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="relative z-20 mt-auto flex flex-wrap gap-2 pt-2">
            {hasSource && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                data-slot="button"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <GitBranchIcon data-icon="inline-start" className="size-4" />
                GitHub
              </a>
            )}
            {hasDemo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                data-slot="button"
                className={buttonVariants({ size: "sm" })}
              >
                Live Demo
                <ArrowUpRightIcon data-icon="inline-end" className="size-4" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
