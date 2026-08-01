"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CmsStatus } from "@/lib/cms/types";

import { StatusBadge } from "../components/status-badge";
import { ENTITY_SCHEMAS } from "../schemas";
import { ItemEditor } from "./entity-editor";
import { useContentApi } from "./use-content-api";

interface CmsItemView {
  id: string;
  status: CmsStatus;
  data: Record<string, unknown>;
  draft: Record<string, unknown> | null;
}

function itemTitle(item: CmsItemView): string {
  const title = item.data.title;
  return typeof title === "string" && title.length > 0 ? title : "Untitled";
}

function itemSubtitle(item: CmsItemView): string {
  const short = item.data.shortDescription;
  if (typeof short === "string" && short.length > 0) return short;
  const parts = [
    typeof item.data.date === "string" ? item.data.date : "",
    typeof item.data.category === "string" ? item.data.category : "",
  ].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  return typeof item.data.issuer === "string" ? item.data.issuer : "";
}

interface CollectionEditorProps {
  /** Entity name resolved client-side from the schema registry. */
  entity: string;
}

/**
 * Collection editor — list, create, edit, reorder, and per-item visibility
 * for projects, journey, and certifications. The schema is resolved
 * client-side: schemas carry functions (defaults) and components (icon) that
 * cannot cross the server→client prop boundary.
 */
export function CollectionEditor({ entity }: CollectionEditorProps) {
  const schema = ENTITY_SCHEMAS[entity];
  const api = useContentApi();
  const [items, setItems] = useState<CmsItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(schema.name);
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [api, schema.name]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!schema) return <p className="text-body text-muted-foreground">Unknown entity.</p>;

  const beginCreate = () => {
    const blank = schema.defaults();
    const id = crypto.randomUUID();
    const item: CmsItemView = {
      id,
      status: "draft",
      data: { ...blank, id },
      draft: null,
    };
    setItems((prev) => [item, ...prev]);
    setEditingId(id);
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this item permanently? This cannot be undone.")) return;
    await api.remove(schema.name, id);
    await load();
  };

  const setStatus = async (id: string, status: CmsStatus) => {
    await api.save(schema.name, { id, status });
    await load();
  };

  const move = async (id: string, direction: -1 | 1) => {
    const ids = items.map((item) => item.id);
    const index = ids.indexOf(id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await api.reorder(schema.name, ids);
    await load();
  };

  const editedItem = items.find((item) => item.id === editingId);

  if (editedItem) {
    return (
      <ItemEditor
        schema={schema}
        itemId={editedItem.id}
        initialData={editedItem.draft ?? editedItem.data}
        initialStatus={editedItem.status}
        onSaved={() => {
          setEditingId(null);
          void load();
        }}
        onCancel={() => {
          setEditingId(null);
          void load();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={beginCreate}>
          <PlusIcon data-icon="inline-start" className="size-4" />
          New item
        </Button>
      </div>

      {loading ? (
        <LoadingState label={`Loading ${schema.label}…`} />
      ) : items.length === 0 ? (
        <p className="text-body text-muted-foreground">No items yet — create your first one.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card>
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        aria-label="Move item earlier"
                        disabled={index === 0}
                        onClick={() => void move(item.id, -1)}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-5 items-center justify-center rounded outline-none focus-visible:ring-2 disabled:opacity-30"
                      >
                        <ArrowUpIcon className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Move item later"
                        disabled={index === items.length - 1}
                        onClick={() => void move(item.id, 1)}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-5 items-center justify-center rounded outline-none focus-visible:ring-2 disabled:opacity-30"
                      >
                        <ArrowDownIcon className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      className="focus-visible:ring-ring/50 min-w-0 rounded text-left outline-none focus-visible:ring-2"
                    >
                      <p className="text-title font-semibold tracking-tight">{itemTitle(item)}</p>
                      {itemSubtitle(item) ? (
                        <p className="text-caption text-muted-foreground truncate">
                          {itemSubtitle(item)}
                        </p>
                      ) : null}
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={item.status} />
                    <select
                      value={item.status}
                      aria-label={`Visibility for ${itemTitle(item)}`}
                      onChange={(event) => void setStatus(item.id, event.target.value as CmsStatus)}
                      className="border-input bg-background focus-visible:ring-ring/50 h-7 rounded-lg border px-1.5 text-xs outline-none focus-visible:ring-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="hidden">Hidden</option>
                      <option value="archived">Archived</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${itemTitle(item)}`}
                      onClick={() => void removeItem(item.id)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
