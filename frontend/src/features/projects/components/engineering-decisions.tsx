"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, LightbulbIcon, ScaleIcon, ThumbsUpIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import type { EngineeringDecision } from "../data/projects";

interface EngineeringDecisionsProps {
  decisions: EngineeringDecision[];
}

/** One labeled line in an expanded decision (Reason / Tradeoff / Lessons). */
function DecisionLine({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof LightbulbIcon;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-start gap-2">
      <Icon className="text-muted-foreground mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        <span className="text-foreground font-medium">{label}: </span>
        {children}
      </span>
    </p>
  );
}

/**
 * Reusable engineering-decisions list.
 *
 * Each decision renders as an expandable Card using the native disclosure
 * pattern (`aria-expanded` / `aria-controls`). Expands with a subtle height
 * fade that honours the global reduced-motion config. Renders `null` when
 * `decisions` is empty.
 */
export function EngineeringDecisions({ decisions }: EngineeringDecisionsProps) {
  if (decisions.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {decisions.map((decision, i) => (
        <li key={decision.title}>
          <DecisionCard decision={decision} id={`decision-${i}`} />
        </li>
      ))}
    </ul>
  );
}

function DecisionCard({ decision, id }: { decision: EngineeringDecision; id: string }) {
  const [open, setOpen] = React.useState(false);
  const panelId = `${id}-panel`;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-visible:ring-ring flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-0"
        >
          <span className="text-title font-medium tracking-tight">{decision.title}</span>
          <ChevronDownIcon
            className={cn(
              "text-muted-foreground duration-base ease-out-quart size-4 shrink-0 transition-transform",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key={panelId}
              id={panelId}
              role="region"
              aria-label={`${decision.title} details`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: DURATION.base, ease: EASE.outQuart }}
              className="overflow-hidden"
            >
              <div className="text-muted-foreground flex flex-col gap-2 border-t pt-3 text-sm">
                <DecisionLine label="Reason" icon={LightbulbIcon}>
                  {decision.reason}
                </DecisionLine>
                <DecisionLine label="Tradeoff" icon={ScaleIcon}>
                  {decision.tradeoff}
                </DecisionLine>
                <DecisionLine label="Lessons" icon={ThumbsUpIcon}>
                  {decision.lessons}
                </DecisionLine>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
