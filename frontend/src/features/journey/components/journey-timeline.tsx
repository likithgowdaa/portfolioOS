"use client";

import { motion } from "framer-motion";

import { stagger } from "@/lib/motion";

import type { JourneyEntry } from "../data/journey";
import { JourneyTimelineItem } from "./journey-timeline-item";

interface JourneyTimelineProps {
  entries: JourneyEntry[];
}

/**
 * Responsive vertical timeline.
 *
 * A single subtle connector runs the full height of the list — down the left
 * edge on mobile, centered on tablet and desktop. Mobile is a single column;
 * tablet places dates to the left of the connector; desktop alternates cards
 * left and right of it. Cards reveal with the Sprint 02 stagger when the list
 * enters the viewport.
 */
export function JourneyTimeline({ entries }: JourneyTimelineProps) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="bg-border absolute top-0 bottom-0 left-4 w-px md:left-1/2 md:-translate-x-1/2"
      />
      <motion.ol
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="flex flex-col gap-y-12 lg:gap-y-16"
      >
        {entries.map((entry, index) => (
          <JourneyTimelineItem key={entry.id} entry={entry} index={index} />
        ))}
      </motion.ol>
    </div>
  );
}
