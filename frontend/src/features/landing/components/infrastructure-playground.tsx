import { InfrastructureDiagram } from "./infrastructure-diagram";

/**
 * Infrastructure Playground.
 *
 * Sprint 04: an interactive, data-driven SVG diagram of the deployment
 * pipeline (Developer → … → Users). All node content lives in
 * `data/infrastructure-data.ts` — a future Studio CMS can source it from a
 * database. The Sprint 03 placeholder is replaced by the diagram; the
 * opening sequence runs once, hover effects are pure CSS, and reduced motion
 * is respected.
 */
export function InfrastructurePlayground() {
  return <InfrastructureDiagram />;
}
