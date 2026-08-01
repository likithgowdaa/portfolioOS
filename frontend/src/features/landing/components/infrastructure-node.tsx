"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { InfrastructureNode } from "../data/infrastructure-data";
import type { NodeRect } from "../lib/infrastructure-layout";
import { InfrastructureNodeTooltip } from "./infrastructure-node-tooltip";
import { NodeEffectLayer } from "./node-effects";

const ICON_SIZE = 26;
const ICON_TOP = 14;
const LABEL_BOTTOM = 18;

/** Opening-sequence stagger between consecutive nodes (matches layout/edge CSS). */
export const NODE_STEP_MS = 720;

interface InfrastructureNodeProps {
  node: InfrastructureNode;
  rect: NodeRect;
  /** Flow index — drives the opening animation delay. */
  index: number;
}

/**
 * A single pipeline node.
 *
 * The node group IS the Base UI TooltipTrigger (rendered as an SVG `<g>`), so
 * every node reuses the shared Tooltip component. Hover/focus reveal a subtle
 * per-node effect (pure CSS, no re-renders) and a rich tooltip.
 */
export function InfrastructureNode({ node, rect, index }: InfrastructureNodeProps) {
  const Icon = node.icon;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <g
            role="group"
            aria-label={`${node.title}. ${node.purpose}`}
            data-cursor="hover"
            tabIndex={0}
            className="infra-node"
            style={{ animationDelay: `${index * NODE_STEP_MS}ms` }}
          />
        }
      >
        <g transform={`translate(${rect.x} ${rect.y})`}>
          <NodeEffectLayer effect={node.effect} width={rect.width} height={rect.height} />

          <rect className="infra-box" x={0} y={0} width={rect.width} height={rect.height} rx={16} />

          <g transform={`translate(${(rect.width - ICON_SIZE) / 2} ${ICON_TOP})`}>
            <Icon width={ICON_SIZE} height={ICON_SIZE} strokeWidth={1.75} className="infra-icon" />
          </g>

          <text
            x={rect.width / 2}
            y={rect.height - LABEL_BOTTOM}
            textAnchor="middle"
            className="infra-label"
          >
            {node.title}
          </text>
        </g>
      </TooltipTrigger>

      <TooltipContent side="top" sideOffset={10}>
        <InfrastructureNodeTooltip node={node} />
      </TooltipContent>
    </Tooltip>
  );
}
