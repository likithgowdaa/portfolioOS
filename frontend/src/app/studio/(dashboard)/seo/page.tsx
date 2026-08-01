import { SingleEntityEditor, StudioPage } from "@/features/studio";

/** SEO editor — metadata, Open Graph, Twitter card, icons, robots. */
export default function StudioSeoPage() {
  return (
    <StudioPage title="SEO" description="How the site appears in search results and social shares.">
      <SingleEntityEditor entity="seo" />
    </StudioPage>
  );
}
