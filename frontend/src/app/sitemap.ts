import type { MetadataRoute } from "next";

import { getPublicContent } from "@/lib/cms/public";
import { siteConfig } from "@/lib/site";

/** Sitemap from CMS content — always excludes /studio. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, seo } = await getPublicContent();

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: seo.canonical.length > 0 ? seo.canonical : siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...projectPages,
  ];
}
