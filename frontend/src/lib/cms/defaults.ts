import { CERTIFICATIONS } from "@/features/certifications/data/certifications";
import { JOURNEY } from "@/features/journey/data/journey";
import { PROJECTS } from "@/features/projects/data/projects";
import { profile } from "@/lib/profile";
import { siteConfig } from "@/lib/site";

import type {
  CmsEntity,
  CmsItem,
  CmsStatus,
  CmsStore,
  ContactData,
  ProfileData,
  ResumeData,
} from "./types";

/**
 * Default store — the baseline content before any Studio edits.
 *
 * Seeds the CMS from the existing data modules so the public site is
 * byte-for-byte unchanged out of the box. Legacy `visibility` maps to the CMS
 * lifecycle: public → published, private → hidden, draft → draft.
 */

function legacyVisibility(visibility: string): CmsStatus {
  if (visibility === "public") return "published";
  if (visibility === "draft") return "draft";
  return "hidden";
}

function seedItems<T extends { id: string; visibility: string }>(
  items: readonly T[]
): CmsItem<T>[] {
  const now = new Date().toISOString();
  return items.map((item, index) => ({
    id: item.id,
    status: legacyVisibility(item.visibility),
    order: index + 1,
    data: item,
    draft: null,
    updatedAt: now,
    publishedAt: legacyVisibility(item.visibility) === "published" ? now : null,
  }));
}

function seeded<T>(data: T): CmsEntity<T> {
  const now = new Date().toISOString();
  return {
    status: "published",
    data,
    draft: null,
    updatedAt: now,
    publishedAt: now,
  };
}

function defaultProfile(): ProfileData {
  return {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    headline: "",
    philosophy: "",
    quote: "",
    bio: profile.bio,
    summary: profile.summary,
    experienceLevel: profile.experienceLevel,
    currentFocus: profile.currentFocus,
    education: profile.education,
    location: profile.location,
    timezone: "",
    availability: profile.availability,
    photo: "",
    photoAlt: "",
    portfolioUrl: "",
    interests: [...profile.interests],
    funFacts: [...profile.funFacts],
  };
}

function defaultResume(): ResumeData {
  return {
    resumeAvailable: profile.resumeAvailable,
    resumeTitle: profile.resumeTitle,
    resumeDescription: profile.resumeDescription,
    resumeUrl: profile.resumeUrl,
    resumeLastUpdated: profile.resumeLastUpdated,
    resumeFileSize: profile.resumeFileSize,
  };
}

function defaultContact(): ContactData {
  return {
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    location: profile.location,
    timezone: "",
    availability: profile.availability,
    website: "",
    additionalLinks: [],
  };
}

export function buildDefaultStore(): CmsStore {
  const title = profile.role.length > 0 ? `${profile.name} — ${profile.role}` : profile.name;
  const description = profile.tagline.length > 0 ? profile.tagline : siteConfig.description;

  return {
    version: 1,
    profile: seeded(defaultProfile()),
    resume: seeded(defaultResume()),
    contact: seeded(defaultContact()),
    footer: seeded({
      copyright: profile.name,
      tagline: profile.tagline,
      note: "Built with Next.js, FastAPI and ❤️",
      github: profile.github,
      linkedin: profile.linkedin,
      email: profile.email,
    }),
    seo: seeded({
      title,
      description,
      keywords: [profile.name, profile.role, profile.location, siteConfig.name].filter(Boolean),
      canonical: siteConfig.url,
      favicon: "/favicon.ico",
      siteImage: "",
      ogTitle: title,
      ogDescription: description,
      twitterCard: "summary",
      robots: "index, follow",
      sitemap: true,
    }),
    projects: { items: seedItems(PROJECTS) },
    journey: { items: seedItems(JOURNEY) },
    certifications: { items: seedItems(CERTIFICATIONS) },
  };
}
