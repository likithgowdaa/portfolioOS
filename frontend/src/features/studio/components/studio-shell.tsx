"use client";

import { useState } from "react";

import type { StudioUser } from "@/lib/auth";

import { SaveStateProvider } from "../hooks/save-state";
import { SaveBar } from "./save-bar";
import { StudioSidebar } from "./studio-sidebar";
import { StudioTopbar } from "./studio-topbar";

interface StudioShellProps {
  user: StudioUser;
  children: React.ReactNode;
}

/**
 * Studio dashboard shell.
 *
 * Composes the sidebar (desktop rail + mobile drawer), the top bar, the page
 * content, and the persistent save bar. Wraps children in the save-state
 * context so any editor page can drive the save workflow.
 */
export function StudioShell({ user, children }: StudioShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SaveStateProvider>
      <div className="bg-muted/30 min-h-svh">
        <StudioSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-60">
          <StudioTopbar user={user} onOpenSidebar={() => setSidebarOpen(true)} />
          <main
            id="studio-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10"
          >
            {children}
          </main>
        </div>
        <SaveBar />
      </div>
    </SaveStateProvider>
  );
}
