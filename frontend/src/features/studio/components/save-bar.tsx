"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, Undo2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";

import { useSaveState } from "../hooks/save-state";

/**
 * Persistent save bar.
 *
 * Appears when the current page has unsaved changes (via `useSaveState`) and
 * offers Save Draft / Discard Changes. Publishing is never automatic — "Save
 * Draft" only persists the working copy; a separate publish step is required.
 * No autosave.
 */
export function SaveBar() {
  const { dirty, save, discard } = useSaveState();
  const [saving, setSaving] = useState(false);

  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: DURATION.fast, ease: EASE.outQuart }}
          className="z-header fixed inset-x-0 bottom-4 px-4"
        >
          <div className="border-border bg-card text-card-foreground mx-auto flex w-fit max-w-full items-center gap-3 rounded-xl border px-4 py-2.5 shadow-lg">
            <p className="text-caption text-muted-foreground">Unsaved changes</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={saving}
                onClick={() => {
                  setSaving(true);
                  void save().finally(() => setSaving(false));
                }}
              >
                <CheckIcon data-icon="inline-start" className="size-4" />
                {saving ? "Saving…" : "Save Draft"}
              </Button>
              <Button variant="ghost" size="sm" onClick={discard}>
                <Undo2Icon data-icon="inline-start" className="size-4" />
                Discard Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
