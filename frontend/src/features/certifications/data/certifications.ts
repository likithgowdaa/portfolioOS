/**
 * Certifications data.
 *
 * Every certification's content and links live here — components render it
 * verbatim and hardcode nothing. A future Studio CMS will source these fields
 * from a database instead of this module.
 *
 * The list is intentionally empty: no certification information is invented.
 * Drop real credentials in here (or via the future CMS) and the grid renders
 * them automatically. `badge` is a plain string key from the
 * `CertificationBadge` vocabulary — the mapping to a Lucide component lives in
 * `certification-card.tsx`, keeping this module CMS-serializable.
 */

/** Category for future grouping/filtering — not rendered on the card. */
export type CertificationCategory =
  "cloud" | "infrastructure" | "security" | "devops" | "specialization";

/** Lifecycle stage, rendered as a status badge on the card. */
export type CertificationStatus = "active" | "expired";

/** CMS visibility — future Studio can publish/hide credentials without code. */
export type CertificationVisibility = "public" | "private" | "draft";

/** Badge-icon vocabulary — mapped to Lucide components in the UI layer. */
export type CertificationBadge = "award" | "shield-check" | "cloud" | "server" | "code" | "layers";

export interface Certification {
  id: string;
  title: string;
  /** The organization that issued the credential. */
  issuer: string;
  /** Human-readable issue date, e.g. "Jan 2024". Empty = hidden. */
  issueDate: string;
  /** Human-readable expiry date, e.g. "Jan 2027". Empty = hidden. */
  expiryDate: string;
  /** The credential reference number. Empty = hidden (not rendered yet). */
  credentialId: string;
  /** Public URL to verify the credential. Empty = hides the Verify button. */
  credentialUrl: string;
  description: string;
  /** Skills covered, rendered as chips. Empty array = hidden. */
  skills: string[];
  /** Badge-icon key from the `CertificationBadge` vocabulary. */
  badge: CertificationBadge;
  status: CertificationStatus;
  visibility: CertificationVisibility;
  /** Featured credentials get a stronger badge tile and card ring. */
  highlight: boolean;
  category: CertificationCategory;
}

export const CERTIFICATIONS: readonly Certification[] = [];

/** The subset of credentials actually rendered (public visibility). */
export function getVisibleCertifications(): Certification[] {
  return CERTIFICATIONS.filter((certification) => certification.visibility === "public");
}
