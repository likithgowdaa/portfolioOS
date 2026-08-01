import type { NodeEffect } from "../data/infrastructure-data";

/**
 * Decorative hover effects for diagram nodes, drawn in SVG.
 *
 * Each effect is a small set of shapes whose `nfx-*` classes start CSS
 * animations when the parent `.infra-node` is hovered or focused. No JS
 * state is involved — zero re-renders, transforms stay GPU-composited, and
 * the global reduced-motion collapse freezes them.
 */

interface NodeEffectLayerProps {
  effect: NodeEffect;
  width: number;
  height: number;
}

export function NodeEffectLayer({ effect, width: w, height: h }: NodeEffectLayerProps) {
  switch (effect) {
    case "hover-glow":
      return (
        <g>
          <rect
            x={-8}
            y={-8}
            width={w + 16}
            height={h + 16}
            rx={20}
            className="nfx nfx-hover-glow"
          />
        </g>
      );

    case "commit-pulse":
      return (
        <g>
          <circle cx={w - 12} cy={12} r={3} className="nfx nfx-dot" />
          <circle cx={w - 12} cy={12} r={3} className="nfx nfx-ring" />
        </g>
      );

    case "pipeline-lights":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={w / 2 - 12 + i * 12}
              cy={h - 9}
              r={2.2}
              className={`nfx nfx-light nfx-light-${i}`}
            />
          ))}
        </g>
      );

    case "container-expand":
      return (
        <g>
          <rect
            x={-5}
            y={-5}
            width={w + 10}
            height={h + 10}
            rx={18}
            className="nfx nfx-box-expand"
          />
        </g>
      );

    case "glow-pulse":
      return (
        <g>
          <ellipse
            cx={w / 2}
            cy={h / 2}
            rx={w / 2 + 4}
            ry={h / 2 + 4}
            className="nfx nfx-glow-pulse"
          />
        </g>
      );

    case "pods-pulse":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={14 + i * 11}
              cy={h / 2}
              r={2.2}
              className={`nfx nfx-pod nfx-pod-${i}`}
            />
          ))}
        </g>
      );

    case "api-request":
      return (
        <g>
          <line x1={8} y1={h - 10} x2={w - 8} y2={h - 10} className="nfx nfx-request-line" />
          <circle cx={w / 2} cy={h - 10} r={2.4} className="nfx nfx-request-dot" />
        </g>
      );

    case "db-readwrite":
      return (
        <g>
          <line x1={w - 12} y1={12} x2={w - 12} y2={h - 12} className="nfx nfx-db-track" />
          <circle cx={w - 12} cy={h / 2} r={2.2} className="nfx nfx-db-read" />
          <circle cx={w - 12} cy={h / 2} r={2.2} className="nfx nfx-db-write" />
        </g>
      );

    case "component-highlight":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={w - 16}
              y={8 + i * 12}
              width={9}
              height={9}
              rx={2.5}
              className={`nfx nfx-comp nfx-comp-${i}`}
            />
          ))}
        </g>
      );

    case "soft-glow":
      return (
        <g>
          <rect
            x={-6}
            y={-6}
            width={w + 12}
            height={h + 12}
            rx={20}
            className="nfx nfx-soft-glow"
          />
        </g>
      );
  }
}
