"use client";

import { motion } from "framer-motion";

import { Section } from "@/components/shared/section";
import type { ProfileContent } from "@/lib/cms/types";
import { fadeInUp } from "@/lib/motion";

import { ContactCard } from "./contact-card";

/**
 * Contact — the landing page's contact section.
 *
 * Heading, short intro, and a data-driven contact card. Every value comes from
 * the CMS profile; components hardcode only labels and the section copy. When
 * no contact data exists the section disappears entirely — no placeholder, no
 * broken layout.
 */
export function ContactSection({ profile }: { profile: ProfileContent }) {
  const { email, github, linkedin, location, availability, timezone, additionalLinks } = profile;

  const hasContactData =
    email.length > 0 ||
    github.length > 0 ||
    linkedin.length > 0 ||
    location.length > 0 ||
    availability.length > 0 ||
    timezone.length > 0 ||
    additionalLinks.length > 0;

  if (!hasContactData) return null;

  return (
    <Section id="contact" aria-labelledby="contact-title">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="contact-title" className="text-heading font-semibold tracking-tight">
          Contact
        </h2>
        <p className="text-body text-muted-foreground mt-3">
          Have a project in mind or just want to say hello? I’d love to hear from you.
        </p>
      </motion.div>

      {hasContactData && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <ContactCard
            email={email}
            github={github}
            linkedin={linkedin}
            location={location}
            availability={availability}
            timezone={timezone}
            additionalLinks={additionalLinks}
          />
        </motion.div>
      )}
    </Section>
  );
}
