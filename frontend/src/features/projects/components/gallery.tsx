"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface GalleryProps {
  /** Project title — used for alt text and dialog labelling. */
  title: string;
  /** Public image paths. An empty array renders nothing. */
  images: string[];
}

/**
 * Reusable project gallery.
 *
 * A responsive `next/image` grid that opens a lightbox on click. The lightbox
 * reuses the design-system Dialog: Escape closes it, and the left/right arrow
 * keys (plus the Prev/Next buttons) navigate with wrap-around. Lazy loads
 * thumbnails; the active image loads eagerly inside the dialog.
 *
 * Renders `null` when `images` is empty so the caller never shows an empty
 * section. Images are data-driven from `projects.ts` — a future CMS will
 * supply them without component changes.
 */
export function Gallery({ title, images }: GalleryProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const total = images.length;

  React.useEffect(() => {
    if (total === 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((i) => (i - 1 + total) % total);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((i) => (i + 1) % total);
      } else if (event.key === "Home") {
        setIndex(0);
      } else if (event.key === "End") {
        setIndex(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (total === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group/img ring-foreground/10 duration-base focus-visible:ring-ring relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`Open ${title} gallery image ${i + 1} of ${total}`}
          >
            <Image
              src={src}
              alt={`${title} gallery image ${i + 1}`}
              fill
              unoptimized
              sizes="(max-width: 639px) 50vw, (max-width: 1535px) 33vw, 25vw"
              className="duration-slower ease-out-quart object-cover transition-transform group-hover/img:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-3 p-3 sm:p-4">
          <DialogTitle className="sr-only">
            {title} gallery — image {index + 1} of {total}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Use the arrow keys or the buttons to navigate between gallery images.
          </DialogDescription>

          <div className="bg-muted relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src={images[index]}
              alt={`${title} gallery image ${index + 1}`}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 90vw, 864px"
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <p className="text-caption text-muted-foreground tabular-nums" aria-live="polite">
              {index + 1} / {total}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIndex((i) => (i + 1) % total)}
              aria-label="Next image"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
