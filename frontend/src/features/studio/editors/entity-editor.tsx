"use client";

import { EyeIcon, RocketIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import type { CmsStatus } from "@/lib/cms/types";

import { StatusBadge } from "../components/status-badge";
import { EntityForm } from "../form";
import { ENTITY_SCHEMAS, VISIBILITY_OPTIONS, type EntitySchema } from "../schemas";
import { useSaveState } from "../hooks/save-state";
import { PreviewPane } from "./preview-pane";
import { PublishDialog } from "./publish-dialog";
import { useContentApi } from "./use-content-api";

interface WorkflowProps {
  schema: EntitySchema;
  data: Record<string, unknown>;
  onDataChange: (next: Record<string, unknown>) => void;
  status: CmsStatus;
  onStatusChange: (status: CmsStatus) => void;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onDiscard: () => void;
}

/** The shared edit surface: toolbar (visibility + save/publish/preview) + form. */
function EditorWorkflow({
  schema,
  data,
  onDataChange,
  status,
  onStatusChange,
  onSaveDraft,
  onPublish,
  onDiscard,
}: WorkflowProps) {
  const { markDirty, markClean, register } = useSaveState();
  const [publishOpen, setPublishOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (next: Record<string, unknown>) => {
    onDataChange(next);
    markDirty();
  };

  const saveDraft = useCallback(async () => {
    setBusy(true);
    setNotice("");
    try {
      await onSaveDraft();
      markClean();
      setNotice("Draft saved.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }, [onSaveDraft, markClean]);

  const publish = useCallback(async () => {
    setBusy(true);
    setNotice("");
    try {
      await onPublish();
      markClean();
      setNotice("Published — the public site is live with these changes.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Publishing failed");
    } finally {
      setBusy(false);
    }
  }, [onPublish, markClean]);

  const handleStatusSelect = (next: CmsStatus) => {
    if (next === "published") {
      setPublishOpen(true);
    } else {
      onStatusChange(next);
    }
  };

  // Keep the persistent SaveBar wired to this editor's actions.
  useEffect(() => {
    register({ save: saveDraft, discard: onDiscard });
  }, [register, saveDraft, onDiscard]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <label className="flex items-center gap-1.5">
            <span className="text-caption text-muted-foreground">Visibility</span>
            <select
              value={status}
              onChange={(event) => handleStatusSelect(event.target.value as CmsStatus)}
              aria-label="Content visibility"
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-7 rounded-lg border px-2 text-sm outline-none focus-visible:ring-3"
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            <EyeIcon data-icon="inline-start" className="size-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => void saveDraft()}>
            <SaveIcon data-icon="inline-start" className="size-4" />
            Save Draft
          </Button>
          <Button size="sm" disabled={busy} onClick={() => setPublishOpen(true)}>
            <RocketIcon data-icon="inline-start" className="size-4" />
            Publish
          </Button>
        </div>
      </div>

      {notice ? <p className="text-caption text-muted-foreground">{notice}</p> : null}

      <EntityForm sections={schema.sections} data={data} onChange={handleChange} />

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} onConfirm={publish} />
      <PreviewPane
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        schema={schema}
        data={data}
      />
    </div>
  );
}

/** Editor for single entities (profile, resume, contact, footer, seo). */
export function SingleEntityEditor({ entity }: { entity: string }) {
  // Resolved client-side: schemas carry functions (defaults) and components
  // (icon) that cannot cross the server→client prop boundary.
  const schema = ENTITY_SCHEMAS[entity];
  const api = useContentApi();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<CmsStatus>("draft");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const entity = await api.get(schema.name);
      setData((entity.draft ?? entity.data) as Record<string, unknown>);
      setStatus(entity.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [api, schema.name]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveDraft = useCallback(async () => {
    await api.save(schema.name, { data: data as Record<string, unknown>, publish: false });
    setStatus((await api.get(schema.name)).status);
  }, [api, schema.name, data]);

  const publish = useCallback(async () => {
    await api.save(schema.name, { data: data as Record<string, unknown>, publish: true });
    const entity = await api.get(schema.name);
    setStatus(entity.status);
    setData(entity.data as Record<string, unknown>);
  }, [api, schema.name, data]);

  const setStatusDirect = useCallback(
    async (next: CmsStatus) => {
      await api.save(schema.name, { data: data as Record<string, unknown>, status: next });
      setStatus(next);
    },
    [api, schema.name, data]
  );

  if (!schema) return <p className="text-body text-muted-foreground">Unknown entity.</p>;
  if (loading) return <LoadingState label={`Loading ${schema.label}…`} />;
  if (error || !data)
    return <p className="text-body text-destructive">{error ?? "Nothing to edit."}</p>;

  return (
    <EditorWorkflow
      schema={schema}
      data={data}
      onDataChange={setData}
      status={status}
      onStatusChange={(next) => void setStatusDirect(next)}
      onSaveDraft={saveDraft}
      onPublish={publish}
      onDiscard={() => void load()}
    />
  );
}

interface ItemEditorProps {
  schema: EntitySchema;
  itemId: string;
  initialData: Record<string, unknown>;
  initialStatus: CmsStatus;
  onSaved: () => void;
  onCancel: () => void;
}

/** Editor for a single collection item (projects, journey, certifications). */
export function ItemEditor({
  schema,
  itemId,
  initialData,
  initialStatus,
  onSaved,
  onCancel,
}: ItemEditorProps) {
  const api = useContentApi();
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [status, setStatus] = useState<CmsStatus>(initialStatus);

  const saveDraft = useCallback(async () => {
    await api.save(schema.name, { id: itemId, data, publish: false });
    onSaved();
  }, [api, schema.name, itemId, data, onSaved]);

  const publish = useCallback(async () => {
    await api.save(schema.name, { id: itemId, data, publish: true });
    onSaved();
  }, [api, schema.name, itemId, data, onSaved]);

  const setStatusDirect = useCallback(
    async (next: CmsStatus) => {
      await api.save(schema.name, { id: itemId, status: next });
      setStatus(next);
      onSaved();
    },
    [api, schema.name, itemId, onSaved]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title font-semibold tracking-tight">
          {data.title ? (data.title as string) : "New item"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Back to list
        </Button>
      </div>
      <EditorWorkflow
        schema={schema}
        data={data}
        onDataChange={setData}
        status={status}
        onStatusChange={(next) => void setStatusDirect(next)}
        onSaveDraft={saveDraft}
        onPublish={publish}
        onDiscard={() => setData(initialData)}
      />
    </div>
  );
}
