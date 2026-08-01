import { SingleEntityEditor, StudioPage } from "@/features/studio";

/** Resume editor — the asset, metadata, and availability. */
export default function StudioResumePage() {
  return (
    <StudioPage
      title="Resume"
      description="The resume asset and how the public section presents it. The section disappears when unavailable."
    >
      <SingleEntityEditor entity="resume" />
    </StudioPage>
  );
}
