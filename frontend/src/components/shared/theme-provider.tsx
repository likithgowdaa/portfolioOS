"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Theme provider for dark/light mode.
 *
 * Uses next-themes with class-based switching. The `.dark` class and all
 * theme tokens live in `globals.css`. Consumers toggle via the `useTheme`
 * hook — a visible theme switcher is deliberately out of scope for Sprint 01.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
