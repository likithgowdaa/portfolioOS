"use client";

/**
 * Opening-experience coordinator.
 *
 * Owns the "should the opening run?" decision and the nav-reveal signal so
 * the overlay component and the navigation never need to know about each
 * other. Nav subscribes via `onNavReveal`; the opening notifies via
 * `notifyNavReveal`. A module flag removes subscription-order races.
 */

const STORAGE_KEY = "portfolioos:visited";

export type NavRevealListener = () => void;

const navListeners = new Set<NavRevealListener>();

let finished = false;

/**
 * True only on the first visit of a session (or a hard reload) — never on
 * soft navigations or repeated visits.
 */
export function isFirstVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === null;
  } catch {
    // sessionStorage unavailable (privacy mode) — don't block the page.
    return false;
  }
}

/** Record that the opening has run for this session. */
export function markVisited(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** True once the opening has finished (or was skipped). */
export function isOpeningFinished(): boolean {
  return finished;
}

/** Subscribe to the nav-reveal signal. Returns an unsubscribe function. */
export function onNavReveal(listener: NavRevealListener): () => void {
  navListeners.add(listener);
  return () => {
    navListeners.delete(listener);
  };
}

/** Signal that the navigation should reveal itself. */
export function notifyNavReveal(): void {
  finished = true;
  navListeners.forEach((listener) => listener());
}
