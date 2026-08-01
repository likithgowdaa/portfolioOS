import { UserRoundIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/**
 * Profile — identity + About. Public fields hide automatically when empty.
 * Email / GitHub / LinkedIn are edited in Contact; resume fields in Resume.
 */
export const profileSchema: EntitySchema = {
  name: "profile",
  label: "Profile",
  description: "Identity and About content shown on the public site.",
  icon: UserRoundIcon,
  single: true,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "role", label: "Role", type: "text", placeholder: "e.g. Cloud & DevOps Engineer" },
        { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
        { key: "headline", label: "Headline", type: "text" },
        {
          key: "availability",
          label: "Availability",
          type: "text",
          placeholder: "e.g. Available for Opportunities",
        },
        {
          key: "location",
          label: "Location",
          type: "text",
          placeholder: "e.g. Bangalore, Karnataka",
        },
        { key: "timezone", label: "Timezone", type: "text", placeholder: "e.g. Asia/Kolkata" },
      ],
    },
    {
      id: "content",
      title: "Content",
      description: "Long-form content for the About section. Empty fields are hidden.",
      fields: [
        {
          key: "bio",
          label: "Bio",
          type: "textarea",
          rows: 3,
          helper: "Short personal introduction.",
        },
        { key: "summary", label: "Summary", type: "textarea", rows: 4 },
        { key: "philosophy", label: "Engineering Philosophy", type: "markdown", rows: 5 },
        { key: "quote", label: "Quote", type: "textarea", rows: 2 },
        {
          key: "experienceLevel",
          label: "Experience Level",
          type: "text",
          placeholder: "e.g. 5+ years",
        },
        {
          key: "currentFocus",
          label: "Current Focus",
          type: "text",
          placeholder: "e.g. Platform engineering",
        },
        { key: "education", label: "Education", type: "textarea", rows: 2 },
      ],
    },
    {
      id: "media",
      title: "Media",
      fields: [
        {
          key: "photo",
          label: "Photo",
          type: "image",
          accept: ".png,.jpg,.jpeg,.webp",
          helper: "Upload, replace, or delete your public photo. No photo renders nothing.",
        },
        {
          key: "photoAlt",
          label: "Photo Alt Text",
          type: "text",
          helper: "Descriptive text for the photo (accessibility).",
        },
      ],
    },
    {
      id: "tags",
      title: "Tags",
      fields: [
        { key: "interests", label: "Interests", type: "tags" },
        { key: "funFacts", label: "Fun Facts", type: "tags" },
        { key: "portfolioUrl", label: "Portfolio URL", type: "url", placeholder: "https://" },
      ],
    },
  ],
  defaults: () => ({
    name: "",
    role: "",
    tagline: "",
    headline: "",
    philosophy: "",
    quote: "",
    bio: "",
    summary: "",
    experienceLevel: "",
    currentFocus: "",
    education: "",
    location: "",
    timezone: "",
    availability: "",
    photo: "",
    photoAlt: "",
    portfolioUrl: "",
    interests: [],
    funFacts: [],
  }),
};
