import {
  BriefcaseIcon,
  ClockIcon,
  GitBranchIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ContactLiveTime } from "./contact-time";

interface ContactCardProps {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  availability: string;
  timezone: string;
  additionalLinks: string[];
}

interface ContactRowProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

/** A single contact row: icon, label, and the value (link or plain text). */
export function ContactRow({ icon: Icon, label, children }: ContactRowProps) {
  return (
    <li className="flex items-center gap-3">
      <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
      <span className="text-caption text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-body text-muted-foreground min-w-0 break-words">{children}</span>
    </li>
  );
}

/** Shared styling for link values — brightens and underlines on hover. */
const LINK_CLASS =
  "rounded-sm outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

/** Well-known domains mapped to friendly labels for the Additional Links row. */
const LINK_LABELS: Record<string, string> = {
  "leetcode.com": "LeetCode",
  "github.com": "GitHub",
  "linkedin.com": "LinkedIn",
  "codechef.com": "CodeChef",
  "codeforces.com": "Codeforces",
  "hackerrank.com": "HackerRank",
  "medium.com": "Medium",
  "dev.to": "Dev.to",
  "youtube.com": "YouTube",
  "x.com": "X",
  "twitter.com": "X",
  "instagram.com": "Instagram",
  "discord.gg": "Discord",
};

/** Hostname of a URL, without scheme or `www.` — tolerant of scheme-less input. */
function linkHostname(url: string): string {
  try {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(withScheme).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Friendly label for an additional link: known domains get a recognizable
 * name, everything else shows the bare hostname. Only changes the visible
 * text — the `href` still points at the original URL.
 */
function linkLabel(url: string): string {
  return LINK_LABELS[linkHostname(url).toLowerCase()] ?? linkHostname(url);
}

/**
 * Contact information card.
 *
 * Renders only the rows that have data: Email (mailto link), GitHub and
 * LinkedIn (external links opening in a new tab), Location and Availability
 * (plain text), an optional live time (only when a timezone is set), and the
 * additional links from the CMS. A single "Let's Connect" primary button
 * appears only when an email exists and opens the default mail client via
 * `mailto:`. Labels live here; every value comes from the profile data.
 */
export function ContactCard({
  email,
  github,
  linkedin,
  location,
  availability,
  timezone,
  additionalLinks,
}: ContactCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2.5">
          {email.length > 0 && (
            <ContactRow icon={MailIcon} label="Email">
              <a href={`mailto:${email}`} className={LINK_CLASS}>
                {email}
              </a>
            </ContactRow>
          )}

          {github.length > 0 && (
            <ContactRow icon={GitBranchIcon} label="GitHub">
              <a href={github} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                {github}
              </a>
            </ContactRow>
          )}

          {linkedin.length > 0 && (
            <ContactRow icon={BriefcaseIcon} label="LinkedIn">
              <a href={linkedin} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                {linkedin}
              </a>
            </ContactRow>
          )}

          {location.length > 0 && (
            <ContactRow icon={MapPinIcon} label="Location">
              {location}
            </ContactRow>
          )}

          {availability.length > 0 && (
            <ContactRow icon={ClockIcon} label="Availability">
              {availability}
            </ContactRow>
          )}

          {/* Optional live time — only renders when a timezone is set. */}
          <ContactLiveTime timezone={timezone} />

          {additionalLinks.length > 0 && (
            <ContactRow icon={LinkIcon} label="Links">
              <span className="flex flex-col gap-1">
                {additionalLinks.map((link) => (
                  <a key={link} href={link} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                    {linkLabel(link)}
                  </a>
                ))}
              </span>
            </ContactRow>
          )}
        </ul>

        {email.length > 0 && (
          <div className="pt-2">
            <a
              href={`mailto:${email}`}
              aria-label="Let's connect via email"
              data-slot="button"
              className={buttonVariants()}
            >
              Let’s Connect
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
