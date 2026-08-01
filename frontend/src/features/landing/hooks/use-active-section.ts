"use client";

import { useEffect, useState } from "react";

/** Landing sections tracked by the navigation (in page order). */
export const NAV_SECTION_IDS = [
  "home",
  "projects",
  "journey",
  "about",
  "certifications",
  "resume",
  "contact",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

/**
 * Returns the section currently inside the viewport's middle band.
 *
 * Sections are registered by element id; missing sections (not yet built)
 * are skipped, so the hero stays active until they arrive.
 */
export function useActiveSection(): NavSectionId {
  const [active, setActive] = useState<NavSectionId>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as NavSectionId);
          }
        }
      },
      {
        // A horizontal band across the middle of the viewport.
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    for (const id of NAV_SECTION_IDS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return active;
}
