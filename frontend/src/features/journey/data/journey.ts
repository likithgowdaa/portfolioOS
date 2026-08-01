/**
 * Journey timeline data.
 *
 * Every timeline entry's content lives here — components render it verbatim
 * and hardcode no timeline information. A future Studio CMS will source these
 * fields from a database instead of this module.
 *
 * Entries are ordered newest-first (top-down as they render). `icon` is a
 * plain string key from the `JourneyIcon` vocabulary — the mapping to a Lucide
 * component lives in `journey-timeline-item.tsx`, keeping this module
 * CMS-serializable.
 *
 * The timeline covers education, career milestones, learning milestones, major
 * projects, internships, and role transitions. Certifications are deliberately
 * excluded — the Certifications section is their single source of truth.
 *
 * The entries below are placeholder examples. Swap the content for the owner's
 * real history (education, roles, milestones) when it is supplied.
 */

/** The kind of entry — shown as a small label on each card. */
export type JourneyCategory = "education" | "experience" | "milestone";

/** Lifecycle stage, rendered as a status badge on the card. */
export type JourneyStatus = "completed" | "current" | "planned";

/** CMS visibility — future Studio can publish/hide entries without code. */
export type JourneyVisibility = "public" | "private" | "draft";

/** Icon vocabulary — mapped to Lucide components in the UI layer. */
export type JourneyIcon = "graduation-cap" | "briefcase" | "award" | "sparkles" | "rocket" | "code";

/** An external link attached to a timeline entry. */
export interface JourneyLink {
  /** Button label. */
  label: string;
  /** Absolute URL. */
  url: string;
}

export interface JourneyEntry {
  id: string;
  /** Human-readable range, e.g. "2022 — 2024" or "2018". */
  date: string;
  title: string;
  subtitle: string;
  description: string;
  category: JourneyCategory;
  status: JourneyStatus;
  /** Icon key from the `JourneyIcon` vocabulary. */
  icon: JourneyIcon;
  /** Featured entries get a stronger connector dot and card ring. */
  highlight: boolean;
  visibility: JourneyVisibility;
  /** Technology chips — hidden while empty. */
  technologies: string[];
  /** External links — hidden while empty. */
  links: JourneyLink[];
}

export const JOURNEY: readonly JourneyEntry[] = [
  {
    id: "cloud-devops-engineer",
    date: "2024 — Present",
    title: "Cloud & DevOps Engineer",
    subtitle: "Designing and operating production cloud infrastructure",
    description:
      "Automating delivery pipelines, managing Kubernetes workloads, and hardening multi-cloud environments — focused on reliability, security, and developer velocity.",
    category: "experience",
    status: "current",
    icon: "briefcase",
    highlight: true,
    visibility: "public",
    technologies: ["Terraform", "Kubernetes", "AWS", "GitHub Actions", "Docker"],
    links: [],
  },
  {
    id: "platform-engineering-internship",
    date: "2023 — 2024",
    title: "Platform Engineering Intern",
    subtitle: "Cloud infrastructure and release automation",
    description:
      "Containerized services, automated deployments, and hardened cloud environments. Learned infrastructure-as-code discipline and the value of verified rollouts.",
    category: "experience",
    status: "completed",
    icon: "code",
    highlight: false,
    visibility: "public",
    technologies: ["AWS", "Docker", "Ansible", "CI/CD"],
    links: [],
  },
  {
    id: "homelab-kubernetes-cluster",
    date: "2023",
    title: "Homelab Kubernetes Cluster",
    subtitle: "Hands-on infrastructure milestone",
    description:
      "Built and operated a GitOps-managed Kubernetes cluster at home to run personal services — the sandbox where the production stack is first exercised.",
    category: "milestone",
    status: "completed",
    icon: "rocket",
    highlight: false,
    visibility: "public",
    technologies: ["k3s", "Argo CD", "Ansible", "Cloudflare"],
    links: [],
  },
  {
    id: "bachelor-computer-science",
    date: "2019 — 2023",
    title: "Bachelor of Engineering — Computer Science",
    subtitle: "Formal engineering foundation",
    description:
      "Studied operating systems, networking, databases, and distributed systems — the fundamentals behind every infrastructure decision made since.",
    category: "education",
    status: "completed",
    icon: "graduation-cap",
    highlight: false,
    visibility: "public",
    technologies: [],
    links: [],
  },
  {
    id: "first-open-source-contributions",
    date: "2022",
    title: "First Open-Source Contributions",
    subtitle: "Learning in public",
    description:
      "Started contributing to open-source tooling and writing about infrastructure — the beginning of learning in public and giving back to the ecosystem.",
    category: "milestone",
    status: "completed",
    icon: "sparkles",
    highlight: false,
    visibility: "public",
    technologies: [],
    links: [],
  },
];

/** The subset of entries actually rendered (public visibility). */
export function getVisibleJourneyEntries(): JourneyEntry[] {
  return JOURNEY.filter((entry) => entry.visibility === "public");
}
