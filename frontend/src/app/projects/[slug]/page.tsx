import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/features/projects/components/project-detail";
import { getRelatedProjects } from "@/features/projects/data/projects";
import { getPublicContent } from "@/lib/cms/public";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Content is CMS-managed at runtime, so pages render on demand.
export const dynamic = "force-dynamic";

/** Dynamic metadata per project. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getPublicContent()).projects.find((item) => item.slug === slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.shortDescription,
  };
}

/**
 * Project detail page — `/projects/[slug]`.
 *
 * A server component that resolves the project from the CMS content, derives
 * the related projects from that same published collection, and hands both to a
 * client component for rendering with animations.
 */
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getPublicContent();
  const project = content.projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <ProjectDetail
      project={project}
      relatedProjects={getRelatedProjects(project, content.projects)}
    />
  );
}
