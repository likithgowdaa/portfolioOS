"use client";

import { useCallback, useEffect, useState } from "react";

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

/**
 * Media library — list, upload, and delete via the Studio media API.
 * Uploads are shared across every entity editor.
 */
export function useMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/studio/media");
    if (!res.ok) return;
    const data = (await res.json()) as { files: MediaFile[] };
    setFiles(data.files);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const upload = useCallback(async (file: File): Promise<MediaFile> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/studio/media", { method: "POST", body: form });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? "Upload failed");
    }
    const created = (await res.json()) as MediaFile;
    setFiles((prev) => [created, ...prev]);
    return created;
  }, []);

  const remove = useCallback(async (url: string): Promise<void> => {
    const name = url.split("/").pop();
    if (!name) return;
    const res = await fetch(`/api/studio/media/${encodeURIComponent(name)}`, { method: "DELETE" });
    if (res.ok) setFiles((prev) => prev.filter((file) => file.url !== url));
  }, []);

  return { files, loading, refresh, upload, remove };
}
