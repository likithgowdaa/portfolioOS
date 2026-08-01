import { MailIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** Contact — only fields with data render on the public site. */
export const contactSchema: EntitySchema = {
  name: "contact",
  label: "Contact",
  description: "How visitors reach you — only filled fields render.",
  icon: MailIcon,
  single: true,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        {
          key: "email",
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
          helper: "Powers the Contact section's 'Let's Connect' button.",
        },
        { key: "github", label: "GitHub", type: "url", placeholder: "https://github.com/" },
        {
          key: "linkedin",
          label: "LinkedIn",
          type: "url",
          placeholder: "https://linkedin.com/in/",
        },
        { key: "website", label: "Website", type: "url", placeholder: "https://" },
        { key: "location", label: "Location", type: "text" },
        { key: "timezone", label: "Timezone", type: "text" },
        { key: "availability", label: "Availability", type: "text" },
      ],
    },
    {
      id: "content",
      title: "Additional Links",
      fields: [
        {
          key: "additionalLinks",
          label: "Links",
          type: "tags",
          helper: "Extra links shown in the contact section.",
        },
      ],
    },
  ],
  defaults: () => ({
    email: "",
    github: "",
    linkedin: "",
    location: "",
    timezone: "",
    availability: "",
    website: "",
    additionalLinks: [],
  }),
};
