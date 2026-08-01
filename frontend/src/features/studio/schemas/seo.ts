import { SearchIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** SEO — site metadata: titles, Open Graph, Twitter card, icons, robots. */
export const seoSchema: EntitySchema = {
  name: "seo",
  label: "SEO",
  description: "How the site appears in search results and social shares.",
  icon: SearchIcon,
  single: true,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        {
          key: "title",
          label: "Title",
          type: "text",
          helper: "Shown in search results and browser tabs.",
        },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
        { key: "keywords", label: "Keywords", type: "tags" },
        { key: "canonical", label: "Canonical URL", type: "url", placeholder: "https://" },
      ],
    },
    {
      id: "media",
      title: "Media",
      fields: [
        { key: "favicon", label: "Favicon", type: "image", accept: ".png,.ico,.webp" },
        {
          key: "siteImage",
          label: "Site Image",
          type: "image",
          helper: "Used for social shares when no specific image exists.",
        },
      ],
    },
    {
      id: "social",
      title: "Social Sharing",
      fields: [
        { key: "ogTitle", label: "OpenGraph Title", type: "text" },
        { key: "ogDescription", label: "OpenGraph Description", type: "textarea", rows: 2 },
        {
          key: "twitterCard",
          label: "Twitter Card",
          type: "select",
          options: [
            { label: "Summary", value: "summary" },
            { label: "Summary (large image)", value: "summary_large_image" },
            { label: "Player", value: "player" },
            { label: "App", value: "app" },
          ],
        },
      ],
    },
    {
      id: "metadata",
      title: "Robots & Sitemap",
      fields: [
        { key: "robots", label: "Robots", type: "text", placeholder: "index, follow" },
        {
          key: "sitemap",
          label: "Include in Sitemap",
          type: "boolean",
          helper: "The public sitemap always excludes /studio; this controls the public pages.",
        },
      ],
    },
  ],
  defaults: () => ({
    title: "",
    description: "",
    keywords: [],
    canonical: "",
    favicon: "/favicon.ico",
    siteImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterCard: "summary",
    robots: "index, follow",
    sitemap: true,
  }),
};
