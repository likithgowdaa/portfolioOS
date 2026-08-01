"use client";

import { LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import type { StudioUser } from "@/lib/auth";

interface StudioTopbarProps {
  user: StudioUser;
  onOpenSidebar: () => void;
}

/**
 * Studio top bar.
 *
 * Minimal by design: mobile nav trigger on the left; theme toggle, the
 * logged-in user, and a logout action on the right. Logout is a plain form
 * POST so it needs no client JS.
 */
export function StudioTopbar({ user, onOpenSidebar }: StudioTopbarProps) {
  const initial = user.name.charAt(0).toUpperCase() || "S";

  return (
    <header className="border-border bg-background/80 z-header sticky top-0 border-b backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          onClick={onOpenSidebar}
          className="lg:hidden"
        >
          <MenuIcon className="size-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          <div className="flex items-center gap-2.5 rounded-lg pr-1 pl-1">
            {user.picture.length > 0 ? (
              <Image
                src={user.picture}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-full"
                aria-hidden
              />
            ) : (
              <div
                aria-hidden
                className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-xs font-semibold"
              >
                {initial}
              </div>
            )}
            <div className="hidden leading-tight md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-caption text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="ghost" size="icon" aria-label="Log out" title="Log out">
              <LogOutIcon className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
