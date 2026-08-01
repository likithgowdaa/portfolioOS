import { RouteIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** Journey — timeline entries with full CRUD. */
export const journeySchema: EntitySchema = {
  name: "journey",
  label: "Journey",
  description: "Timeline entries shown in the public journey section.",
  icon: RouteIcon,
  single: false,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "date", label: "Date", type: "date", placeholder: "e.g. 2022 — 2024" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: [
            { label: "Education", value: "education" },
            { label: "Experience", value: "experience" },
            { label: "Milestone", value: "milestone" },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Completed", value: "completed" },
            { label: "Current", value: "current" },
            { label: "Planned", value: "planned" },
          ],
        },
        {
          key: "icon",
          label: "Icon",
          type: "select",
          options: [
            { label: "Graduation Cap", value: "graduation-cap" },
            { label: "Briefcase", value: "briefcase" },
            { label: "Award", value: "award" },
            { label: "Sparkles", value: "sparkles" },
            { label: "Rocket", value: "rocket" },
            { label: "Code", value: "code" },
          ],
        },
        {
          key: "highlight",
          label: "Highlight",
          type: "boolean",
          helper: "Featured entries get a stronger dot and card ring.",
        },
      ],
    },
    {
      id: "content",
      title: "Content",
      fields: [
        { key: "subtitle", label: "Subtitle", type: "text" },
        { key: "description", label: "Description", type: "markdown", rows: 5 },
        { key: "technologies", label: "Technologies", type: "tags" },
      ],
    },
    {
      id: "links",
      title: "Links",
      fields: [
        {
          key: "links",
          label: "External Links",
          type: "repeatable",
          helper: "Each row is a button label and its URL.",
          subFields: [
            { key: "label", label: "Label", type: "text", placeholder: "e.g. View project" },
            { key: "url", label: "URL", type: "text", placeholder: "https://" },
          ],
        },
      ],
    },
  ],
  defaults: () => ({
    id: "",
    date: "",
    title: "",
    subtitle: "",
    description: "",
    category: "experience",
    status: "completed",
    icon: "briefcase",
    highlight: false,
    visibility: "draft",
    technologies: [],
    links: [],
  }),
};
