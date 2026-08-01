/**
 * Centralized profile data.
 *
 * Sprint 03 reads every piece of personal information from this module so no
 * UI component hardcodes it. A future Studio CMS will replace this file.
 */

export const profile = {
  name: "Likith R",
  role: "Cloud & DevOps Engineer",
  tagline: "Engineering scalable cloud infrastructure through DevOps, automation, and AI.",
  /** Short personal introduction for the About section. Empty = hidden. */
  bio: "",
  /** Professional summary for the About section. Empty = hidden. */
  summary: "",
  /** Seniority / experience level (e.g. "5+ years"). Empty = hidden. */
  experienceLevel: "",
  /** What the owner is currently working on. Empty = hidden. */
  currentFocus: "",
  availability: "Available for Opportunities",
  location: "Bangalore, Karnataka",
  /** Education entry for the About section. Empty = hidden. */
  education: "",
  /** Interest tags, rendered as chips. Empty array = hidden. */
  interests: [],
  /** Fun facts, rendered as small cards. Empty array = hidden. */
  funFacts: [],
  /** Resume asset — add `frontend/public/resume.pdf` when available. */
  resumeUrl: "/resume.pdf",
  /** Whether a resume is currently available for download. */
  resumeAvailable: false,
  /** Resume title shown on the card. Empty = hidden. */
  resumeTitle: "",
  /** Short description of the resume. Empty = hidden. */
  resumeDescription: "",
  /** Human-readable last-updated date, e.g. "Jan 2026". Empty = hidden. */
  resumeLastUpdated: "",
  /** Human-readable file size, e.g. "180 KB". Empty = hidden. */
  resumeFileSize: "",
  /** Contact email — powers the "Let's Connect" mailto CTA. Empty = hidden. */
  email: "",
  /** Public GitHub profile URL. Empty = hidden. */
  github: "",
  /** Public LinkedIn profile URL. Empty = hidden. */
  linkedin: "",
} as const;
