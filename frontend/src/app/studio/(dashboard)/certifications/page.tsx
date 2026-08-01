import { CollectionEditor, StudioPage } from "@/features/studio";

/** Certifications editor — credentials with full CRUD and ordering. */
export default function StudioCertificationsPage() {
  return (
    <StudioPage
      title="Certifications"
      description="Credentials displayed in the public certifications grid."
    >
      <CollectionEditor entity="certifications" />
    </StudioPage>
  );
}
