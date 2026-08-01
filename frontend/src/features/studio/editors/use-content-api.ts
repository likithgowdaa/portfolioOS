"use client";

import { useCallback, useMemo } from "react";

import type { CmsStatus } from "@/lib/cms/types";

/**
 * Studio content API client — thin typed wrapper over the auth-guarded routes.
 */
export function useContentApi() {
  const get = useCallback(async (entity: string, id?: string) => {
    const res = await fetch(`/api/studio/content/${entity}`);
    if (!res.ok) throw new Error("Failed to load content");
    const data = await res.json();
    if (id) {
      return data.items.find((item: { id: string }) => item.id === id);
    }
    return data;
  }, []);

  const save = useCallback(
    async (
      entity: string,
      body: { id?: string; data?: Record<string, unknown>; publish?: boolean; status?: CmsStatus }
    ) => {
      const res = await fetch(`/api/studio/content/${entity}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(error.error ?? "Save failed");
      }
      return res.json();
    },
    []
  );

  const remove = useCallback(async (entity: string, id: string) => {
    const res = await fetch(`/api/studio/content/${entity}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
  }, []);

  const reorder = useCallback(async (entity: string, ids: string[]) => {
    const res = await fetch(`/api/studio/content/${entity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error("Reorder failed");
  }, []);

  // Memoize the container so its identity is stable across renders. The four
  // methods are already memoized, but an un-memoized object literal would give
  // editors a fresh `api` reference on every render — which, as a dependency of
  // a `useEffect([load])` data fetch, would re-run the effect and refetch in an
  // infinite loop.
  return useMemo(() => ({ get, save, remove, reorder }), [get, save, remove, reorder]);
}
