import type { LucideIcon } from "lucide-react";

import type { FieldSection } from "../form";

/**
 * Entity schema — describes one CMS entity for the schema-driven editors.
 * `sections` drives the form; `defaults` seeds a blank record for new items.
 */
export interface EntitySchema {
  /** CMS entity name (matches the store key / API segment). */
  name: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Single entities (profile, footer, seo) vs collections. */
  single: boolean;
  sections: FieldSection[];
  defaults: () => Record<string, unknown>;
}

/** The lifecycle choices every entity supports. */
export const VISIBILITY_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Hidden", value: "hidden" },
  { label: "Archived", value: "archived" },
];
