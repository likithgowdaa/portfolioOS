"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { STUDIO_NAME, STUDIO_NAV_ITEMS, STUDIO_SUBTITLE } from "../data/studio-config";

interface StudioSidebarProps {
  /** Whether the mobile drawer is open. */
  open: boolean;
  onClose: () => void;
}

/** Logo + wordmark, used by both the desktop rail and the mobile drawer. */
function BrandLockup() {
  return (
    <>
      <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-sm font-semibold">
        P
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight">{STUDIO_NAME}</p>
        <p className="text-caption text-muted-foreground">{STUDIO_SUBTITLE}</p>
      </div>
    </>
  );
}

/** The navigation list — shared by desktop and mobile drawers. */
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Studio" className="flex flex-col gap-0.5 p-2">
      {STUDIO_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        if (item.disabled) {
          return (
            <div
              key={item.label}
              aria-hidden
              className="text-muted-foreground/60 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm"
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.hint && <span className="text-caption">Soon</span>}
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring/50 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="flex-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Studio sidebar.
 *
 * A fixed rail on desktop (`lg:`), and an off-canvas drawer with a backdrop on
 * smaller screens. The active item is highlighted via `aria-current` and the
 * nav is labelled for assistive tech. Coming-soon items render disabled (not
 * links) so there are no dead routes.
 */
export function StudioSidebar({ open, onClose }: StudioSidebarProps) {
  return (
    <>
      {/* Desktop rail */}
      <aside className="border-border bg-background z-base fixed inset-y-0 left-0 hidden w-60 border-r lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center gap-2.5 border-b px-4">
            <BrandLockup />
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavList />
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              aria-label="Close navigation"
              className="z-overlay fixed inset-0 bg-black/20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: DURATION.base, ease: EASE.outQuart }}
              className="border-border bg-background z-modal fixed inset-y-0 left-0 flex w-60 flex-col border-r lg:hidden"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b pr-1.5 pl-4">
                <div className="flex items-center gap-2.5">
                  <BrandLockup />
                </div>
                <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={onClose}>
                  <XIcon className="size-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavList onNavigate={onClose} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
