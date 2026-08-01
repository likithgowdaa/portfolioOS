import { CollectionEditor, StudioPage } from "@/features/studio";

/** Projects editor — full CRUD, ordering, and per-item visibility. */
export default function StudioProjectsPage() {
  return (
    <StudioPage
      title="Projects"
      description="Full control over the projects grid — create, edit, reorder, and set visibility."
    >
      <CollectionEditor entity="projects" />
    </StudioPage>
  );
}
