"use client";

import { motion } from "framer-motion";

import { fadeInUp, stagger } from "@/lib/motion";

import { ProjectCard } from "./project-card";

import type { Project } from "../data/projects";

interface RelatedProjectsProps {
  /**
   * Related projects for the current detail page — computed server-side from
   * the published CMS collection, never the legacy dataset.
   */
  projects: Project[];
}

/**
 * Related projects for a detail page.
 *
 * Renders the passed-in related projects (up to three that share the most
 * technology with the current one, excluding it), reusing the existing
 * ProjectCard. Renders `null` when nothing is related.
 */
export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col gap-3"
    >
      <h2 className="text-title font-semibold tracking-tight">Related Projects</h2>
      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </motion.section>
  );
}
