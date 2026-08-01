"use client";

import { TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { ContactRow } from "./contact-card";

/** Friendly abbreviations the Studio may store that aren't IANA identifiers. */
const ZONE_ABBREVIATIONS: Record<string, string> = {
  IST: "Asia/Kolkata",
  UTC: "UTC",
};

/** Whether a string is a valid `Intl.DateTimeFormat` time zone identifier. */
function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve a stored timezone value into a usable IANA identifier.
 *
 * The Studio saves whatever the owner typed (e.g. "IST" or the full display
 * value "Asia/kolkata (IST)"), so the raw string is rarely a valid identifier
 * on its own. This extracts the IANA name when present and falls back to a
 * few well-known abbreviations; `undefined` means "render in local time".
 */
function resolveTimeZone(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const abbreviated = ZONE_ABBREVIATIONS[trimmed.toUpperCase()];
  if (abbreviated) return abbreviated;

  // Pull the "Continent/City" token out of values like "Asia/kolkata (IST)".
  const candidate = trimmed.match(/\b[A-Za-z]+(?:\/[A-Za-z_+-]+)+\b/)?.[0] ?? trimmed;
  if (isValidTimeZone(candidate)) return candidate;

  // IANA matching is case-sensitive in some engines; "asia/kolkata" → "Asia/Kolkata".
  const capitalized = candidate
    .split("/")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("/");
  if (capitalized !== candidate && isValidTimeZone(capitalized)) return capitalized;

  return undefined;
}

/**
 * Optional live time — one Contact row showing the owner's current time.
 *
 * Renders only after mount (so server and client HTML agree, avoiding a
 * hydration mismatch) and only when a timezone is set. The clock ticks every
 * second and formats in the stored timezone; an unresolvable value gracefully
 * falls back to the visitor's local time instead of crashing.
 */
export function ContactLiveTime({ timezone }: { timezone: string }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (timezone.trim().length === 0) return;
    setMounted(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (timezone.trim().length === 0 || !mounted) return null;

  const zone = resolveTimeZone(timezone);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
    ...(zone ? { timeZone: zone } : {}),
  }).format(now);

  return (
    <ContactRow icon={TimerIcon} label="Time">
      {time}
    </ContactRow>
  );
}
