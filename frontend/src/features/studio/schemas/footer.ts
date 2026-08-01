import { PanelBottomIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** Footer — copy and links. Empty values hide automatically. */
export const footerSchema: EntitySchema = {
  name: "footer",
  label: "Footer",
  description: "The footer's text and social links.",
  icon: PanelBottomIcon,
  single: true,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        {
          key: "copyright",
          label: "Copyright Name",
          type: "text",
          helper: "Used for the © line. Falls back to your name when empty.",
        },
        { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
        { key: "note", label: "Footer Note", type: "textarea", rows: 2 },
      ],
    },
    {
      id: "social",
      title: "Social Links",
      fields: [
        { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/" },
        {
          key: "linkedin",
          label: "LinkedIn",
          type: "url",
          placeholder: "https://linkedin.com/in/",
        },
        { key: "email", label: "Email", type: "text", placeholder: "you@example.com" },
      ],
    },
  ],
  defaults: () => ({
    copyright: "",
    tagline: "",
    note: "",
    github: "",
    linkedin: "",
    email: "",
  }),
};
