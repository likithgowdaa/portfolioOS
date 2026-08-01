"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Live theme summary for the dashboard.
 *
 * Shows the active theme mode and the resolved color scheme, e.g. "System
 * (dark)". Renders a stable placeholder until mount to avoid hydration
 * mismatches.
 */
export function ThemeStatus() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <span>System</span>;

  if (theme === "dark" || theme === "light") {
    return <span className="capitalize">{theme}</span>;
  }
  return <span>System ({resolvedTheme})</span>;
}
