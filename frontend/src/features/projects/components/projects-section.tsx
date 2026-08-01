"use client";

import { motion } from "framer-motion";

import type { Project } from "../data/projects";
import { Section } from "@/components/shared/section";
import { fadeInUp, stagger } from "@/lib/motion";

import { ProjectCard } from "./project-card";

/**
 * Projects — the listing section.
 *
 * Title, short description, and a responsive grid of data-driven project
 * cards. Cards reveal with the Sprint 02 stagger when the grid enters the
 * viewport. Renders nothing when no projects are published — the layout
 * rebalances automatically.
 */
export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section id="projects" aria-labelledby="projects-title">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="projects-title" className="text-heading font-semibold tracking-tight">
          Projects
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          Selected work across cloud infrastructure, automation, and platform engineering —
          production systems, not demos.
        </p>
      </motion.div>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 2xl:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </Section>
  );
}
