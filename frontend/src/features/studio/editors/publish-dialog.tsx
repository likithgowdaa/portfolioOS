"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2Icon, Loader2Icon, RocketIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { EASE } from "@/lib/motion";

type Phase = "confirm" | "publishing" | "success";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

/**
 * Publish workflow — confirmation, progress, and success.
 *
 * Publishing is never automatic: the owner explicitly confirms, sees
 * "Publishing…", then "Portfolio Updated" before the dialog closes.
 */
export function PublishDialog({ open, onOpenChange, onConfirm }: PublishDialogProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPhase("confirm");
      setError("");
    }
  }, [open]);

  const runPublish = async () => {
    setPhase("publishing");
    setError("");
    try {
      await onConfirm();
      setPhase("success");
      // Give the success state a beat, then close.
      window.setTimeout(() => {
        setPhase("confirm");
        onOpenChange(false);
      }, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publishing failed");
      setPhase("confirm");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && phase !== "publishing" && onOpenChange(false)}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogTitle>Publish changes</DialogTitle>
        <DialogDescription>
          Publishing makes this content live on the public portfolio.
        </DialogDescription>

        <AnimatePresence mode="wait">
          {phase === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: EASE.outQuart }}
              className="flex flex-col gap-4"
            >
              <p className="text-body text-muted-foreground">
                Are you sure? This replaces the currently published content.
              </p>
              {error ? <p className="text-caption text-destructive">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={runPublish}>
                  <RocketIcon data-icon="inline-start" className="size-4" />
                  Publish
                </Button>
              </div>
            </motion.div>
          )}

          {phase === "publishing" && (
            <motion.div
              key="publishing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <Loader2Icon className="text-primary size-6 animate-spin" aria-hidden />
              <p className="text-body">Publishing…</p>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-4"
            >
              <CheckCircle2Icon className="text-success size-8" aria-hidden />
              <p className="text-title font-semibold tracking-tight">Portfolio Updated</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
