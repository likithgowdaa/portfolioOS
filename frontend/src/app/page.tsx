import { PageWrapper } from "@/components/shared/page-wrapper";
import { AboutSection } from "@/features/about";
import { CertificationsSection } from "@/features/certifications";
import { ContactSection } from "@/features/contact";
import { FooterSection } from "@/features/footer";
import { JourneySection } from "@/features/journey";
import { Hero, Navbar, OpeningExperience } from "@/features/landing";
import { ProjectsSection } from "@/features/projects";
import { ResumeSection } from "@/features/resume";
import { getPublicContent } from "@/lib/cms/public";

// Content is CMS-managed at runtime, so the page renders on demand — a publish
// is reflected immediately.
export const dynamic = "force-dynamic";

/**
 * Landing experience.
 *
 * Opening overlay → fixed navigation → hero → projects grid → about → journey
 * → certifications → resume → contact → footer. Every section renders from the
 * CMS content passed in, and hides itself automatically when its content is
 * empty.
 */
export default async function Home() {
  const content = await getPublicContent();

  return (
    <>
      <OpeningExperience />
      <Navbar profile={content.profile} />
      <PageWrapper>
        <Hero profile={content.profile} />
        <ProjectsSection projects={content.projects} />
        <AboutSection profile={content.profile} />
        <JourneySection entries={content.journey} />
        <CertificationsSection certifications={content.certifications} />
        <ResumeSection profile={content.profile} />
        <ContactSection profile={content.profile} />
      </PageWrapper>
      <FooterSection footer={content.footer} />
    </>
  );
}
