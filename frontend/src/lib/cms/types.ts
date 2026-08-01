import type { Certification } from "@/features/certifications/data/certifications";
import type { JourneyEntry } from "@/features/journey/data/journey";
import type { Project } from "@/features/projects/data/projects";

/**
 * CMS data model — the single source of truth for Studio content.
 *
 * Single entities (profile, resume, contact, footer, seo) hold one `CmsEntity`;
 * collections (projects, journey, certifications) hold `CmsItem`s. Every item
 * carries an explicit lifecycle status — publishing is never automatic.
 * `data` is the published content the public site renders; `draft` holds
 * unpublished edits.
 */

export type CmsStatus = "draft" | "published" | "hidden" | "archived";

export interface CmsEntity<T> {
  status: CmsStatus;
  /** Published content — what the public site renders. */
  data: T;
  /** Unpublished edits; `null` when the published data is current. */
  draft: T | null;
  updatedAt: string;
  publishedAt: string | null;
}

export interface CmsItem<T> {
  id: string;
  status: CmsStatus;
  order: number;
  data: T;
  draft: T | null;
  updatedAt: string;
  publishedAt: string | null;
}

/* ── Data payloads ───────────────────────────────────────────────────────── */

/** Identity + About fields. Every field hides on the public site when empty. */
export interface ProfileData {
  name: string;
  role: string;
  tagline: string;
  headline: string;
  philosophy: string;
  quote: string;
  bio: string;
  summary: string;
  experienceLevel: string;
  currentFocus: string;
  education: string;
  location: string;
  timezone: string;
  availability: string;
  /** Public photo path (e.g. `/uploads/photo.webp`). Empty = no photo. */
  photo: string;
  photoAlt: string;
  portfolioUrl: string;
  interests: string[];
  funFacts: string[];
}

/** Resume asset + display metadata. Hidden when no asset exists. */
export interface ResumeData {
  resumeAvailable: boolean;
  resumeTitle: string;
  resumeDescription: string;
  resumeUrl: string;
  resumeLastUpdated: string;
  resumeFileSize: string;
}

/** Contact channels. Only fields with data render. */
export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  timezone: string;
  availability: string;
  website: string;
  additionalLinks: string[];
}

/** Footer copy + links. Empty values hide automatically. */
export interface FooterData {
  copyright: string;
  tagline: string;
  note: string;
  github: string;
  linkedin: string;
  email: string;
}

/** Site metadata — drives the root layout, OG, robots, and sitemap. */
export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  favicon: string;
  siteImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterCard: string;
  robots: string;
  /** Whether the sitemap includes Studio pages. Always false. */
  sitemap: boolean;
}

/**
 * The merged profile the public site renders — one object assembled from the
 * profile, resume, and contact entities. The public features read a single
 * `profile` object (as before v2.1.0); the CMS keeps the areas editable as
 * separate entities, each with its own lifecycle.
 */
export type ProfileContent = ProfileData & ResumeData & ContactData;

/* ── Store shape ─────────────────────────────────────────────────────────── */

export interface CmsStore {
  version: 1;
  profile: CmsEntity<ProfileData>;
  resume: CmsEntity<ResumeData>;
  contact: CmsEntity<ContactData>;
  footer: CmsEntity<FooterData>;
  seo: CmsEntity<SeoData>;
  projects: { items: CmsItem<Project>[] };
  journey: { items: CmsItem<JourneyEntry>[] };
  certifications: { items: CmsItem<Certification>[] };
}

/** Keys of the entities in the store, in sidebar order. */
export type CmsEntityName = keyof CmsStore;

/** The content object `getPublicContent()` returns for the public site. */
export interface PublicContent {
  profile: ProfileContent;
  footer: FooterData;
  seo: SeoData;
  projects: Project[];
  journey: JourneyEntry[];
  certifications: Certification[];
}
