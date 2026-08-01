import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import {
  getStore,
  isCollectionName,
  isSingleName,
  reorderItems,
  setItemStatus,
  upsertItem,
  upsertSingle,
} from "@/lib/cms/store";
import type { CmsStatus } from "@/lib/cms/types";

type RouteContext = { params: Promise<{ entity: string }> };

const VALID_STATUSES: CmsStatus[] = ["draft", "published", "hidden", "archived"];

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/**
 * Studio content API — auth-guarded CRUD for every CMS entity.
 *
 * GET   → the entity (single: {status,data,draft,…}; collection: {items}).
 * PUT   → upsert single/collection item; `{ data, publish }` saves a draft or
 *         publishes. For collection items, `{ id, status }` alone updates
 *         visibility (hide/archive) without touching content.
 * POST  → `{ entity, ids }` reorders a collection.
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  const { entity } = await params;
  const store = await getStore();

  if (isSingleName(entity)) {
    return NextResponse.json(store[entity]);
  }
  if (isCollectionName(entity)) {
    return NextResponse.json(store[entity]);
  }
  return badRequest(`Unknown entity: ${entity}`);
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  const { entity } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const data = body.data as Record<string, unknown> | undefined;
  const publish = body.publish === true;
  const status = typeof body.status === "string" ? (body.status as CmsStatus) : undefined;
  const id = typeof body.id === "string" ? body.id : undefined;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return badRequest(`Invalid status: ${status}`);
  }

  if (isSingleName(entity)) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return badRequest("Missing `data` object");
    }
    const updated = await upsertSingle(entity, {
      data: data as never,
      publish,
      status,
    });
    return NextResponse.json(updated);
  }

  if (isCollectionName(entity)) {
    // Status-only update (hide/archive) requires an id.
    if (!data) {
      if (!id || !status) return badRequest("Missing `data` or `id` + `status`");
      await setItemStatus(entity, id, status);
      return NextResponse.json({ ok: true });
    }
    if (typeof data !== "object" || Array.isArray(data)) {
      return badRequest("Invalid `data`");
    }
    const updated = await upsertItem(entity, {
      id,
      data: data as never,
      publish,
      status,
    });
    return NextResponse.json(updated);
  }

  return badRequest(`Unknown entity: ${entity}`);
}

/** Reorder a collection: `{ ids: string[] }` gives the desired order. */
export async function POST(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return unauthorized();

  const { entity } = await params;
  if (!isCollectionName(entity)) return badRequest("Reorder only applies to collections");

  let body: { ids?: unknown };
  try {
    body = (await req.json()) as { ids?: unknown };
  } catch {
    return badRequest("Invalid JSON body");
  }
  if (!Array.isArray(body.ids) || body.ids.some((v) => typeof v !== "string")) {
    return badRequest("Missing `ids: string[]`");
  }

  await reorderItems(entity, body.ids);
  return NextResponse.json({ ok: true });
}
