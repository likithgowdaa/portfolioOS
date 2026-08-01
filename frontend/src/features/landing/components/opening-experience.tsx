"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { DURATION, EASE } from "@/lib/motion";
import { isFirstVisit, markVisited, notifyNavReveal } from "../lib/opening";

/**
 * Sequence timings (ms). Overlay fade-in is implicit on mount.
 */
const OVERLAY_FADE_MS = 150;
const GLOW_MS = 600;
const LINE_MS = 450;
const HOLD_MS = 650;
const EXIT_MS = 500;

/** When the hero/nav are revealed — the overlay starts fading out. */
const NAV_REVEAL_MS = GLOW_MS + LINE_MS + HOLD_MS;
const EXIT_START_MS = NAV_REVEAL_MS;
const DONE_MS = EXIT_START_MS + EXIT_MS;

/**
 * Opening experience.
 *
 * Black screen → soft center glow → thin horizontal line → fade into the hero
 * → reveal navigation. Runs only on the first visit of a session (or a hard
 * reload), never loops, and is skipped entirely under reduced motion.
 *
 * The overlay sits at `z-overlay` while the navigation reveals at `z-header`
 * beneath it, so the end of the sequence is a cross-fade into the page.
 */
export function OpeningExperience() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Decide whether to run — client-side only, so returning visitors get no
  // overlay at all (no flash) and reduced-motion users skip straight to the page.
  useEffect(() => {
    if (reduce === null) return;
    if (reduce) {
      notifyNavReveal();
      return;
    }
    if (isFirstVisit()) {
      markVisited();
      setActive(true);
    } else {
      notifyNavReveal();
    }
  }, [reduce]);

  // Drive the sequence and the nav reveal once active.
  useEffect(() => {
    if (!active) return;
    const navTimer = setTimeout(notifyNavReveal, NAV_REVEAL_MS);
    const exitTimer = setTimeout(() => setExiting(true), EXIT_START_MS);
    const doneTimer = setTimeout(() => setActive(false), DONE_MS);
    return () => {
      clearTimeout(navTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [active]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      className="z-overlay bg-background pointer-events-none fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{
        duration: exiting ? DURATION.slower : DURATION.fast,
        ease: EASE.outExpo,
      }}
    >
      {/* Soft center glow */}
      <div className="animate-glow bg-foreground/5 absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      {/* Thin horizontal line */}
      <div
        className="animate-line-in bg-foreground/40 absolute top-1/2 left-1/2 h-px w-40 -translate-x-1/2 -translate-y-1/2"
        style={{ animationDelay: `${OVERLAY_FADE_MS + GLOW_MS}ms` }}
      />
    </motion.div>
  );
}
