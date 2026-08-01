import { SingleEntityEditor, StudioPage } from "@/features/studio";

/** Profile editor — identity and About content. */
export default function StudioProfilePage() {
  return (
    <StudioPage
      title="Profile"
      description="Identity and About content shown on the public site. Empty fields hide automatically."
    >
      <SingleEntityEditor entity="profile" />
    </StudioPage>
  );
}
