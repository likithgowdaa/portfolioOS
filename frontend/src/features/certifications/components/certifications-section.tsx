"use client";

import { motion } from "framer-motion";

import type { Certification } from "../data/certifications";
import { Section } from "@/components/shared/section";
import { fadeInUp, stagger } from "@/lib/motion";

import { CertificationCard } from "./certification-card";

/**
 * Certifications — the landing page's credential section.
 *
 * Heading, short intro, and a responsive grid of data-driven certification
 * cards (1 column mobile, 2 tablet, 3 desktop). Credentials are passed in from
 * the CMS. Renders nothing when none are published — the layout rebalances
 * automatically.
 */
export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) return null;

  return (
    <Section id="certifications" aria-labelledby="certifications-title">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="certifications-title" className="text-heading font-semibold tracking-tight">
          Certifications
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          Credentials that back the work — verified and current, with links to confirm them.
        </p>
      </motion.div>

      {certifications.length > 0 && (
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {certifications.map((certification) => (
            <CertificationCard key={certification.id} certification={certification} />
          ))}
        </motion.div>
      )}
    </Section>
  );
}
