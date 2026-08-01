/**
 * Global site configuration shared across metadata, sitemap, and robots.
 */
export const siteConfig = {
  name: "PortfolioOS",
  description: "Production-grade engineering portfolio and CMS.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
