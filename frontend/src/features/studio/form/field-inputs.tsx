"use client";

import { ArrowDownIcon, ArrowUpIcon, ImageIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { MediaPicker, MediaUpload } from "../media";
import { useMedia } from "../media";
import type { FieldSchema } from "./field";

export interface FieldInputProps {
  id: string;
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
}

/* ── Text / URL / Date / Number ──────────────────────────────────────────── */

function TextInput({ id, field, value, onChange }: FieldInputProps) {
  const text = typeof value === "string" ? value : "";
  return (
    <Input
      id={id}
      type={field.type === "url" ? "url" : field.type === "number" ? "number" : "text"}
      value={text}
      placeholder={field.placeholder}
      onChange={(event) =>
        onChange(field.type === "number" ? Number(event.target.value) : event.target.value)
      }
    />
  );
}

function DateInput({ id, field, value, onChange }: FieldInputProps) {
  const text = typeof value === "string" ? value : "";
  return (
    <Input
      id={id}
      type="text"
      value={text}
      placeholder={field.placeholder ?? "e.g. Jan 2024"}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

/* ── Textarea / Markdown ─────────────────────────────────────────────────── */

function TextareaInput({ id, field, value, onChange }: FieldInputProps) {
  const text = typeof value === "string" ? value : "";
  return (
    <Textarea
      id={id}
      value={text}
      rows={field.rows ?? 4}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function MarkdownInput({ id, field, value, onChange }: FieldInputProps) {
  const text = typeof value === "string" ? value : "";
  return (
    <Textarea
      id={id}
      value={text}
      rows={field.rows ?? 8}
      placeholder={field.placeholder ?? "Markdown supported"}
      className="font-mono text-[0.85rem]"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

/* ── Tags ────────────────────────────────────────────────────────────────── */

function TagsInput({ id, field, value, onChange }: FieldInputProps) {
  const tags = Array.isArray(value) ? (value as string[]) : [];
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = draft.trim();
    if (!next || tags.includes(next)) return;
    onChange([...tags, next]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary" className="gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => onChange(tags.filter((item) => item !== tag))}
                  className="hover:bg-foreground/10 focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-2"
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={field.placeholder ?? "Type and press Enter"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={add} aria-label="Add tag">
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ── Boolean (switch) ────────────────────────────────────────────────────── */

function BooleanInput({ id, value, onChange }: FieldInputProps) {
  const on = value === true;
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "focus-visible:ring-ring/50 relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-3",
        on ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "bg-background inline-block size-4 rounded-full shadow-sm transition-transform",
          on ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

/* ── Select ──────────────────────────────────────────────────────────────── */

function SelectInput({ id, field, value, onChange }: FieldInputProps) {
  const current = typeof value === "string" ? value : "";
  return (
    <select
      id={id}
      value={current}
      onChange={(event) => onChange(event.target.value)}
      className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2.5 text-sm transition-colors outline-none focus-visible:ring-3"
    >
      {field.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/* ── File / Image / Images ───────────────────────────────────────────────── */

function FileInput({ field, value, onChange }: FieldInputProps) {
  return (
    <MediaUpload
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      accept={field.accept ?? ".pdf"}
      uploadLabel="Upload file"
    />
  );
}

function ImageInput({ id, field, value, onChange }: FieldInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <MediaUpload
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        accept={field.accept ?? ".png,.jpg,.jpeg,.webp,.svg"}
      />
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => setPickerOpen(true)}>
        <ImageIcon data-icon="inline-start" className="size-4" />
        Choose from library
      </Button>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} />
      {/* id is unused — the upload control provides its own accessible labels */}
      <span className="hidden" id={id} />
    </div>
  );
}

function ImagesInput({ value, onChange }: FieldInputProps) {
  const images = Array.isArray(value) ? (value as string[]) : [];
  const { upload } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const created = await upload(file);
        uploaded.push(created.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((url, index) => (
            <li key={`${url}-${index}`} className="relative">
              <div className="border-border bg-muted/40 group aspect-video overflow-hidden rounded-lg border">
                <Image
                  src={url}
                  alt=""
                  width={200}
                  height={120}
                  unoptimized
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute right-1 bottom-1 flex gap-0.5">
                <button
                  type="button"
                  aria-label="Move image earlier"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="bg-foreground/70 text-background hover:bg-foreground focus-visible:ring-ring flex size-6 items-center justify-center rounded-md outline-none focus-visible:ring-2 disabled:opacity-40"
                >
                  <ArrowUpIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Move image later"
                  disabled={index === images.length - 1}
                  onClick={() => move(index, 1)}
                  className="bg-foreground/70 text-background hover:bg-foreground focus-visible:ring-ring flex size-6 items-center justify-center rounded-md outline-none focus-visible:ring-2 disabled:opacity-40"
                >
                  <ArrowDownIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => onChange(images.filter((_, i) => i !== index))}
                  className="bg-foreground/70 text-background hover:bg-foreground focus-visible:ring-ring flex size-6 items-center justify-center rounded-md outline-none focus-visible:ring-2"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.svg"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        <PlusIcon data-icon="inline-start" className="size-4" />
        {busy ? "Uploading…" : "Add images"}
      </Button>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
    </div>
  );
}

/* ── Repeatable (array of objects) ───────────────────────────────────────── */

function RepeatableInput({ field, value, onChange }: FieldInputProps) {
  const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const subFields = field.subFields ?? [];

  const addRow = () => {
    const blank = Object.fromEntries(subFields.map((sub) => [sub.key, ""]));
    onChange([...rows, blank]);
  };

  const updateRow = (index: number, key: string, next: string) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: next } : row)));
  };

  const removeRow = (index: number) => onChange(rows.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, index) => (
        <div
          key={index}
          className="border-border bg-muted/30 flex items-end gap-2 rounded-lg border p-2"
        >
          {subFields.map((sub) => (
            <div key={sub.key} className="flex min-w-0 flex-1 flex-col gap-1">
              <label htmlFor={`${sub.key}-${index}`} className="text-caption text-muted-foreground">
                {sub.label}
              </label>
              <Input
                id={`${sub.key}-${index}`}
                value={typeof row[sub.key] === "string" ? (row[sub.key] as string) : ""}
                onChange={(event) => updateRow(index, sub.key, event.target.value)}
                placeholder={sub.placeholder}
              />
            </div>
          ))}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove item"
            onClick={() => removeRow(index)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit" onClick={addRow}>
        <PlusIcon data-icon="inline-start" className="size-4" />
        Add item
      </Button>
    </div>
  );
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

/** Renders the input matching a field's type. */
export function FieldInput({ id, field, value, onChange }: FieldInputProps) {
  switch (field.type) {
    case "text":
    case "url":
    case "number":
      return <TextInput id={id} field={field} value={value} onChange={onChange} />;
    case "date":
      return <DateInput id={id} field={field} value={value} onChange={onChange} />;
    case "textarea":
      return <TextareaInput id={id} field={field} value={value} onChange={onChange} />;
    case "markdown":
      return <MarkdownInput id={id} field={field} value={value} onChange={onChange} />;
    case "tags":
      return <TagsInput id={id} field={field} value={value} onChange={onChange} />;
    case "boolean":
      return <BooleanInput id={id} field={field} value={value} onChange={onChange} />;
    case "select":
      return <SelectInput id={id} field={field} value={value} onChange={onChange} />;
    case "file":
      return <FileInput id={id} field={field} value={value} onChange={onChange} />;
    case "image":
      return <ImageInput id={id} field={field} value={value} onChange={onChange} />;
    case "images":
      return <ImagesInput id={id} field={field} value={value} onChange={onChange} />;
    case "repeatable":
      return <RepeatableInput id={id} field={field} value={value} onChange={onChange} />;
  }
}
