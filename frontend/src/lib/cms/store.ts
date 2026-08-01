import { randomUUID } from "crypto";

import type { Certification } from "@/features/certifications/data/certifications";
import type { JourneyEntry } from "@/features/journey/data/journey";
import type { Project } from "@/features/projects/data/projects";
import { getSupabaseAdmin } from "@/lib/supabase/server";

import type {
  CmsEntity,
  CmsEntityName,
  CmsItem,
  CmsStatus,
  CmsStore,
  ContactData,
  FooterData,
  ProfileData,
  ResumeData,
  SeoData,
} from "./types";

/**
 * CMS store — server-only Supabase persistence.
 *
 * Content lives in Supabase (tables mirroring `CmsStore`: profile, resume,
 * contact, footer, seo as single rows; projects, journey, certifications as one
 * row per item). The store reads and writes through the server-side `service_role`
 * client (see `src/lib/supabase/server.ts`), so RLS is bypassed here and enforced
 * for the public `anon` key (published rows only). Everything is server-only:
 * never import into a client component.
 *
 * The public API is unchanged from the file-backed store; each function maps one
 * row (or item) to the same `CmsEntity` / `CmsItem` shapes.
 */

export type SingleName = "profile" | "resume" | "contact" | "footer" | "seo";
export type CollectionName = "projects" | "journey" | "certifications";

/** Row shape for the single-entity tables (profile, resume, …). */
interface SingleRow {
  id: number;
  status: CmsStatus;
  data: unknown;
  draft: unknown | null;
  updated_at: string;
  published_at: string | null;
}

/** Row shape for the collection tables (projects, journey, …). */
interface ItemRow {
  id: string;
  status: CmsStatus;
  sort_order: number;
  data: unknown;
  draft: unknown | null;
  updated_at: string;
  published_at: string | null;
}

/** Normalize a PostgREST timestamp (ISO string or Date) to an ISO string. */
function toIso(value: string | Date | null | undefined): string | null {
  if (value == null) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toEntity<T>(row: SingleRow | null): CmsEntity<T> | null {
  if (!row) return null;
  return {
    status: row.status,
    data: row.data as T,
    draft: (row.draft ?? null) as T | null,
    updatedAt: toIso(row.updated_at) ?? "",
    publishedAt: toIso(row.published_at),
  };
}

function toItem<T>(row: ItemRow): CmsItem<T> {
  return {
    id: row.id,
    status: row.status,
    order: row.sort_order,
    data: row.data as T,
    draft: (row.draft ?? null) as T | null,
    updatedAt: toIso(row.updated_at) ?? "",
    publishedAt: toIso(row.published_at),
  };
}

/**
 * Read the full store from Supabase; returns null when the database is not
 * seeded yet (no single rows exist). Throws on a database error.
 */
async function readStoreRaw(): Promise<CmsStore | null> {
  const db = getSupabaseAdmin();
  const [profile, resume, contact, footer, seo, projects, journey, certifications] =
    await Promise.all([
      db.from("profile").select("*").maybeSingle(),
      db.from("resume").select("*").maybeSingle(),
      db.from("contact").select("*").maybeSingle(),
      db.from("footer").select("*").maybeSingle(),
      db.from("seo").select("*").maybeSingle(),
      db.from("projects").select("*").order("sort_order", { ascending: true }),
      db.from("journey").select("*").order("sort_order", { ascending: true }),
      db.from("certifications").select("*").order("sort_order", { ascending: true }),
    ]);

  const singles = [profile, resume, contact, footer, seo];
  for (const result of [...singles, projects, journey, certifications]) {
    if (result.error) throw result.error;
  }

  // Seeded only when every single entity exists. An unseeded database returns
  // null so `getStore()` can seed defaults (mirrors the missing-file case).
  if (singles.some((result) => result.data == null)) return null;

  return {
    version: 1,
    profile: toEntity<ProfileData>(profile.data as SingleRow | null)!,
    resume: toEntity<ResumeData>(resume.data as SingleRow | null)!,
    contact: toEntity<ContactData>(contact.data as SingleRow | null)!,
    footer: toEntity<FooterData>(footer.data as SingleRow | null)!,
    seo: toEntity<SeoData>(seo.data as SingleRow | null)!,
    projects: {
      items: ((projects.data as ItemRow[] | null) ?? []).map((row) => toItem<Project>(row)),
    },
    journey: {
      items: ((journey.data as ItemRow[] | null) ?? []).map((row) => toItem<JourneyEntry>(row)),
    },
    certifications: {
      items: ((certifications.data as ItemRow[] | null) ?? []).map((row) =>
        toItem<Certification>(row)
      ),
    },
  };
}

/** Read the raw store; returns null when it does not exist or is unavailable. */
export async function readStore(): Promise<CmsStore | null> {
  try {
    return await readStoreRaw();
  } catch {
    return null;
  }
}

/** Write every entity of the store as rows (used to seed an empty database). */
async function seedStore(store: CmsStore): Promise<void> {
  const db = getSupabaseAdmin();

  const singles: [SingleName, CmsEntity<unknown>][] = [
    ["profile", store.profile],
    ["resume", store.resume],
    ["contact", store.contact],
    ["footer", store.footer],
    ["seo", store.seo],
  ];
  for (const [name, entity] of singles) {
    const { error } = await db.from(name).upsert(
      {
        id: 1,
        status: entity.status,
        data: entity.data,
        draft: entity.draft,
        updated_at: entity.updatedAt,
        published_at: entity.publishedAt,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
    if (error) throw error;
  }

  const collections: [CollectionName, { items: CmsItem<unknown>[] }][] = [
    ["projects", store.projects],
    ["journey", store.journey],
    ["certifications", store.certifications],
  ];
  for (const [name, { items }] of collections) {
    for (const item of items) {
      const { error } = await db.from(name).upsert(
        {
          id: item.id,
          status: item.status,
          sort_order: item.order,
          data: item.data,
          draft: item.draft,
          updated_at: item.updatedAt,
          published_at: item.publishedAt,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
      if (error) throw error;
    }
  }
}

/** True only when every table is empty (so defaults can be seeded safely). */
async function isStoreEmpty(): Promise<boolean> {
  const db = getSupabaseAdmin();
  const tables = [
    "profile",
    "resume",
    "contact",
    "footer",
    "seo",
    "projects",
    "journey",
    "certifications",
  ];
  const results = await Promise.all(
    tables.map((table) => db.from(table).select("id", { count: "exact", head: true }))
  );
  for (const result of results) {
    if (result.error) throw result.error;
  }
  return results.every((result) => (result.count ?? 0) === 0);
}

/** Load the store, seeding it from defaults when the database is empty. */
export async function getStore(): Promise<CmsStore> {
  try {
    const existing = await readStoreRaw();
    if (existing) return existing;

    const { buildDefaultStore } = await import("./defaults");
    const defaults = buildDefaultStore();
    // Seed only a completely empty database; never write over partial data.
    if (await isStoreEmpty()) await seedStore(defaults);
    return defaults;
  } catch {
    const { buildDefaultStore } = await import("./defaults");
    return buildDefaultStore();
  }
}

/* ── Single entities (profile, footer, seo) ──────────────────────────────── */

/**
 * Upsert a single entity. When `publish` is true the data becomes the
 * published content (draft cleared, status published); otherwise it is saved
 * as a draft and the published content is untouched.
 */
export async function upsertSingle<T>(
  name: SingleName,
  input: { data: T; publish: boolean; status?: CmsStatus }
): Promise<CmsEntity<T>> {
  const db = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: row, error: readError } = await db.from(name).select("*").eq("id", 1).maybeSingle();
  if (readError) throw readError;

  const single = row as SingleRow | null;
  const entity: CmsEntity<T> = input.publish
    ? {
        status: "published",
        data: input.data,
        draft: null,
        updatedAt: now,
        publishedAt: now,
      }
    : {
        status: input.status ?? (single?.status === "published" ? "published" : "draft"),
        data: (single?.data ?? input.data) as T,
        draft: input.data,
        updatedAt: now,
        publishedAt: toIso(single?.published_at),
      };

  const { error } = await db.from(name).upsert(
    {
      id: 1,
      status: entity.status,
      data: entity.data,
      draft: entity.draft,
      updated_at: entity.updatedAt,
      published_at: entity.publishedAt,
    },
    { onConflict: "id" }
  );
  if (error) throw error;
  return entity;
}

/* ── Collections (projects, journey, certifications) ─────────────────────── */

/**
 * Upsert a collection item (create when the id is new). When `publish` is
 * true the data becomes the published item; otherwise it is saved as a draft.
 */
export async function upsertItem<T>(
  name: CollectionName,
  input: { id?: string; data: T; publish: boolean; status?: CmsStatus }
): Promise<CmsItem<T>> {
  const db = getSupabaseAdmin();
  const now = new Date().toISOString();
  const existing = input.id
    ? await db.from(name).select("*").eq("id", input.id).maybeSingle()
    : { data: null as ItemRow | null, error: null };
  if (existing.error) throw existing.error;

  const row = existing.data as ItemRow | null;
  if (row) {
    const item: CmsItem<T> = input.publish
      ? {
          id: row.id,
          status: "published",
          order: row.sort_order,
          data: input.data,
          draft: null,
          updatedAt: now,
          publishedAt: now,
        }
      : {
          id: row.id,
          status: input.status ?? (row.status === "published" ? "published" : "draft"),
          order: row.sort_order,
          data: row.data as T,
          draft: input.data,
          updatedAt: now,
          publishedAt: toIso(row.published_at),
        };

    const { error } = await db
      .from(name)
      .update({
        status: item.status,
        data: item.data,
        draft: item.draft,
        updated_at: item.updatedAt,
        published_at: item.publishedAt,
      })
      .eq("id", row.id);
    if (error) throw error;
    return item;
  }

  // New item: append at the end of the collection.
  const { data: last, error: maxError } = await db
    .from(name)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  if (maxError) throw maxError;
  const order = ((last?.[0]?.sort_order as number | undefined) ?? 0) + 1;

  const id = input.id ?? randomUUID();
  const item: CmsItem<T> = {
    id,
    status: input.publish ? "published" : (input.status ?? "draft"),
    order,
    data: input.data,
    draft: input.publish ? null : input.data,
    updatedAt: now,
    publishedAt: input.publish ? now : null,
  };

  const { error } = await db.from(name).insert({
    id,
    status: item.status,
    sort_order: order,
    data: item.data,
    draft: item.draft,
    updated_at: item.updatedAt,
    published_at: item.publishedAt,
  });
  if (error) throw error;
  return item;
}

/** Hard-delete a collection item. Returns false when nothing was removed. */
export async function deleteItem(name: CollectionName, id: string): Promise<boolean> {
  const db = getSupabaseAdmin();
  const { count, error } = await db.from(name).delete({ count: "exact" }).eq("id", id);
  if (error) throw error;
  return (count ?? 0) > 0;
}

/** Set a collection item's visibility status (draft/published/hidden/archived). */
export async function setItemStatus(
  name: CollectionName,
  id: string,
  status: CmsStatus
): Promise<void> {
  const db = getSupabaseAdmin();
  const { data: row, error: readError } = await db
    .from(name)
    .select("published_at")
    .eq("id", id)
    .maybeSingle();
  if (readError) throw readError;
  if (!row) return; // no-op when the item does not exist

  const existing = row as { published_at: string | null };
  const publishedAt =
    status === "published"
      ? (toIso(existing.published_at) ?? new Date().toISOString())
      : toIso(existing.published_at);

  const { error } = await db
    .from(name)
    .update({ status, updated_at: new Date().toISOString(), published_at: publishedAt })
    .eq("id", id);
  if (error) throw error;
}

/** Reorder collection items by the given id list. */
export async function reorderItems(name: CollectionName, ids: string[]): Promise<void> {
  const db = getSupabaseAdmin();
  for (let i = 0; i < ids.length; i++) {
    const { error } = await db
      .from(name)
      .update({ sort_order: i + 1 })
      .eq("id", ids[i]);
    if (error) throw error;
  }

  // Preserve the file-backed semantics: reorder rebuilds the collection from the
  // id list, so items not listed are removed from it.
  const { data: rows, error: listError } = await db.from(name).select("id");
  if (listError) throw listError;
  const toDelete = ((rows as { id: string }[] | null) ?? [])
    .filter((row) => !ids.includes(row.id))
    .map((row) => row.id);
  for (const id of toDelete) {
    const { error } = await db.from(name).delete().eq("id", id);
    if (error) throw error;
  }
}

/** Name of the collection an item belongs to, from a route segment. */
export function isCollectionName(name: string): name is CollectionName {
  return name === "projects" || name === "journey" || name === "certifications";
}

export function isSingleName(name: string): name is SingleName {
  return (
    name === "profile" ||
    name === "resume" ||
    name === "contact" ||
    name === "footer" ||
    name === "seo"
  );
}

export function isEntityName(name: string): name is CmsEntityName {
  return isCollectionName(name) || isSingleName(name);
}
