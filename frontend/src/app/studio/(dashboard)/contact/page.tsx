import { SingleEntityEditor, StudioPage } from "@/features/studio";

/** Contact editor — only fields with data render on the public site. */
export default function StudioContactPage() {
  return (
    <StudioPage
      title="Contact"
      description="How visitors reach you. Only filled fields render, so the layout rebalances automatically."
    >
      <SingleEntityEditor entity="contact" />
    </StudioPage>
  );
}
