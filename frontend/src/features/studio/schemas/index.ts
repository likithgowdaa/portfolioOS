import { certificationsSchema } from "./certifications";
import { contactSchema } from "./contact";
import { footerSchema } from "./footer";
import { journeySchema } from "./journey";
import { profileSchema } from "./profile";
import { projectsSchema } from "./projects";
import { resumeSchema } from "./resume";
import { seoSchema } from "./seo";
import type { EntitySchema } from "./types";

export { VISIBILITY_OPTIONS } from "./types";
export type { EntitySchema } from "./types";

/** Registry of every CMS entity schema, keyed by entity name. */
export const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
  profile: profileSchema,
  resume: resumeSchema,
  contact: contactSchema,
  footer: footerSchema,
  seo: seoSchema,
  projects: projectsSchema,
  journey: journeySchema,
  certifications: certificationsSchema,
};
