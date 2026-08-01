import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import type { CmsEntity, CmsEntityName, CmsItem, CmsStatus, CmsStore } from "./types";

/**
 * CMS store — server-only JSON persistence.
 *
 * Content lives in `data/cms/store.json` (git-ignored; a Supabase database
 * replaces it in a later milestone). Writes are atomic (temp file + rename).
 * Everything here is server-only: never import into a client component.
 */

export const STORE_DIR = path.join(process.cwd(), "data", "cms");
const STORE_FILE = path.join(STORE_DIR, "store.json");

export type SingleName = "profile" | "resume" | "contact" | "footer" | "seo";
export type CollectionName = "projects" | "journey" | "certifications";

/** Read the raw store; returns null when it does not exist yet. */
export async function readStore(): Promise<CmsStore | null> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    return JSON.parse(raw) as CmsStore;
  } catch {
    return null;
  }
}

async function writeStore(store: CmsStore): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  const tmp = `${STORE_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, STORE_FILE);
}

/** Load the store, seeding it from defaults on first run. */
export async function getStore(): Promise<CmsStore> {
  const existing = await readStore();
  if (existing) return existing;
  const { buildDefaultStore } = await import("./defaults");
  const fresh = buildDefaultStore();
  await writeStore(fresh);
  return fresh;
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
  const store = await getStore();
  const entity = store[name] as CmsEntity<unknown>;
  const now = new Date().toISOString();

  if (input.publish) {
    entity.data = input.data;
    entity.draft = null;
    entity.status = "published";
    entity.publishedAt = now;
  } else {
    entity.draft = input.data;
    entity.status = input.status ?? (entity.status === "published" ? "published" : "draft");
  }
  entity.updatedAt = now;

  await writeStore(store);
  return entity as CmsEntity<T>;
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
  const store = await getStore();
  const collection = store[name] as { items: CmsItem<unknown>[] };
  const now = new Date().toISOString();
  const existing = input.id ? collection.items.find((item) => item.id === input.id) : undefined;

  let item: CmsItem<unknown>;
  if (existing) {
    item = existing;
    if (input.publish) {
      item.data = input.data;
      item.draft = null;
      item.status = "published";
      item.publishedAt = now;
    } else {
      item.draft = input.data;
      item.status = input.status ?? (item.status === "published" ? "published" : "draft");
    }
    item.updatedAt = now;
  } else {
    item = {
      id: input.id ?? randomUUID(),
      status: input.publish ? "published" : (input.status ?? "draft"),
      order: collection.items.length + 1,
      data: input.data,
      draft: input.publish ? null : input.data,
      updatedAt: now,
      publishedAt: input.publish ? now : null,
    };
    collection.items.push(item);
  }

  await writeStore(store);
  return item as CmsItem<T>;
}

/** Hard-delete a collection item. Returns false when nothing was removed. */
export async function deleteItem(name: CollectionName, id: string): Promise<boolean> {
  const store = await getStore();
  const collection = store[name] as { items: CmsItem<unknown>[] };
  const before = collection.items.length;
  collection.items = collection.items.filter((item) => item.id !== id);
  if (collection.items.length === before) return false;
  await writeStore(store);
  return true;
}

/** Set a collection item's visibility status (draft/published/hidden/archived). */
export async function setItemStatus(
  name: CollectionName,
  id: string,
  status: CmsStatus
): Promise<void> {
  const store = await getStore();
  const collection = store[name] as { items: CmsItem<unknown>[] };
  const item = collection.items.find((i) => i.id === id);
  if (!item) return;
  item.status = status;
  if (status === "published" && !item.publishedAt) item.publishedAt = new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  await writeStore(store);
}

/** Reorder collection items by the given id list. */
export async function reorderItems(name: CollectionName, ids: string[]): Promise<void> {
  const store = await getStore();
  const collection = store[name] as { items: CmsItem<unknown>[] };
  const byId = new Map(collection.items.map((item) => [item.id, item]));
  collection.items = ids
    .map((id) => byId.get(id))
    .filter((item): item is CmsItem<unknown> => Boolean(item))
    .map((item, index) => ({ ...item, order: index + 1 }));
  await writeStore(store);
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
