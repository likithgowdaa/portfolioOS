import {
  BoxesIcon,
  Code2Icon,
  ContainerIcon,
  DatabaseIcon,
  GitBranchIcon,
  MonitorIcon,
  PackageIcon,
  ServerIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Infrastructure Playground data.
 *
 * Every node's content and behavior lives here — components render it
 * verbatim and hardcode nothing. A future Studio CMS will source these
 * fields from a database instead of this module.
 */

export type InfrastructureNodeId =
  | "developer"
  | "github"
  | "actions"
  | "docker"
  | "registry"
  | "kubernetes"
  | "backend"
  | "supabase"
  | "frontend"
  | "users";

/** Hover behavior each node plays while the user interacts with it. */
export type NodeEffect =
  | "hover-glow"
  | "commit-pulse"
  | "pipeline-lights"
  | "container-expand"
  | "glow-pulse"
  | "pods-pulse"
  | "api-request"
  | "db-readwrite"
  | "component-highlight"
  | "soft-glow";

export interface InfrastructureNode {
  id: InfrastructureNodeId;
  title: string;
  /** One-line purpose, shown in the tooltip. */
  purpose: string;
  /** The technology / stack the node represents. */
  technology: string;
  /** Why it exists in the pipeline. */
  why: string;
  icon: LucideIcon;
  effect: NodeEffect;
  /** CMS visibility — future Studio can hide nodes without touching code. */
  visible: boolean;
}

export const INFRASTRUCTURE_NODES: readonly InfrastructureNode[] = [
  {
    id: "developer",
    title: "Developer",
    purpose: "Writes the code that ships.",
    technology: "Local dev environment",
    why: "Every deployment starts here — the source of the change.",
    icon: Code2Icon,
    effect: "hover-glow",
    visible: true,
  },
  {
    id: "github",
    title: "GitHub",
    purpose: "Hosts the repository and coordinates the workflow.",
    technology: "Git · GitHub",
    why: "The single source of truth for code, PRs, and releases.",
    icon: GitBranchIcon,
    effect: "commit-pulse",
    visible: true,
  },
  {
    id: "actions",
    title: "GitHub Actions",
    purpose: "Runs the CI/CD pipeline on every push.",
    technology: "GitHub Actions",
    why: "Automates build, test, and deploy without manual steps.",
    icon: WorkflowIcon,
    effect: "pipeline-lights",
    visible: true,
  },
  {
    id: "docker",
    title: "Docker Build",
    purpose: "Packages the application into portable containers.",
    technology: "Docker",
    why: "Build once, run anywhere — one artifact for every environment.",
    icon: ContainerIcon,
    effect: "container-expand",
    visible: true,
  },
  {
    id: "registry",
    title: "Container Registry",
    purpose: "Stores and versions the built images.",
    technology: "Container registry (OCI)",
    why: "A versioned image catalog the cluster can pull from.",
    icon: PackageIcon,
    effect: "glow-pulse",
    visible: true,
  },
  {
    id: "kubernetes",
    title: "Kubernetes Cluster",
    purpose: "Orchestrates the running services.",
    technology: "Kubernetes",
    why: "Schedules, scales, and heals containers automatically.",
    icon: BoxesIcon,
    effect: "pods-pulse",
    visible: true,
  },
  {
    id: "backend",
    title: "FastAPI Backend",
    purpose: "Serves the JSON API.",
    technology: "FastAPI · Python",
    why: "Exposes business logic to the frontend over HTTP.",
    icon: ServerIcon,
    effect: "api-request",
    visible: true,
  },
  {
    id: "supabase",
    title: "Supabase",
    purpose: "Persists data and handles auth.",
    technology: "Supabase · Postgres",
    why: "A hosted Postgres layer for structured, realtime data.",
    icon: DatabaseIcon,
    effect: "db-readwrite",
    visible: true,
  },
  {
    id: "frontend",
    title: "Next.js Frontend",
    purpose: "Renders the site for visitors.",
    technology: "Next.js · React",
    why: "The user-facing layer, served fast and static-first.",
    icon: MonitorIcon,
    effect: "component-highlight",
    visible: true,
  },
  {
    id: "users",
    title: "Users",
    purpose: "The people the whole pipeline serves.",
    technology: "Any browser",
    why: "The endpoint of the workflow — where value is delivered.",
    icon: UsersIcon,
    effect: "soft-glow",
    visible: true,
  },
];

/** The deployment flow, in order. */
export const INFRASTRUCTURE_FLOW: readonly InfrastructureNodeId[] = [
  "developer",
  "github",
  "actions",
  "docker",
  "registry",
  "kubernetes",
  "backend",
  "supabase",
  "frontend",
  "users",
];

/** Map a node id to its definition. */
export function getInfrastructureNode(id: InfrastructureNodeId): InfrastructureNode {
  return INFRASTRUCTURE_NODES.find((node) => node.id === id)!;
}

/** The subset of nodes actually rendered, in flow order. */
export function getVisibleFlow(): InfrastructureNode[] {
  return INFRASTRUCTURE_FLOW.map(getInfrastructureNode).filter((node) => node.visible);
}
