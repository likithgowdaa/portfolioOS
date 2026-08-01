import type { InfrastructureNode } from "../data/infrastructure-data";

/**
 * Rich tooltip content for a diagram node — title, purpose, technology, and
 * why it exists. Rendered inside the shared Tooltip component.
 */
export function InfrastructureNodeTooltip({ node }: { node: InfrastructureNode }) {
  return (
    <div className="max-w-xs space-y-1 text-left">
      <p className="font-medium tracking-tight">{node.title}</p>
      <p>{node.purpose}</p>
      <p className="text-background/70">{node.technology}</p>
      <p className="text-background/60">{node.why}</p>
    </div>
  );
}
