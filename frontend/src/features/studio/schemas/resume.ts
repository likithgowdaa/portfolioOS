import { FileTextIcon } from "lucide-react";

import type { EntitySchema } from "./types";

/** Resume — the asset and its metadata. Hidden entirely when unavailable. */
export const resumeSchema: EntitySchema = {
  name: "resume",
  label: "Resume",
  description: "The resume asset and how the public section presents it.",
  icon: FileTextIcon,
  single: true,
  sections: [
    {
      id: "general",
      title: "General",
      fields: [
        {
          key: "resumeAvailable",
          label: "Available",
          type: "boolean",
          helper: "When off, the public Resume section disappears automatically.",
        },
        { key: "resumeTitle", label: "Title", type: "text", placeholder: "e.g. Resume" },
        { key: "resumeDescription", label: "Description", type: "textarea", rows: 2 },
      ],
    },
    {
      id: "media",
      title: "Media",
      fields: [
        {
          key: "resumeUrl",
          label: "Resume File",
          type: "file",
          accept: ".pdf",
          helper: "Upload a PDF. Replace or delete from the control.",
        },
      ],
    },
    {
      id: "metadata",
      title: "Metadata",
      fields: [
        {
          key: "resumeLastUpdated",
          label: "Last Updated",
          type: "date",
          placeholder: "e.g. Jan 2026",
        },
        { key: "resumeFileSize", label: "File Size", type: "text", placeholder: "e.g. 180 KB" },
      ],
    },
  ],
  defaults: () => ({
    resumeAvailable: false,
    resumeTitle: "",
    resumeDescription: "",
    resumeUrl: "",
    resumeLastUpdated: "",
    resumeFileSize: "",
  }),
};
