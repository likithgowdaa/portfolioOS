import { CollectionEditor, StudioPage } from "@/features/studio";

/** Journey editor — timeline entries with full CRUD and ordering. */
export default function StudioJourneyPage() {
  return (
    <StudioPage title="Journey" description="Timeline entries shown in the public journey section.">
      <CollectionEditor entity="journey" />
    </StudioPage>
  );
}
