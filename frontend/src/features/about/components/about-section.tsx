"use client";

import { motion } from "framer-motion";
import { BriefcaseIcon, ClockIcon, MapPinIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import type { ProfileContent } from "@/lib/cms/types";
import { fadeInUp, stagger } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Private building blocks                                                   */
/* -------------------------------------------------------------------------- */

/** A titled body block (Professional Summary / Current Focus). */
function ProfileBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-title font-semibold tracking-tight">{title}</h3>
      <div className="text-body text-muted-foreground">{children}</div>
    </div>
  );
}

/** A titled Card for the aside column (Education / Interests). */
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <h3 className="text-title font-semibold tracking-tight">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  About section                                                             */
/* -------------------------------------------------------------------------- */

/**
 * About Me — the landing page's profile section.
 *
 * Every value comes from the CMS profile; components
 * hardcode only labels. Fields render only when non-empty, so the section
 * degrades gracefully until real profile data exists. Reveals with the
 * Sprint 02 `fadeInUp` / `stagger` vocabulary.
 */
export function AboutSection({ profile }: { profile: ProfileContent }) {
  const hasPhoto = profile.photo.length > 0;
  const hasMain = profile.summary.length > 0 || profile.currentFocus.length > 0;
  const hasAside = hasPhoto || profile.education.length > 0 || profile.interests.length > 0;
  const hasBody = hasMain || hasAside;
  const hasHeader =
    profile.bio.length > 0 ||
    profile.location.length > 0 ||
    profile.availability.length > 0 ||
    profile.experienceLevel.length > 0;

  // Nothing to show → the section disappears and the layout rebalances.
  if (!hasBody && !hasHeader) return null;

  return (
    <Section id="about" aria-labelledby="about-title">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-12 max-w-2xl lg:mb-16"
      >
        <h2 id="about-title" className="text-heading font-semibold tracking-tight">
          About Me
        </h2>
        {profile.bio.length > 0 && (
          <p className="text-body text-muted-foreground mt-3">{profile.bio}</p>
        )}

        {/* Meta chips — hidden while values are empty. */}
        {(profile.location.length > 0 ||
          profile.availability.length > 0 ||
          profile.experienceLevel.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.location.length > 0 && (
              <Badge variant="outline" className="font-normal">
                <MapPinIcon data-icon="inline-start" className="size-3" aria-hidden />
                {profile.location}
              </Badge>
            )}
            {profile.availability.length > 0 && (
              <Badge variant="outline" className="font-normal">
                <ClockIcon data-icon="inline-start" className="size-3" aria-hidden />
                {profile.availability}
              </Badge>
            )}
            {profile.experienceLevel.length > 0 && (
              <Badge variant="outline" className="font-normal">
                <BriefcaseIcon data-icon="inline-start" className="size-3" aria-hidden />
                {profile.experienceLevel}
              </Badge>
            )}
          </div>
        )}
      </motion.div>

      {/* Body — only rendered when there is content to show. */}
      {hasBody && (
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12"
        >
          {hasMain && (
            <div className="flex flex-col gap-8">
              {profile.summary.length > 0 && (
                <ProfileBlock title="Professional Summary">
                  <p>{profile.summary}</p>
                </ProfileBlock>
              )}
              {profile.currentFocus.length > 0 && (
                <ProfileBlock title="Current Focus">
                  <p>{profile.currentFocus}</p>
                </ProfileBlock>
              )}
            </div>
          )}

          {hasAside && (
            <div className="flex flex-col gap-4">
              {hasPhoto && (
                <div className="ring-foreground/10 overflow-hidden rounded-xl ring-1">
                  <Image
                    src={profile.photo}
                    alt={profile.photoAlt.length > 0 ? profile.photoAlt : profile.name}
                    width={640}
                    height={640}
                    unoptimized
                    sizes="(max-width: 1023px) 100vw, 320px"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              )}
              {profile.education.length > 0 && (
                <InfoCard title="Education">
                  <p className="text-body text-muted-foreground">{profile.education}</p>
                </InfoCard>
              )}
              {profile.interests.length > 0 && (
                <InfoCard title="Interests">
                  <div className="flex flex-wrap gap-1.5">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="font-normal">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Fun facts — small cards, hidden while empty. */}
      {profile.funFacts.length > 0 && (
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          <h3 className="text-title font-semibold tracking-tight sm:col-span-2 lg:col-span-3">
            Fun Facts
          </h3>
          {profile.funFacts.map((fact) => (
            <Card key={fact}>
              <CardContent className="flex items-start gap-3">
                <SparklesIcon
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <p className="text-body text-muted-foreground">{fact}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </Section>
  );
}
