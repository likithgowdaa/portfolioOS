import {
  AwardIcon,
  BookOpenIcon,
  ChartColumnIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  MailIcon,
  PanelBottomIcon,
  RouteIcon,
  SearchIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Studio configuration — navigation and the publishing model.
 *
 * All Studio content is data-driven; the CMS (next milestone) will source the
 * same model from a database. Publishing is never automatic: every piece of
 * content carries an explicit lifecycle status.
 */

/** Lifecycle a piece of content can be in. */
export type PublishStatus = "draft" | "published" | "hidden" | "archived";

export interface PublishStatusMeta {
  label: string;
  className?: string;
}

/** Status → presentation. Labels live here; data stores the enum. */
export const PUBLISH_STATUS_META: Record<PublishStatus, PublishStatusMeta> = {
  draft: { label: "Draft" },
  published: {
    label: "Published",
    className: "border-success/30 bg-success/10 text-success",
  },
  hidden: { label: "Hidden", className: "text-muted-foreground" },
  archived: { label: "Archived", className: "text-muted-foreground" },
};

/**
 * Portfolio-level publishing metadata.
 *
 * `lastUpdated` / `lastPublished` are populated by the Studio CMS; until then
 * they are empty and the dashboard shows them as unknown ("—"). `status` is
 * intentionally `draft` — nothing is formally published yet and publishing
 * never happens automatically.
 */
export const PORTFOLIO_META: {
  lastUpdated: string;
  lastPublished: string;
  status: PublishStatus;
} = {
  lastUpdated: "",
  lastPublished: "",
  status: "draft",
};

export interface StudioNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** When set, the item renders as a non-link (e.g. coming soon). */
  disabled?: boolean;
  /** Optional trailing hint chip on the item. */
  hint?: "soon";
}

/** Sidebar navigation, in display order. */
export const STUDIO_NAV_ITEMS: readonly StudioNavItem[] = [
  { label: "Dashboard", href: "/studio", icon: LayoutDashboardIcon },
  { label: "Profile", href: "/studio/profile", icon: UserRoundIcon },
  { label: "Projects", href: "/studio/projects", icon: FolderIcon },
  { label: "Journey", href: "/studio/journey", icon: RouteIcon },
  { label: "Certifications", href: "/studio/certifications", icon: AwardIcon },
  { label: "Resume", href: "/studio/resume", icon: FileTextIcon },
  { label: "Contact", href: "/studio/contact", icon: MailIcon },
  { label: "Footer", href: "/studio/footer", icon: PanelBottomIcon },
  { label: "SEO", href: "/studio/seo", icon: SearchIcon },
  { label: "Settings", href: "/studio/settings", icon: SettingsIcon },
  {
    label: "Resources",
    href: "/studio/resources",
    icon: BookOpenIcon,
    disabled: true,
    hint: "soon",
  },
  {
    label: "Analytics",
    href: "/studio/analytics",
    icon: ChartColumnIcon,
    disabled: true,
    hint: "soon",
  },
];

/** Brand text shown in the sidebar. */
export const STUDIO_NAME = "PortfolioOS";
export const STUDIO_SUBTITLE = "Studio";
