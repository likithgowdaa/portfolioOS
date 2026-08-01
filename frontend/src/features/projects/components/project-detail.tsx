"use client";

import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  GaugeIcon,
  GitBranchIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Separator } from "@/components/ui/separator";
import { fadeInUp } from "@/lib/motion";

import type { Project, ProjectStatus } from "../data/projects";

import { DocumentationLinks } from "./documentation-links";
import { EngineeringDecisions } from "./engineering-decisions";
import { Gallery } from "./gallery";
import { RelatedProjects } from "./related-projects";

/** Status → badge presentation (mirrors project-card). */
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

interface ProjectDetailProps {
  project: Project;
  /** Related projects, derived server-side from the published CMS collection. */
  relatedProjects: Project[];
}

/* -------------------------------------------------------------------------- */
/*  Section wrapper — fadeInUp reveal with consistent vertical spacing        */
/* -------------------------------------------------------------------------- */

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col gap-3"
    >
      <h2 className="text-title font-semibold tracking-tight">{title}</h2>
      <div className="text-body text-muted-foreground flex flex-col gap-3">{children}</div>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature / challenge / learning list item                                  */
/* -------------------------------------------------------------------------- */

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function ProjectDetail({ project, relatedProjects }: ProjectDetailProps) {
  const status = STATUS_META[project.status];
  const hasSource = project.github.length > 0;
  const hasDemo = project.demo.length > 0;
  const hasLinks = hasSource || hasDemo;
  const hasDocLinks =
    project.docs.documentation.length > 0 ||
    project.docs.architecture.length > 0 ||
    project.docs.apiReference.length > 0;

  return (
    <Container className="max-w-3xl py-16 sm:py-20 lg:py-24">
      {/* ── Back ───────────────────────────────────────────────────────── */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-10">
        <Link
          href="/#projects"
          aria-label="Back to projects"
          data-slot="button"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeftIcon data-icon="inline-start" className="size-4" />
          Projects
        </Link>
      </motion.div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        <h1 className="text-heading font-semibold tracking-tight">{project.title}</h1>

        <Badge variant={status.variant} className="w-fit">
          {status.label}
        </Badge>

        {/* Difficulty / duration — hidden while values are empty. */}
        {(project.difficulty.length > 0 || project.estimatedDuration.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {project.difficulty.length > 0 && (
              <Badge variant="outline">
                <GaugeIcon data-icon="inline-start" className="size-3" aria-hidden />
                {project.difficulty}
              </Badge>
            )}
            {project.estimatedDuration.length > 0 && (
              <Badge variant="outline">
                <ClockIcon data-icon="inline-start" className="size-3" aria-hidden />
                {project.estimatedDuration}
              </Badge>
            )}
          </div>
        )}

        <p className="text-body text-muted-foreground">{project.shortDescription}</p>
      </motion.div>

      {/* ── Cover ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="my-10 overflow-hidden rounded-xl"
      >
        <Image
          src={project.coverImage}
          alt={`${project.title} cover`}
          width={1200}
          height={750}
          unoptimized
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          style={{ width: "100%", height: "auto" }}
        />
      </motion.div>

      <Separator className="my-2" />

      {/* ── Content sections ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-10">
        <DetailSection title="Overview">
          <p>{project.longDescription}</p>
        </DetailSection>

        <DetailSection title="Problem">
          <p>{project.problem}</p>
        </DetailSection>

        <DetailSection title="Solution">
          <p>{project.solution}</p>
        </DetailSection>

        <DetailSection title="Features">
          <ul className="flex flex-col gap-2">
            {project.features.map((feature) => (
              <ListItem key={feature}>{feature}</ListItem>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="Technology Stack">
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="font-normal">
                {tech}
              </Badge>
            ))}
          </div>
        </DetailSection>

        {project.gallery.length > 0 && (
          <DetailSection title="Gallery">
            <Gallery title={project.title} images={project.gallery} />
          </DetailSection>
        )}

        <DetailSection title="Architecture">
          {project.architectureTitle.length > 0 && (
            <h3 className="text-title font-medium tracking-tight">{project.architectureTitle}</h3>
          )}
          <p>{project.architecture}</p>
          {project.architectureFlow.length > 0 && (
            <ol className="flex flex-col gap-2">
              {project.architectureFlow.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span
                    className="text-muted-foreground ring-foreground/15 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums ring-1"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </DetailSection>

        {project.engineeringDecisions.length > 0 && (
          <DetailSection title="Engineering Decisions">
            <EngineeringDecisions decisions={project.engineeringDecisions} />
          </DetailSection>
        )}

        {hasDocLinks && (
          <DetailSection title="Documentation">
            <DocumentationLinks docs={project.docs} />
          </DetailSection>
        )}

        {project.challenges.length > 0 && (
          <DetailSection title="Challenges">
            <ul className="flex flex-col gap-2">
              {project.challenges.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DetailSection>
        )}

        {project.learnings.length > 0 && (
          <DetailSection title="Key Learnings">
            <ul className="flex flex-col gap-2">
              {project.learnings.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DetailSection>
        )}

        {/* ── External links ──────────────────────────────────────────── */}
        {hasLinks && (
          <DetailSection title="Links">
            <div className="flex flex-wrap gap-3 pt-1">
              {hasSource && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} source code on GitHub`}
                  data-slot="button"
                  className={buttonVariants({ variant: "outline" })}
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
                  className={buttonVariants()}
                >
                  Live Demo
                  <ArrowUpRightIcon data-icon="inline-end" className="size-4" />
                </a>
              )}
            </div>
          </DetailSection>
        )}

        <RelatedProjects projects={relatedProjects} />
      </div>
    </Container>
  );
}
