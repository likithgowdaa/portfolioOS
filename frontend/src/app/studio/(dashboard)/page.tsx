import {
  AwardIcon,
  FileTextIcon,
  FolderIcon,
  MailIcon,
  RouteIcon,
  UserRoundIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  PORTFOLIO_META,
  StatCard,
  StatusBadge,
  StudioPage,
  SummaryList,
  ThemeStatus,
} from "@/features/studio";
import { getPublicContent } from "@/lib/cms/public";

const PROFILE_FIELDS = [
  "name",
  "role",
  "tagline",
  "availability",
  "location",
  "email",
  "github",
  "linkedin",
] as const;

const CONTACT_FIELDS = ["email", "github", "linkedin", "location", "availability"] as const;

/**
 * Studio dashboard — an informational overview.
 *
 * Summary counts and statuses are derived from the same published content the
 * public site renders, so the dashboard always reflects production.
 */
export default async function StudioDashboardPage() {
  const content = await getPublicContent();

  const projectCount = content.projects.length;
  const journeyCount = content.journey.length;
  const certificationCount = content.certifications.length;

  const profileFilled = PROFILE_FIELDS.filter((field) => content.profile[field].length > 0).length;
  const contactFilled = CONTACT_FIELDS.filter((field) => content.profile[field].length > 0).length;

  return (
    <StudioPage
      title="Dashboard"
      description="An overview of the content that powers the public portfolio."
      badge={<StatusBadge status={PORTFOLIO_META.status} />}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          label="Projects"
          value={projectCount}
          hint="Published projects"
          icon={FolderIcon}
        />
        <StatCard label="Journey" value={journeyCount} hint="Published entries" icon={RouteIcon} />
        <StatCard
          label="Certifications"
          value={certificationCount}
          hint="Published credentials"
          icon={AwardIcon}
        />
        <StatCard
          label="Resume"
          value={content.profile.resumeAvailable ? "Ready" : "Not set"}
          hint={content.profile.resumeAvailable ? "Available for download" : "No asset added yet"}
          icon={FileTextIcon}
        />
        <StatCard
          label="Profile"
          value={`${profileFilled}/${PROFILE_FIELDS.length}`}
          hint="Fields populated"
          icon={UserRoundIcon}
        />
        <StatCard
          label="Contact"
          value={`${contactFilled}/${CONTACT_FIELDS.length}`}
          hint="Contact channels"
          icon={MailIcon}
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <h2 className="text-title font-semibold tracking-tight">Portfolio</h2>
          <SummaryList
            rows={[
              { label: "Last Updated", value: PORTFOLIO_META.lastUpdated || "—" },
              { label: "Last Published", value: PORTFOLIO_META.lastPublished || "—" },
              { label: "Portfolio Status", value: <StatusBadge status={PORTFOLIO_META.status} /> },
              { label: "Theme", value: <ThemeStatus /> },
            ]}
          />
        </CardContent>
      </Card>
    </StudioPage>
  );
}
