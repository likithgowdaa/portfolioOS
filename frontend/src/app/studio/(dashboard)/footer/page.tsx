import { SingleEntityEditor, StudioPage } from "@/features/studio";

/** Footer editor — copyright, tagline, social links, and footer note. */
export default function StudioFooterPage() {
  return (
    <StudioPage
      title="Footer"
      description="The footer's text and social links. Empty values hide automatically."
    >
      <SingleEntityEditor entity="footer" />
    </StudioPage>
  );
}
