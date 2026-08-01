import type { MetadataRoute } from "next";

import { getPublicContent } from "@/lib/cms/public";
import { siteConfig } from "@/lib/site";

/** Robots — Studio is always disallowed; sitemap respects the CMS setting. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getPublicContent();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio"],
      },
    ],
    sitemap: seo.sitemap ? `${siteConfig.url}/sitemap.xml` : undefined,
  };
}
