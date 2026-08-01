/**
 * Projects data.
 *
 * Every project's content and links live here — components render it verbatim
 * and hardcode nothing. A future Studio CMS will source these fields from a
 * database instead of this module.
 *
 * Note: `github` / `demo` / `docs` currently point at root domains as
 * placeholders. Swap them for real links once each project ships.
 * Empty strings hide the corresponding button (see ProjectCard / ProjectDetail).
 */

/** Lifecycle stage, rendered as a status badge on the card and detail page. */
export type ProjectStatus = "live" | "beta" | "in-development" | "archived";

/** CMS visibility — future Studio can publish/hide projects without code. */
export type ProjectVisibility = "public" | "private" | "draft";

/** An engineering decision captured for the detail page. */
export interface EngineeringDecision {
  /** Short title of the decision. */
  title: string;
  /** Why this choice was made. */
  reason: string;
  /** What was given up or accepted in exchange. */
  tradeoff: string;
  /** What the decision taught the team. */
  lessons: string;
}

/** Documentation URLs — each button renders only when its URL is non-empty. */
export interface ProjectDocs {
  /** General documentation / guides. */
  documentation: string;
  /** Deep-dive architecture document. */
  architecture: string;
  /** API reference. */
  apiReference: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  /** Multi-paragraph overview — the detail page's hero body. */
  longDescription: string;
  /** The problem this project solves. */
  problem: string;
  /** How the project solves it. */
  solution: string;
  /** Key capabilities, rendered as a list. */
  features: string[];
  techStack: string[];
  status: ProjectStatus;
  /** Public path to the cover asset (hand-authored SVG). */
  coverImage: string;
  /** Featured projects are surfaced first by the future Studio CMS. */
  featured: boolean;
  /** Architecture section title (e.g. "Hub-and-Spoke Pipeline"). */
  architectureTitle: string;
  /** Textual architecture description (no diagrams yet). */
  architecture: string;
  /** Ordered, text-only architecture flow steps. Empty array = no flow list. */
  architectureFlow: string[];
  /** Noteworthy technical challenges faced during development. */
  challenges: string[];
  /** Key takeaways from the project. */
  learnings: string[];
  /** Engineering decisions, rendered as expandable cards. */
  engineeringDecisions: EngineeringDecision[];
  /** Perceived difficulty — hidden on the UI when empty. */
  difficulty: string;
  /** Estimated effort — hidden on the UI when empty. */
  estimatedDuration: string;
  /** Human-readable timeline (e.g. "2024", "Jan — Mar 2024"). */
  timeline: string;
  /** Repository URL — empty string hides the GitHub button. */
  github: string;
  /** Live-demo URL — empty string hides the Live Demo button. */
  demo: string;
  /** Documentation URLs — each button renders only when non-empty. */
  docs: ProjectDocs;
  /** Gallery image paths — empty array renders no gallery. */
  gallery: string[];
  visibility: ProjectVisibility;
  /** Detail-page slug (`/projects/<slug>`). */
  slug: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "cloud-cicd-pipeline",
    title: "Cloud CI/CD Pipeline",
    shortDescription:
      "A GitOps-driven CI/CD pipeline that builds, scans, and ships containerized services to a production Kubernetes cluster.",
    longDescription:
      "A production-grade CI/CD platform that takes a commit from GitHub and delivers it to a running Kubernetes service without human intervention. The pipeline handles container builds, security scanning, Helm-based deployment, and automated rollback — all defined as code and versioned alongside the application.",
    problem:
      "Shipping microservices to a Kubernetes cluster across staging and production environments is error-prone when done manually. Teams lose hours debugging failed deployments, and inconsistent processes create security gaps that are hard to detect after the fact.",
    solution:
      "The pipeline codifies every step — build, scan, push, deploy, verify — as a GitHub Actions workflow triggered by pull requests and merges. Terraform manages the EKS cluster and IAM roles, while Helm charts define the desired state of each service. A post-deployment health check rolls back automatically if readiness probes fail.",
    features: [
      "Automated container builds with multi-stage Dockerfiles",
      "Trivy vulnerability scanning on every image",
      "Helm-based deployments to staging on PR, production on merge",
      "Automatic rollback on failed health checks",
      "Terraform-managed EKS cluster and IAM roles",
      "Secrets rotation via External Secrets Operator",
    ],
    techStack: ["Terraform", "GitHub Actions", "Docker", "Amazon EKS", "GitOps"],
    status: "live",
    coverImage: "/projects/cloud-cicd-pipeline.svg",
    featured: true,
    architectureTitle: "Hub-and-Spoke Pipeline",
    architecture:
      "The platform follows a hub-and-spoke model. A central GitHub Actions orchestrator fans out to environment-specific deployment jobs. Each service lives in its own Helm chart with per-environment value overlays. Terraform state is stored in S3 with DynamoDB locking, and IAM roles follow least-privilege — the pipeline can only push to ECR and update EKS deployments in its target account.",
    architectureFlow: [
      "Developers open pull requests; GitHub Actions runs build, test, and Trivy scan jobs in parallel.",
      "Merged changes build multi-stage Docker images and push them to ECR.",
      "Helm renders per-environment value overlays and deploys to staging on PR, production on merge.",
      "Post-deployment health checks probe readiness endpoints.",
      "Failed health checks trigger an automatic rollback to the last known-good release.",
      "Terraform manages the EKS cluster, IAM roles, and state in S3 with DynamoDB locking.",
    ],
    challenges: [
      "Balancing pipeline speed with thoroughness — running full scans on every commit would triple build times.",
      "Managing Helm value overrides across three environments without drifting from a single source of truth.",
      "Designing rollback logic that distinguishes a bad deployment from a transient infrastructure blip.",
    ],
    learnings: [
      "GitOps works best when the pipeline itself is auditable — every change to infrastructure is a pull request.",
      "Post-deployment verification catches more regressions than pre-merge checks alone.",
      "Keeping Terraform modules small and composable makes environment promotion significantly easier.",
    ],
    engineeringDecisions: [
      {
        title: "GitHub Actions over a self-hosted CI server",
        reason:
          "The team already lived in GitHub; keeping CI adjacent to code and reviews removed a whole class of infrastructure to operate.",
        tradeoff:
          "Tight coupling to the GitHub ecosystem — migrating to another forge later would mean rewriting every workflow.",
        lessons:
          "Choosing CI that lives where the code lives reduces context-switching and eliminates self-hosted runner upkeep.",
      },
      {
        title: "One Helm chart, per-environment value overlays",
        reason:
          "Promoting the same chart with value overlays keeps a single source of truth instead of three divergent deployment definitions.",
        tradeoff:
          "Overlays can drift when a value is added to one environment and forgotten in the others.",
        lessons:
          "Overlay files need their own diff discipline — treat them like code and review them like code.",
      },
      {
        title: "Automatic rollback on health-check failure",
        reason:
          "Undoing a bad deploy in ninety seconds is cheaper than debugging it for an hour, so rollback was made the default response.",
        tradeoff:
          "The logic can confuse a transient infrastructure blip with a real failure and trigger unnecessary reverts.",
        lessons:
          "Distinguishing deployment failures from infrastructure noise requires carefully designed probes.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024",
    github: "https://github.com",
    demo: "https://example.com",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "cloud-cicd-pipeline",
  },
  {
    id: "kubernetes-observability-stack",
    title: "Kubernetes Observability Stack",
    shortDescription:
      "Unified metrics, logs, and traces for Kubernetes — one dashboard to observe every service in the cluster.",
    longDescription:
      "A full observability layer for Kubernetes that unifies metrics (Prometheus), logs (Loki), and traces (OpenTelemetry) behind a single Grafana interface. The stack deploys as a Helm chart with persistent storage and alerting rules baked in.",
    problem:
      "In a Kubernetes cluster with dozens of services, diagnosing a production incident means jumping between kubectl logs, Prometheus queries, and scattered dashboards. By the time the root cause is identified, the incident window has widened.",
    solution:
      "The stack consolidates all three pillars of observability into one Grafana instance. Prometheus scrapes service metrics, Loki ingests structured logs via Promtail, and OpenTelemetry collects distributed traces. Pre-built dashboards and alert rules mean a new service is observable the moment it joins the cluster — no per-service configuration required.",
    features: [
      "Prometheus for metrics with pre-configured scrape targets",
      "Loki + Promtail for centralized log aggregation",
      "OpenTelemetry Collector for distributed tracing",
      "Grafana dashboards for service health, latency, and error rates",
      "Alertmanager integration with Slack and PagerDuty",
      "Helm chart for one-command installation",
    ],
    techStack: ["Prometheus", "Grafana", "Loki", "OpenTelemetry"],
    status: "live",
    coverImage: "/projects/kubernetes-observability-stack.svg",
    featured: true,
    architectureTitle: "Unified Observability Pillars",
    architecture:
      "The stack is deployed as a dedicated monitoring namespace with its own resource quotas. Prometheus is configured with service monitors for automatic target discovery via Kubernetes labels. Loki receives logs through Promtail agents running as DaemonSets. The OpenTelemetry Collector sits as a sidecar in instrumented services, exporting traces to Grafana Tempo. Grafana acts as the unified query surface, composing Prometheus, Loki, and Tempo datasources into cohesive dashboards.",
    architectureFlow: [
      "Prometheus discovers targets via service monitors and scrapes service metrics.",
      "Promtail DaemonSets forward structured container logs to Loki.",
      "The OpenTelemetry Collector exports distributed traces to Grafana Tempo.",
      "Alertmanager routes alert rules to Slack and PagerDuty.",
      "Grafana composes Prometheus, Loki, and Tempo datasources into shared dashboards.",
      "A new service becomes observable the moment it joins the cluster — no per-service configuration.",
    ],
    challenges: [
      "Prometheus storage grew rapidly at scale — compaction and retention policies needed careful tuning.",
      "Correlating logs with traces required consistent trace IDs propagated through middleware, which not all services supported.",
      "Grafana dashboard proliferation made it hard to find the right view during incidents.",
    ],
    learnings: [
      "Standardizing on OpenTelemetry early prevents vendor lock-in and simplifies cross-signal correlation.",
      "A single Grafana instance with well-organized folders beats multiple specialized tools for incident response.",
      "Label cardinality is the silent killer of Prometheus performance — enforce naming conventions from day one.",
    ],
    engineeringDecisions: [
      {
        title: "A single Grafana instance over per-team instances",
        reason:
          "One instance with organized folders makes incident response faster — engineers always know where to look.",
        tradeoff:
          "Tenant isolation and per-team alert ownership are harder; one misconfigured dashboard affects everyone.",
        lessons:
          "Consolidation wins for small teams, but it demands strong folder discipline as usage grows.",
      },
      {
        title: "OpenTelemetry as the tracing standard",
        reason:
          "Adopting OTel early prevents vendor lock-in and makes cross-service trace correlation possible.",
        tradeoff:
          "The Collector adds an extra hop and a configuration surface before traces reach a backend.",
        lessons:
          "Standardizing trace IDs through middleware from day one would have avoided the correlation gaps we hit later.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024",
    github: "https://github.com",
    demo: "https://example.com",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "kubernetes-observability-stack",
  },
  {
    id: "multi-cloud-iam-automation",
    title: "Multi-Cloud IAM Automation",
    shortDescription:
      "Declarative identity management across AWS and Azure — least-privilege roles generated from a single source of truth.",
    longDescription:
      "A Terraform-based platform that generates and enforces least-privilege IAM policies across AWS and Azure from a unified role definition file. Changes to the role file propagate automatically, and drift detection ensures cloud permissions never silently expand.",
    problem:
      "Managing IAM across two cloud providers means two consoles, two policy languages, and two sets of audit trails. Roles drift over time, permissions accumulate, and nobody is certain whether a service still needs the access it was granted six months ago.",
    solution:
      "A single YAML file defines each service's required permissions in a cloud-agnostic format. A Terraform module translates these definitions into AWS IAM policies and Azure RBAC assignments. A scheduled pipeline detects drift between the declared state and the live cloud, opening an alert if permissions have changed outside the workflow.",
    features: [
      "Cloud-agnostic role definitions in YAML",
      "Terraform modules for AWS IAM and Azure RBAC",
      "Automated drift detection with scheduled reconciliation",
      "HashiCorp Vault integration for dynamic credentials",
      "Audit trail via Terraform state history and PR diffs",
      "Self-service role requests through a pull-request workflow",
    ],
    techStack: ["Terraform", "AWS IAM", "HashiCorp Vault", "Python"],
    status: "live",
    coverImage: "/projects/multi-cloud-iam-automation.svg",
    featured: false,
    architectureTitle: "Declarative Role Translation",
    architecture:
      "The system follows a declarative pattern: a roles/ directory contains YAML files, one per service. A Python pre-processor normalizes these into an intermediate representation, which two Terraform modules consume — one for AWS (IAM policies, roles, and trust relationships) and one for Azure (role assignments and managed identities). Vault handles dynamic database credentials with short-lived leases, removing the need to rotate static secrets.",
    architectureFlow: [
      "Engineers define each service's permissions in a cloud-agnostic YAML file.",
      "A Python pre-processor normalizes the definitions into an intermediate representation.",
      "Terraform modules translate the intermediate representation into AWS IAM and Azure RBAC.",
      "A scheduled pipeline reconciles live cloud permissions against the declared state.",
      "Changes outside the workflow surface as drift alerts for human review.",
      "Vault issues short-lived dynamic credentials, removing static-secret rotation.",
    ],
    challenges: [
      "AWS IAM and Azure RBAC have fundamentally different permission models — mapping a unified abstraction over both required creative compromises.",
      "Dynamic Vault credentials introduced latency at service startup, requiring a sidecar readiness pattern.",
      "Drift detection false positives were common until the pipeline learned to ignore transient role assumptions.",
    ],
    learnings: [
      "A single source of truth for permissions is only useful if the enforcement pipeline is faster than manual console changes.",
      "Vault dynamic credentials eliminate secret rotation but add operational complexity that teams must be trained on.",
      "Treating IAM as code (with PRs, reviews, and CI) turns a security liability into an audit advantage.",
    ],
    engineeringDecisions: [
      {
        title: "Cloud-agnostic YAML over provider-native policies",
        reason:
          "A single source of truth stops roles from drifting between AWS and Azure and gives auditors one artifact to review.",
        tradeoff:
          "The abstraction maps imperfectly — AWS IAM and Azure RBAC have fundamentally different permission models.",
        lessons:
          "Unified abstractions over divergent providers require creative compromises; document them explicitly.",
      },
      {
        title: "Vault dynamic credentials over static secrets",
        reason:
          "Short-lived leases eliminate the secret-rotation treadmill and shrink the blast radius of a leak.",
        tradeoff:
          "Credential retrieval at service startup added latency, forcing a sidecar readiness pattern.",
        lessons:
          "Dynamic credentials move the problem from rotation to availability — operational complexity teams must be trained on.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024",
    github: "https://github.com",
    demo: "",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "multi-cloud-iam-automation",
  },
  {
    id: "serverless-api-gateway",
    title: "Serverless API Gateway",
    shortDescription:
      "A pay-per-use REST API on Lambda and API Gateway with SAM-based CI/CD, caching, and request throttling.",
    longDescription:
      "A serverless REST API built on AWS Lambda and API Gateway, deployed via SAM templates. The service handles request routing, input validation, response caching, and per-client throttling — all without provisioning a single server.",
    problem:
      "Internal tools need lightweight APIs for CRUD operations and data lookups, but provisioning and maintaining EC2 instances or ECS services for low-traffic endpoints wastes budget and ops attention.",
    solution:
      "Each endpoint is a Lambda function behind API Gateway, defined in a SAM template. DynamoDB provides persistent storage with single-digit-millisecond reads. API Gateway handles throttling and caching at the edge, and a GitHub Actions pipeline deploys on every merge to main. Cold starts are mitigated with provisioned concurrency on latency-sensitive routes.",
    features: [
      "Lambda functions for each endpoint with per-function IAM roles",
      "DynamoDB single-table design for flexible data access patterns",
      "API Gateway caching and per-client request throttling",
      "SAM-based IaC with CI/CD via GitHub Actions",
      "Provisioned concurrency on critical paths",
      "CloudWatch alarms for latency and error-rate thresholds",
    ],
    techStack: ["AWS Lambda", "API Gateway", "DynamoDB", "AWS SAM"],
    status: "beta",
    coverImage: "/projects/serverless-api-gateway.svg",
    featured: false,
    architectureTitle: "Thin-Layer Serverless Services",
    architecture:
      "The API follows a thin-layer pattern: API Gateway routes requests to individual Lambda functions, each responsible for a single resource. A shared Lambda layer provides common utilities (validation, error formatting, DynamoDB client). DynamoDB uses single-table design with GSI overloads to support multiple access patterns. API Gateway stages separate dev and prod with independent throttle and cache settings.",
    architectureFlow: [
      "API Gateway routes requests to per-resource Lambda functions.",
      "A shared Lambda layer provides validation, error formatting, and a DynamoDB client.",
      "DynamoDB single-table design serves multiple access patterns via GSI overloads.",
      "API Gateway stages apply per-stage throttling and edge caching.",
      "GitHub Actions deploys via SAM on every merge to main.",
      "CloudWatch alarms monitor latency and error-rate thresholds.",
    ],
    challenges: [
      "Cold starts on Python Lambda functions added 300-800ms to first invocations, which was unacceptable for user-facing routes.",
      "DynamoDB single-table design made the data model harder to reason about as access patterns multiplied.",
      "Testing Lambda functions locally required SAM local, which had subtle behavior differences from the real runtime.",
    ],
    learnings: [
      "Provisioned concurrency solves cold starts but shifts the cost model closer to always-on — measure actual traffic before committing.",
      "Single-table DynamoDB is powerful once the model clicks, but it demands upfront access-pattern analysis.",
      "SAM local is good enough for integration tests; unit tests should mock the AWS SDK instead.",
    ],
    engineeringDecisions: [
      {
        title: "A Lambda function per endpoint over a monolith function",
        reason:
          "Per-resource functions keep IAM scoped to a single resource and let each endpoint scale independently.",
        tradeoff:
          "Function sprawl and cold starts multiply; latency-sensitive routes needed provisioned concurrency.",
        lessons:
          "Per-function isolation is worth the sprawl, but provisioned concurrency shifts cost toward always-on — measure traffic before committing.",
      },
      {
        title: "Single-table DynamoDB design",
        reason:
          "One table with GSI overloads keeps reads at single-digit milliseconds and avoids multiple table-management surfaces.",
        tradeoff: "The data model is harder to reason about as access patterns multiply.",
        lessons:
          "Single-table design demands upfront access-pattern analysis; it only clicked once every query was mapped first.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024",
    github: "https://github.com",
    demo: "https://example.com",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "serverless-api-gateway",
  },
  {
    id: "postgresql-disaster-recovery",
    title: "PostgreSQL Disaster Recovery",
    shortDescription:
      "Automated, encrypted backups for PostgreSQL with nightly verified restores and point-in-time recovery.",
    longDescription:
      "An automated disaster-recovery system for PostgreSQL that performs encrypted, versioned backups to S3, runs nightly restore-verification tests, and supports point-in-time recovery within a configurable retention window.",
    problem:
      "PostgreSQL backups are only useful if they actually restore. Most teams set up pg_dump cron jobs and hope for the best — discovering the backup was corrupted only when production is already down.",
    solution:
      "pgBackRest handles continuous WAL archiving and full/incremental backups to encrypted S3 buckets. A nightly pipeline restores the latest backup to an isolated instance, runs a suite of integrity checks, and reports success or failure. The system supports point-in-time recovery to any second within a 30-day retention window.",
    features: [
      "Continuous WAL archiving for point-in-time recovery",
      "Full weekly and incremental daily backups to S3",
      "AES-256 encryption at rest and in transit",
      "Nightly automated restore verification",
      "30-day configurable retention window",
      "systemd integration for automatic WAL archiving on write",
    ],
    techStack: ["PostgreSQL", "pgBackRest", "Amazon S3", "systemd"],
    status: "live",
    coverImage: "/projects/postgresql-disaster-recovery.svg",
    featured: false,
    architectureTitle: "Archived, Verified, Restorable",
    architecture:
      "pgBackRest runs on the database server as a systemd service, continuously archiving WAL segments to S3. Full backups execute weekly; incrementals run nightly. A separate verification instance restores the latest backup into a clean data directory, runs pg_dumpall integrity checks, and reports to a monitoring endpoint. The S3 bucket uses server-side encryption with a KMS-managed key, and lifecycle policies enforce the retention window.",
    architectureFlow: [
      "pgBackRest runs as a systemd service, continuously archiving WAL segments to S3.",
      "Full backups run weekly; incremental backups run nightly.",
      "S3 uses server-side encryption with a KMS-managed key.",
      "Lifecycle policies enforce the 30-day retention window.",
      "A verification instance restores the latest backup to a clean data directory nightly.",
      "pg_dumpall integrity checks report success or failure to a monitoring endpoint.",
    ],
    challenges: [
      "WAL segment accumulation between full backups consumed significant S3 storage until compression and retention were tuned.",
      "Restore verification required an isolated instance with enough disk space for a full database copy, which tripled the nightly infrastructure cost.",
      "pgBackRest stanza initialization on a running database required careful coordination to avoid locking conflicts.",
    ],
    learnings: [
      "Testing backups is more important than taking them — an unverified backup is a hope, not a plan.",
      "WAL compression ratios vary dramatically by workload; measure before estimating storage costs.",
      "A dedicated verification pipeline removes the human element from the most critical DR step.",
    ],
    engineeringDecisions: [
      {
        title: "pgBackRest over pg_dump cron jobs",
        reason:
          "Continuous WAL archiving gives point-in-time recovery to any second within retention, which periodic dumps cannot.",
        tradeoff:
          "It is a more complex system to operate — stanza setup on a live database requires careful coordination to avoid lock conflicts.",
        lessons: "A backup you cannot restore to an exact point in time is a hope, not a plan.",
      },
      {
        title: "Nightly restore verification",
        reason:
          "Backups are only useful if they actually restore; verification removes the human element from the most critical DR step.",
        tradeoff:
          "An isolated verification instance with a full database copy roughly tripled nightly infrastructure cost.",
        lessons:
          "Testing backups matters more than taking them — the first restore test caught corruption that had been silent for weeks.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024",
    github: "",
    demo: "https://example.com",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "postgresql-disaster-recovery",
  },
  {
    id: "homelab-kubernetes-cluster",
    title: "Homelab Kubernetes Cluster",
    shortDescription:
      "A GitOps-managed Kubernetes homelab serving personal applications through a Cloudflare tunnel.",
    longDescription:
      "A home Kubernetes cluster built on k3s, provisioned with Ansible, and managed entirely through GitOps with Argo CD. Personal services — media, dashboards, automation — run as containers, exposed securely through a Cloudflare tunnel without port forwarding.",
    problem:
      "Running personal services on scattered Raspberry Pis and VPS instances leads to config drift, inconsistent updates, and a fragile network topology that breaks the moment something needs to change.",
    solution:
      "Ansible provisions a multi-node k3s cluster from a single playbook. Argo CD watches a Git repository for Helm chart changes and synchronizes the cluster state automatically. Traefik handles ingress within the cluster, and a Cloudflare tunnel exposes selected services to the internet without opening firewall ports.",
    features: [
      "Ansible playbooks for reproducible cluster provisioning",
      "k3s lightweight Kubernetes on ARM and x86 nodes",
      "Argo CD for GitOps-driven application deployment",
      "Traefik ingress with automatic TLS via Let's Encrypt",
      "Cloudflare tunnel for secure external access",
      "Monitoring via the Kubernetes Observability Stack",
    ],
    techStack: ["k3s", "Ansible", "Traefik", "Argo CD"],
    status: "in-development",
    coverImage: "/projects/homelab-kubernetes-cluster.svg",
    featured: false,
    architectureTitle: "GitOps-Declared Homelab",
    architecture:
      "The cluster runs k3s on a mix of ARM (Raspberry Pi) and x86 (NUC) nodes. Ansible handles OS-level setup (container runtime, networking, kubelet config) and joins nodes to the cluster. Argo CD is deployed as a system application, watching a dedicated GitOps repository. Traefik handles internal ingress with cert-manager providing automatic TLS. The Cloudflare tunnel runs as a DaemonSet, routing external traffic to ClusterIP services by name.",
    architectureFlow: [
      "Ansible playbooks provision k3s on ARM and x86 nodes and join them to the cluster.",
      "Argo CD is deployed as a system application, watching a dedicated GitOps repository.",
      "Traefik handles internal ingress with cert-manager providing automatic TLS.",
      "The Cloudflare tunnel DaemonSet routes external traffic to ClusterIP services by name.",
      "The cluster self-heals whenever Git and live state diverge.",
    ],
    challenges: [
      "Mixed ARM/x86 architecture meant container images needed multi-arch builds, and some Helm charts did not publish ARM variants.",
      "k3s's embedded etcd had stability issues on Raspberry Pi SD cards — switching to SSD boot drives resolved most failures.",
      "Argo CD application manifests had to be templated carefully to avoid secrets leaking into the GitOps repository.",
    ],
    learnings: [
      "GitOps is addictive — once the cluster self-heals from Git, manual kubectl edits feel like a liability.",
      "Home labs are the best sandbox for Kubernetes because the cost of failure is a reboot, not a page.",
      "Multi-arch support in the ecosystem has improved dramatically, but edge cases still exist for niche ARM workloads.",
    ],
    engineeringDecisions: [
      {
        title: "Argo CD GitOps over manual kubectl",
        reason:
          "Once the cluster self-heals from Git, every change is reviewable and reversible — manual edits become a liability.",
        tradeoff:
          "Application manifests must be templated carefully to avoid leaking secrets into the GitOps repository.",
        lessons:
          "GitOps discipline is the real product; the cluster is just the surface it governs.",
      },
      {
        title: "k3s on mixed ARM and x86 nodes",
        reason:
          "Reusing spare Raspberry Pis alongside a NUC keeps cost near zero while exercising real multi-architecture workloads.",
        tradeoff:
          "Images need multi-arch builds, and some Helm charts do not publish ARM variants.",
        lessons:
          "Home labs are the best sandbox for Kubernetes — the cost of failure is a reboot, not a page.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024 — present",
    github: "https://github.com",
    demo: "",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "public",
    slug: "homelab-kubernetes-cluster",
  },
  {
    id: "client-deployment-automation",
    title: "Client Deployment Automation",
    shortDescription:
      "Internal rollout automation that provisions and patches a fleet of client servers.",
    longDescription:
      "An Ansible-driven automation platform for provisioning, patching, and configuring a fleet of client-owned Ubuntu servers from a single control node.",
    problem:
      "Each new client engagement required manually provisioning servers, installing a base stack, and applying security hardening — a process that took hours per machine and introduced configuration drift across clients.",
    solution:
      "A set of Ansible roles and playbooks encodes the entire provisioning process: OS hardening, user setup, package installation, firewall rules, and monitoring agent deployment. A single command provisions a new server; a scheduled playbook keeps the fleet patched and compliant.",
    features: [
      "Idempotent Ansible roles for provisioning and hardening",
      "Automated security patching on a weekly schedule",
      "Compliance reporting against a CIS benchmark baseline",
      "Multi-client inventory with role-based access control",
    ],
    techStack: ["Ansible", "Bash", "Nginx"],
    status: "in-development",
    coverImage: "/projects/client-deployment-automation.svg",
    featured: false,
    architectureTitle: "Fleet Control Node",
    architecture:
      "A control node runs Ansible playbooks against an inventory organized by client. Each client has a variable file defining their specific configuration (packages, users, firewall rules). Roles are shared across clients; variables customize the behavior. A cron-driven scheduler runs the compliance playbook weekly and outputs a report to a shared directory.",
    architectureFlow: [
      "A control node runs Ansible playbooks against a client-organized inventory.",
      "Each client's variable file defines packages, users, and firewall rules.",
      "Shared roles customize behavior per client via variables.",
      "A cron-driven scheduler runs the compliance playbook weekly.",
      "Compliance reports are written to a shared directory.",
    ],
    challenges: [
      "Client servers ran different Ubuntu versions, requiring conditional logic in roles that complicated playbook maintenance.",
      "SSH key management across multiple client fleets became a security concern that required a centralized vault.",
      "Idempotency was harder to achieve than expected — several roles had side effects that broke re-runs.",
    ],
    learnings: [
      "Ansible is powerful for fleet management, but role testing with Molecule saves hours of debugging in production.",
      "Treating infrastructure code with the same rigor as application code (linting, testing, PR reviews) prevents the most painful outages.",
      "Centralized secret management is non-negotiable once the fleet grows beyond a handful of clients.",
    ],
    engineeringDecisions: [
      {
        title: "Shared roles with per-client variable files",
        reason:
          "Reusing roles across clients keeps a single implementation of each task while per-client variables customize behavior.",
        tradeoff:
          "Different Ubuntu versions forced conditional logic into roles, complicating playbook maintenance.",
        lessons:
          "Role testing with Molecule saves hours of debugging — idempotency was harder to achieve than expected.",
      },
      {
        title: "Centralized vault for client SSH keys",
        reason:
          "SSH key management across multiple client fleets is a security concern that demands a single encrypted store.",
        tradeoff:
          "A centralized vault becomes a single point of failure if access controls and rotation are not enforced.",
        lessons:
          "Centralized secret management is non-negotiable once the fleet grows beyond a handful of clients.",
      },
    ],
    difficulty: "",
    estimatedDuration: "",
    timeline: "2024 — present",
    github: "",
    demo: "",
    docs: { documentation: "", architecture: "", apiReference: "" },
    gallery: [],
    visibility: "private",
    slug: "client-deployment-automation",
  },
];

/** Look up a project by its URL slug. Returns undefined if no match. */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** The subset of projects actually rendered (public visibility). */
export function getVisibleProjects(): Project[] {
  return PROJECTS.filter((project) => project.visibility === "public");
}

/** Slugs for generateStaticParams — all public projects. */
export function getPublicSlugs(): string[] {
  return getVisibleProjects().map((project) => project.slug);
}

/**
 * Related projects for a detail page: the visible projects sharing the most
 * technology with the current project, excluding it. Best match first.
 */
export function getRelatedProjects(project: Project, limit = 3): Project[] {
  return getVisibleProjects()
    .filter((candidate) => candidate.id !== project.id)
    .map((candidate) => ({
      candidate,
      score: candidate.techStack.filter((tech) => project.techStack.includes(tech)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
