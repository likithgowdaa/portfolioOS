"use client";

import { FileTextIcon, RefreshCwIcon, Trash2Icon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { useMedia } from "./use-media";

const IMAGE_PATTERN = /\.(png|jpe?g|webp|svg)$/i;

function fileName(url: string): string {
  return url.split("/").pop() ?? url;
}

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  /** Preferred label for the "Upload" action. */
  uploadLabel?: string;
}

/**
 * Reusable single-file upload control.
 *
 * Shows the current asset (image thumbnail or file icon) with Replace/Delete
 * actions; uploads through the shared Studio media API. Used by the file and
 * image field types.
 */
export function MediaUpload({
  value,
  onChange,
  accept = ".png,.jpg,.jpeg,.webp,.svg,.pdf",
  uploadLabel = "Upload",
}: MediaUploadProps) {
  const { upload } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const created = await upload(file);
      onChange(created.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isImage = value.length > 0 && IMAGE_PATTERN.test(value);

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 ? (
        <div className="border-border bg-muted/40 flex items-center gap-3 rounded-lg border p-2">
          {isImage ? (
            <Image
              src={value}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="size-14 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="border-border bg-background text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-md border">
              <FileTextIcon className="size-5" aria-hidden />
            </div>
          )}
          <p className="text-caption text-muted-foreground min-w-0 flex-1 truncate">
            {fileName(value)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Replace file"
            onClick={() => inputRef.current?.click()}
          >
            <RefreshCwIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Remove file" onClick={() => onChange("")}>
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="w-fit"
        >
          <UploadIcon data-icon="inline-start" className="size-4" />
          {uploadLabel}
        </Button>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />

      {busy ? <p className="text-caption text-muted-foreground">Uploading…</p> : null}
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
    </div>
  );
}
