"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";

/**
 * Theme toggle — the Sprint 03 "Theme Interaction".
 *
 * Uses the existing next-themes infrastructure (persistence + system
 * detection); this component only flips the resolved theme and animates the
 * icon swap. The icon renders only after mount to avoid a hydration mismatch.
 * Lives in `components/shared` so both the public navbar and Studio can use it.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // The resolved theme is only known after mount (next-themes reads storage
  // on the client). Gate the label on `mounted` so the server and the client
  // render the same text during hydration — same treatment as the icon below.
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE.outQuart }}
        >
          {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
        </motion.span>
      ) : (
        // Stable placeholder until mounted — prevents layout shift.
        <span className="size-4" />
      )}
    </Button>
  );
}
