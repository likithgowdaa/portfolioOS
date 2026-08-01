import { FolderIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/**
 * Projects — full CRUD. `id`/`order`/visibility are managed by the editor
 * workflow; every content field is editable here.
 */
export const projectsSchema: EntitySchema = {
  name: "projects",
  label: "Projects",
  description: "The projects displayed in the public projects grid.",
  icon: FolderIcon,
  single: false,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        {
          key: "slug",
          label: "Slug",
          type: "text",
          required: true,
          helper: "URL path — e.g. cloud-cicd-pipeline",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Live", value: "live" },
            { label: "Beta", value: "beta" },
            { label: "In Development", value: "in-development" },
            { label: "Archived", value: "archived" },
          ],
          helper: "Shown as a badge on the card.",
        },
        {
          key: "featured",
          label: "Featured",
          type: "boolean",
          helper: "Featured projects are surfaced first.",
        },
        { key: "timeline", label: "Timeline", type: "date", placeholder: "e.g. Jan — Mar 2024" },
        { key: "difficulty", label: "Difficulty", type: "text", placeholder: "e.g. Advanced" },
        {
          key: "estimatedDuration",
          label: "Estimated Duration",
          type: "text",
          placeholder: "e.g. 3 months",
        },
      ],
    },
    {
      id: "content",
      title: "Content",
      fields: [
        {
          key: "shortDescription",
          label: "Short Description",
          type: "textarea",
          rows: 3,
          helper: "Shown on the project card.",
        },
        { key: "longDescription", label: "Long Description", type: "markdown", rows: 8 },
        { key: "problem", label: "Problem", type: "markdown", rows: 5 },
        { key: "solution", label: "Solution", type: "markdown", rows: 5 },
        { key: "features", label: "Features", type: "tags" },
        { key: "architectureTitle", label: "Architecture Title", type: "text" },
        { key: "architecture", label: "Architecture", type: "markdown", rows: 6 },
        {
          key: "architectureFlow",
          label: "Architecture Flow",
          type: "tags",
          helper: "Ordered flow steps.",
        },
        { key: "challenges", label: "Challenges", type: "tags" },
        { key: "learnings", label: "Learnings", type: "tags" },
      ],
    },
    {
      id: "media",
      title: "Media",
      fields: [
        {
          key: "coverImage",
          label: "Cover Image",
          type: "image",
          accept: ".png,.jpg,.jpeg,.webp,.svg",
        },
        {
          key: "gallery",
          label: "Gallery",
          type: "images",
          helper: "Add, reorder, or remove gallery images.",
        },
      ],
    },
    {
      id: "links",
      title: "Links & Stack",
      fields: [
        { key: "techStack", label: "Tech Stack", type: "tags" },
        { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/" },
        { key: "demo", label: "Live Demo", type: "url", placeholder: "https://" },
        { key: "docs.documentation", label: "Documentation URL", type: "url" },
        { key: "docs.architecture", label: "Architecture Document URL", type: "url" },
        { key: "docs.apiReference", label: "API Reference URL", type: "url" },
      ],
    },
  ],
  defaults: () => ({
    id: "",
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    problem: "",
    solution: "",
    features: [],
    techStack: [],
    status: "in-development",
    coverImage: "",
    featured: false,
    architectureTitle: "",
    architecture: "",
    architectureFlow: [],
    challenges: [],
    learnings: [],
    engineeringDecisions: [],
    difficulty: "",
    estimatedDuration: "",
    timeline: "",
    github: "",
    demo: "",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "draft",
  }),
};
