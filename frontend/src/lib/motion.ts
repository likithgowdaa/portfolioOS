import type { Variants } from "framer-motion";

/**
 * Reusable animation utilities for framer-motion.
 *
 * Sprint 02 provides the vocabulary only — nothing is animated on pages yet.
 * Curves and durations mirror the CSS tokens in `globals.css`
 * (`--ease-*`, `--duration-*`) so CSS and JS motion stay in sync.
 */

/** Cubic-bezier curves (mutable tuples so they type-check as Motion easing). */
export const EASE: Record<"outQuart" | "outExpo" | "spring", [number, number, number, number]> = {
  outQuart: [0.25, 1, 0.5, 1],
  outExpo: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
};

/** Durations in seconds, mirroring the `--duration-*` CSS tokens. */
export const DURATION = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  slower: 0.5,
} as const;

/** Fade in place. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE.outExpo } },
};

/** Fade up from below. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
};

/** Scale in from 96%. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
};

/** Parent container that staggers its children. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/** Scroll reveal with a soft blur settle. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE.outExpo },
  },
};

/** Page transition, ready for the App Router template. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.fast, ease: EASE.outExpo },
  },
};
