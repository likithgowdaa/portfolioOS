import { AwardIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** Certifications — credentials with full CRUD. */
export const certificationsSchema: EntitySchema = {
  name: "certifications",
  label: "Certifications",
  description: "Credentials displayed in the public certifications grid.",
  icon: AwardIcon,
  single: false,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        { key: "title", label: "Title", type: "text", required: true },
        { key: "issuer", label: "Provider", type: "text", placeholder: "e.g. AWS" },
        {
          key: "badge",
          label: "Badge Icon",
          type: "select",
          options: [
            { label: "Award", value: "award" },
            { label: "Shield Check", value: "shield-check" },
            { label: "Cloud", value: "cloud" },
            { label: "Server", value: "server" },
            { label: "Code", value: "code" },
            { label: "Layers", value: "layers" },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
          ],
        },
        {
          key: "highlight",
          label: "Highlight",
          type: "boolean",
          helper: "Featured credentials get a stronger badge tile.",
        },
      ],
    },
    {
      id: "dates",
      title: "Dates",
      fields: [
        { key: "issueDate", label: "Issue Date", type: "date", placeholder: "e.g. Jan 2024" },
        { key: "expiryDate", label: "Expiry Date", type: "date", placeholder: "e.g. Jan 2027" },
      ],
    },
    {
      id: "content",
      title: "Details",
      fields: [
        { key: "description", label: "Description", type: "markdown", rows: 4 },
        {
          key: "credentialId",
          label: "Credential ID",
          type: "text",
          placeholder: "e.g. ABC-123-XYZ",
        },
        { key: "skills", label: "Skills", type: "tags" },
      ],
    },
    {
      id: "links",
      title: "Verification",
      fields: [
        {
          key: "credentialUrl",
          label: "Verification URL",
          type: "url",
          placeholder: "https://",
          helper: "Powers the Verify Credential button.",
        },
      ],
    },
  ],
  defaults: () => ({
    id: "",
    title: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
    skills: [],
    badge: "award",
    status: "active",
    visibility: "draft",
    highlight: false,
    category: "cloud",
  }),
};
