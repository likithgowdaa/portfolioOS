"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/shared/section";
import type { ProfileContent } from "@/lib/cms/types";
import { fadeInUp } from "@/lib/motion";

import { ResumeCard } from "./resume-card";

/**
 * Resume — the landing page's resume section.
 *
 * Heading, short intro, and the resume information card. Every value comes
 * from the CMS profile. When no resume exists the section disappears entirely
 * — no placeholder, no broken layout.
 */
export function ResumeSection({ profile }: { profile: ProfileContent }) {
  const hasResume = profile.resumeAvailable && profile.resumeUrl.length > 0;

  if (!hasResume) return null;

  return (
    <Section id="resume" aria-labelledby="resume-title">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="resume-title" className="text-heading font-semibold tracking-tight">
          Resume
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          A concise record of my experience, skills, and certifications.
        </p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <ResumeCard
          title={profile.resumeTitle}
          description={profile.resumeDescription}
          url={profile.resumeUrl}
          lastUpdated={profile.resumeLastUpdated}
          fileSize={profile.resumeFileSize}
        />
      </motion.div>
    </Section>
  );
}
