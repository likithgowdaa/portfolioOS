"use client";

import { motion } from "framer-motion";

import type { JourneyEntry } from "../data/journey";
import { Section } from "@/components/shared/section";
import { fadeInUp } from "@/lib/motion";

import { JourneyTimeline } from "./journey-timeline";

/**
 * Journey — the learning and career timeline.
 *
 * Heading, short intro, and the responsive vertical timeline. Entries are
 * passed in from the CMS. Renders nothing when no entries are published — the
 * layout rebalances automatically.
 */
export function JourneySection({ entries }: { entries: JourneyEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <Section id="journey" aria-labelledby="journey-title">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="journey-title" className="text-heading font-semibold tracking-tight">
          Journey
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          The path that shaped how I build — from formal education through the production systems I
          operate today.
        </p>
      </motion.div>

      <JourneyTimeline entries={entries} />
    </Section>
  );
}
