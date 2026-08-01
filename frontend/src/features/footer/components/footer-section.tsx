import { Container } from "@/components/shared/container";
import type { FooterData } from "@/lib/cms/types";

/** Shared styling for footer links — quiet, brightens on hover. */
const FOOTER_LINK =
  "text-caption text-muted-foreground transition-colors rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Footer — the landing page's closing band.
 *
 * Renders the copyright (with the owner's name), optional contact links
 * (GitHub / LinkedIn / Email — each hidden when empty), the tagline, and a
 * footer note. All copy comes from the CMS footer entity. A server component:
 * no animation, no client bundle.
 */
export function FooterSection({ footer }: { footer: FooterData }) {
  const year = new Date().getFullYear();
  const hasLinks =
    footer.github.length > 0 || footer.linkedin.length > 0 || footer.email.length > 0;
  const hasText = footer.tagline.length > 0 || footer.note.length > 0;

  return (
    <footer className="border-border border-t">
      <Container className="flex flex-col gap-4 py-8 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {footer.copyright.length > 0 && (
            <p className="text-caption text-muted-foreground text-center sm:text-left">
              © {year} {footer.copyright}. All rights reserved.
            </p>
          )}

          {hasLinks && (
            <ul className="flex items-center gap-5">
              {footer.github.length > 0 && (
                <li>
                  <a href={footer.github} target="_blank" rel="noreferrer" className={FOOTER_LINK}>
                    GitHub
                  </a>
                </li>
              )}
              {footer.linkedin.length > 0 && (
                <li>
                  <a
                    href={footer.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={FOOTER_LINK}
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {footer.email.length > 0 && (
                <li>
                  <a href={`mailto:${footer.email}`} className={FOOTER_LINK}>
                    Email
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        {hasText && (
          <div className="flex flex-col items-center gap-1">
            {footer.tagline.length > 0 && (
              <p className="text-caption text-muted-foreground text-center">{footer.tagline}</p>
            )}
            {footer.note.length > 0 && (
              <p className="text-caption text-muted-foreground text-center">{footer.note}</p>
            )}
          </div>
        )}
      </Container>
    </footer>
  );
}
