import { buildDefaultStore } from "./defaults";
import { readStore } from "./store";
import type {
  CmsEntity,
  CmsItem,
  ContactData,
  ProfileContent,
  PublicContent,
  ResumeData,
} from "./types";

/**
 * Public content — what the portfolio renders.
 *
 * Server-only. Reads the CMS store (or the baseline defaults when it does not
 * exist yet) and returns only *published* content, ordered. Single entities
 * resolve to their published `data`; hidden or archived states either fall
 * back to the baseline (structural entities: profile, footer, seo) or
 * contribute nothing (resume, contact), so the site stays coherent and hides
 * sections per the global "empty data → hidden" rule.
 */

function resolve<T>(entity: CmsEntity<T> | undefined, options: { fallback: T; hidden?: T }): T {
  if (!entity) return options.fallback;
  if (entity.status === "hidden" || entity.status === "archived") {
    return options.hidden ?? options.fallback;
  }
  return entity.data;
}

function emptyResume(): ResumeData {
  return {
    resumeAvailable: false,
    resumeTitle: "",
    resumeDescription: "",
    resumeUrl: "",
    resumeLastUpdated: "",
    resumeFileSize: "",
  };
}

function emptyContact(): ContactData {
  return {
    email: "",
    github: "",
    linkedin: "",
    location: "",
    timezone: "",
    availability: "",
    website: "",
    additionalLinks: [],
  };
}

function publishedItems<T>(collection: { items: CmsItem<T>[] }): T[] {
  return [...collection.items]
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order)
    .map((item) => item.data);
}

export async function getPublicContent(): Promise<PublicContent> {
  const store = (await readStore()) ?? buildDefaultStore();
  const defaults = buildDefaultStore();

  const profile = resolve(store.profile, { fallback: defaults.profile.data });
  const contact = resolve(store.contact, {
    fallback: defaults.contact.data,
    hidden: emptyContact(),
  });
  const resume = resolve(store.resume, {
    fallback: defaults.resume.data,
    hidden: emptyResume(),
  });

  return {
    profile: { ...profile, ...contact, ...resume } as ProfileContent,
    footer: resolve(store.footer, { fallback: defaults.footer.data }),
    seo: resolve(store.seo, { fallback: defaults.seo.data }),
    projects: publishedItems(store.projects),
    journey: publishedItems(store.journey),
    certifications: publishedItems(store.certifications),
  };
}
