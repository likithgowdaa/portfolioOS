/**
 * Studio — public entrypoint for the feature slice.
 *
 * External consumers (Studio routes) import from here; individual components
 * stay private. The Studio CMS builds on the v2.0.0 foundation: the shell,
 * save workflow, publish model, and theme are reused unchanged.
 */
export { StudioShell } from "./components/studio-shell";
export { StudioPage } from "./components/studio-page";
export { SummaryList } from "./components/summary-list";
export type { SummaryRow } from "./components/summary-list";
export { StatusBadge } from "./components/status-badge";
export { StatCard } from "./components/stat-card";
export { ContentList } from "./components/content-list";
export type { ContentRow } from "./components/content-list";
export { ThemeSelect } from "./components/theme-select";
export { ThemeStatus } from "./components/theme-status";
export { SaveStateProvider, useSaveState } from "./hooks/save-state";

export { SingleEntityEditor, CollectionEditor } from "./editors";
export { EntityForm } from "./form";
export type { FieldSchema, FieldSection, FieldType } from "./form";
export { ENTITY_SCHEMAS, VISIBILITY_OPTIONS } from "./schemas";
export type { EntitySchema } from "./schemas";

export {
  PUBLISH_STATUS_META,
  PORTFOLIO_META,
  STUDIO_NAV_ITEMS,
  STUDIO_NAME,
  STUDIO_SUBTITLE,
} from "./data/studio-config";
export type { PublishStatus, StudioNavItem } from "./data/studio-config";
