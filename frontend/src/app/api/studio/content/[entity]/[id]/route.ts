import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { deleteItem, isCollectionName } from "@/lib/cms/store";

type RouteContext = { params: Promise<{ entity: string; id: string }> };

/** Delete a collection item. Single entities are edited, never deleted. */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity, id } = await params;
  if (!isCollectionName(entity)) {
    return NextResponse.json({ error: "Single entities cannot be deleted" }, { status: 400 });
  }

  const removed = await deleteItem(entity, id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
