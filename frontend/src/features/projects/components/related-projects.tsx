"use client";

import { motion } from "framer-motion";

import { fadeInUp, stagger } from "@/lib/motion";

import { getRelatedProjects } from "../data/projects";
import { ProjectCard } from "./project-card";

import type { Project } from "../data/projects";

interface RelatedProjectsProps {
  /** The project whose detail page this section appears on. */
  current: Project;
}

/**
 * Related projects for a detail page.
 *
 * Shows up to three projects that share the most technology with the current
 * one (excluding it), reusing the existing ProjectCard. Renders `null` when
 * nothing is related.
 */
export function RelatedProjects({ current }: RelatedProjectsProps) {
  const related = getRelatedProjects(current);

  if (related.length === 0) return null;

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
        {related.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </motion.section>
  );
}
