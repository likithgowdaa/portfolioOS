import { Card, CardContent } from "@/components/ui/card";
import { StudioPage, ThemeSelect } from "@/features/studio";

/**
 * Settings — Studio preferences.
 *
 * The only setting today is the theme (System / Light / Dark), which uses the
 * same next-themes infrastructure as the public portfolio.
 */
export default function StudioSettingsPage() {
  return (
    <StudioPage title="Settings" description="Studio preferences.">
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-title font-semibold tracking-tight">Theme</p>
              <p className="text-caption text-muted-foreground">
                System, light, or dark — applied across the portfolio.
              </p>
            </div>
            <ThemeSelect />
          </div>
        </CardContent>
      </Card>
    </StudioPage>
  );
}
