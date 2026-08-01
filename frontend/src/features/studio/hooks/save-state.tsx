"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

interface SaveActions {
  /** Persist the current draft. */
  save?: () => Promise<void>;
  /** Reset unsaved changes (e.g. reload the last saved data). */
  discard?: () => void;
}

interface SaveState {
  /** True while the current page has unsaved changes. */
  dirty: boolean;
  /** Mark the page as having unsaved changes. */
  markDirty: () => void;
  /** Mark changes as saved (after a successful save). */
  markClean: () => void;
  /** Register the active editor's save/discard handlers. */
  register: (actions: SaveActions) => void;
  /** Run the active editor's save (persist draft). */
  save: () => Promise<void>;
  /** Run the active editor's discard, then clear the dirty flag. */
  discard: () => void;
}

const SaveStateContext = createContext<SaveState | null>(null);

/**
 * Save-workflow context — the shared seam between editors and the save bar.
 *
 * Editors call `markDirty()` on change and register their save/discard
 * handlers; the persistent `SaveBar` reads `dirty` and offers Save Draft /
 * Discard Changes. There is deliberately no autosave.
 */
export function SaveStateProvider({ children }: { children: ReactNode }) {
  const [dirty, setDirty] = useState(false);
  const saveAction = useRef<(() => Promise<void>) | null>(null);
  const discardAction = useRef<(() => void) | null>(null);

  const register = useCallback((actions: SaveActions) => {
    saveAction.current = actions.save ?? null;
    discardAction.current = actions.discard ?? null;
  }, []);

  const save = useCallback(async () => {
    await saveAction.current?.();
  }, []);

  const discard = useCallback(() => {
    discardAction.current?.();
    setDirty(false);
  }, []);

  const value = useMemo<SaveState>(
    () => ({
      dirty,
      markDirty: () => setDirty(true),
      markClean: () => setDirty(false),
      register,
      save,
      discard,
    }),
    [dirty, register, save, discard]
  );

  return <SaveStateContext.Provider value={value}>{children}</SaveStateContext.Provider>;
}

export function useSaveState(): SaveState {
  const ctx = useContext(SaveStateContext);
  if (!ctx) throw new Error("useSaveState must be used within SaveStateProvider");
  return ctx;
}
