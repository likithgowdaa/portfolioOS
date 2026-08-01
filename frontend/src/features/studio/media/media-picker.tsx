"use client";

import { FileTextIcon, Trash2Icon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { useMedia } from "./use-media";

const IMAGE_PATTERN = /\.(png|jpe?g|webp|svg)$/i;

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

/**
 * Media library picker — browse every uploaded asset and select one, or
 * upload a new file from here. Shared across all image/file fields.
 */
export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const { files, upload, remove, loading } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const created = await upload(file);
      onSelect(created.url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>Media library</DialogTitle>
        <DialogDescription>
          Select an existing asset or upload a new one to reuse across Studio.
        </DialogDescription>

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.svg,.pdf"
            className="hidden"
            onChange={handleUpload}
          />
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            <UploadIcon data-icon="inline-start" className="size-4" />
            {busy ? "Uploading…" : "Upload"}
          </Button>
          {error ? <p className="text-caption text-destructive">{error}</p> : null}
        </div>

        {loading ? (
          <LoadingState label="Loading media…" />
        ) : files.length === 0 ? (
          <p className="text-caption text-muted-foreground py-8 text-center">
            No assets yet — upload your first file above.
          </p>
        ) : (
          <ul className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
            {files.map((file) => (
              <li key={file.url} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    onSelect(file.url);
                    onClose();
                  }}
                  className="border-border bg-muted/40 group hover:border-ring focus-visible:ring-ring/50 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border transition-colors outline-none focus-visible:ring-3"
                >
                  {IMAGE_PATTERN.test(file.url) ? (
                    <Image
                      src={file.url}
                      alt=""
                      width={120}
                      height={120}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <FileTextIcon className="text-muted-foreground size-6" aria-hidden />
                  )}
                  <span className="sr-only">Select {file.name}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${file.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    void remove(file.url);
                  }}
                  className="text-background bg-foreground/70 hover:bg-foreground absolute right-1 bottom-1 flex size-6 items-center justify-center rounded-md opacity-0 transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
