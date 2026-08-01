"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { getVisibleFlow } from "../data/infrastructure-data";
import { buildDiagramLayout, edgePath } from "../lib/infrastructure-layout";
import type { DiagramLayout, DiagramMode } from "../lib/infrastructure-layout";
import { InfrastructureNode, NODE_STEP_MS } from "./infrastructure-node";

/** Extra time after the last node lights for the final edge + fade. */
const TAIL_MS = 900;

const ARIA_LABEL =
  "CI/CD deployment pipeline: Developer to GitHub, GitHub Actions, Docker Build, Container Registry, Kubernetes Cluster, FastAPI Backend, Supabase, Next.js Frontend, Users.";

/**
 * Interactive infrastructure diagram — the flagship playground visual.
 *
 * The opening sequence runs once when the diagram scrolls into view, then
 * everything settles to a static diagram. Rendering is 100% SVG, vector-sharp
 * at every size. Two layout views (serpentine / vertical) are both rendered
 * and toggled by a CSS container query, so there is no reflow when the
 * container width crosses the breakpoint.
 */
export function InfrastructureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [played, setPlayed] = useState(false);

  // Normal motion: run the sequence once on first view. Reduced motion: show
  // the finished diagram immediately (never animate).
  const opening = Boolean(inView && !reduce && !played);

  useEffect(() => {
    if (!opening) return;
    const total = getVisibleFlow().length * NODE_STEP_MS + TAIL_MS;
    const timer = setTimeout(() => setPlayed(true), total);
    return () => clearTimeout(timer);
  }, [opening]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "border-border bg-muted/40 relative w-full overflow-hidden rounded-xl border",
        opening && "is-opening"
      )}
      style={{ containerType: "inline-size" }}
    >
      {/* Faint blueprint grid */}
      <div aria-hidden className="infra-grid" />

      <DiagramView mode="wide" />
      <DiagramView mode="narrow" />
    </div>
  );
}

/** One responsive layout of the diagram (hidden/shown via container query). */
function DiagramView({ mode }: { mode: DiagramMode }) {
  const markerId = useId();
  const layout: DiagramLayout = buildDiagramLayout(mode);
  const nodes = getVisibleFlow();

  return (
    <svg
      viewBox={`0 0 ${layout.viewBox.width} ${layout.viewBox.height}`}
      role="img"
      aria-label={ARIA_LABEL}
      className={cn("infra-svg", mode === "wide" ? "infra-wide" : "infra-narrow")}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="infra-arrow" />
        </marker>
      </defs>

      {/* Connectors */}
      {layout.edges.map((edge, i) => {
        const d = edgePath(edge.from, edge.to);
        const delay = `${(i + 1) * NODE_STEP_MS}ms`;
        return (
          <g key={i}>
            <path
              d={d}
              pathLength={1}
              className="infra-edge-line"
              markerEnd={`url(#${markerId})`}
              style={{ animationDelay: delay }}
            />
            <circle
              r={3}
              cx={(edge.from.x + edge.to.x) / 2}
              cy={(edge.from.y + edge.to.y) / 2}
              className="infra-edge-dot"
              style={{ offsetPath: `path("${d}")`, animationDelay: delay }}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, index) => (
        <InfrastructureNode key={node.id} node={node} rect={layout.rects[node.id]} index={index} />
      ))}
    </svg>
  );
}
