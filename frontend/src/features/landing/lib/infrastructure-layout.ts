import { getVisibleFlow } from "../data/infrastructure-data";
import type { InfrastructureNodeId } from "../data/infrastructure-data";

/**
 * Pure geometry for the Infrastructure Playground diagram.
 *
 * Two container-width modes share the same flow; only node placement and the
 * viewBox change. Everything here is derived — no React, easy to unit test,
 * and trivial to extend with new modes or a CMS-driven layout.
 */

export type DiagramMode = "wide" | "narrow";

/** Container width below which the diagram stacks into a single column. */
export const DIAGRAM_MODE_BREAKPOINT = 400;

export interface Point {
  x: number;
  y: number;
}

export interface NodeRect extends Point {
  width: number;
  height: number;
}

export interface EdgeGeometry {
  from: Point;
  to: Point;
}

export interface DiagramLayout {
  mode: DiagramMode;
  viewBox: { width: number; height: number };
  nodeSize: { width: number; height: number };
  /** Node rectangles keyed by id (visible nodes only, in flow order). */
  rects: Record<InfrastructureNodeId, NodeRect>;
  /** Consecutive-flow edges, direction-aware endpoints. */
  edges: EdgeGeometry[];
  /** Render aspect ratio (width / height). */
  aspectRatio: number;
}

const WIDE = {
  width: 720,
  height: 540,
  node: { width: 116, height: 88 },
  rowY: [64, 388] as const,
  colXs: [28, 165, 302, 439, 576] as const, // 5 columns
};

const NARROW = {
  width: 300,
  height: 912,
  node: { width: 96, height: 72 },
  gap: 16,
  marginY: 24,
};

/** Directed edge endpoints, computed from the two node rects. */
function edgeEndpoints(a: NodeRect, b: NodeRect): EdgeGeometry {
  const aCx = a.x + a.width / 2;
  const aCy = a.y + a.height / 2;
  const bCx = b.x + b.width / 2;
  const bCy = b.y + b.height / 2;

  // B below A → vertical connector (bottom-center → top-center).
  if (bCy > aCy) {
    return { from: { x: aCx, y: a.y + a.height }, to: { x: bCx, y: b.y } };
  }
  // B to the right (same row, flowing left → right).
  if (bCx > aCx) {
    return { from: { x: a.x + a.width, y: aCy }, to: { x: b.x, y: bCy } };
  }
  // B to the left (same row, flowing right → left).
  return { from: { x: a.x, y: aCy }, to: { x: b.x + b.width, y: bCy } };
}

function rectsFor(
  ids: InfrastructureNodeId[],
  mode: DiagramMode
): Record<InfrastructureNodeId, NodeRect> {
  const rects = {} as Record<InfrastructureNodeId, NodeRect>;

  if (mode === "wide") {
    ids.forEach((id, i) => {
      const row = i < 5 ? 0 : 1;
      // Bottom row reverses so the flow snakes (5 → 4 → 3 …).
      const col = row === 0 ? i : 9 - i;
      rects[id] = {
        x: WIDE.colXs[col],
        y: WIDE.rowY[row],
        width: WIDE.node.width,
        height: WIDE.node.height,
      };
    });
  } else {
    ids.forEach((id, i) => {
      rects[id] = {
        x: (NARROW.width - NARROW.node.width) / 2,
        y: NARROW.marginY + i * (NARROW.node.height + NARROW.gap),
        width: NARROW.node.width,
        height: NARROW.node.height,
      };
    });
  }

  return rects;
}

/** Build the full layout for the given mode. */
export function buildDiagramLayout(mode: DiagramMode): DiagramLayout {
  const ids = getVisibleFlow().map((node) => node.id);
  const rects = rectsFor(ids, mode);

  const edges: EdgeGeometry[] = [];
  for (let i = 0; i < ids.length - 1; i += 1) {
    edges.push(edgeEndpoints(rects[ids[i]], rects[ids[i + 1]]));
  }

  if (mode === "wide") {
    return {
      mode,
      viewBox: { width: WIDE.width, height: WIDE.height },
      nodeSize: WIDE.node,
      rects,
      edges,
      aspectRatio: WIDE.width / WIDE.height,
    };
  }

  return {
    mode,
    viewBox: { width: NARROW.width, height: NARROW.height },
    nodeSize: NARROW.node,
    rects,
    edges,
    aspectRatio: NARROW.width / NARROW.height,
  };
}

/** Orthogonal connector path between two edge endpoints. */
export function edgePath(from: Point, to: Point): string {
  if (from.x === to.x || from.y === to.y) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
}

/** Center point of a node rect — used for the flow lights. */
export function centerOf(rect: NodeRect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}
