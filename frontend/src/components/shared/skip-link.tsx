/**
 * Skip link — the first focusable element on every page.
 *
 * Lets keyboard users jump straight to the main content, bypassing the
 * navigation. Visible only on focus.
 */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="bg-primary text-primary-foreground focus:z-skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
    >
      Skip to content
    </a>
  );
}
