import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { Geist, Geist_Mono } from "next/font/google";

import { Cursor } from "@/components/shared/cursor";
import { SkipLink } from "@/components/shared/skip-link";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { getPublicContent } from "@/lib/cms/public";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Site metadata from CMS content — SEO entity with profile fallbacks. */
export async function generateMetadata(): Promise<Metadata> {
  const { profile, seo } = await getPublicContent();

  const siteName = profile.name.length > 0 ? profile.name : siteConfig.name;
  const fallbackTitle = profile.role.length > 0 ? `${profile.name} — ${profile.role}` : siteName;
  const title = seo.title.length > 0 ? seo.title : fallbackTitle;
  const fallbackDescription = profile.tagline.length > 0 ? profile.tagline : siteConfig.description;
  const description = seo.description.length > 0 ? seo.description : fallbackDescription;
  const ogTitle = seo.ogTitle.length > 0 ? seo.ogTitle : title;
  const ogDescription = seo.ogDescription.length > 0 ? seo.ogDescription : description;
  const socialImage = seo.siteImage.length > 0 ? [seo.siteImage] : undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description,
    keywords: [...seo.keywords, profile.role, profile.location, siteConfig.name].filter(Boolean),
    applicationName: siteConfig.name,
    authors: [{ name: siteName, url: siteConfig.url }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: seo.canonical.length > 0 ? seo.canonical : "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName,
      title: ogTitle,
      description: ogDescription,
      images: socialImage,
    },
    twitter: {
      card: seo.twitterCard as "summary" | "summary_large_image" | "app" | "player",
      title: ogTitle,
      description: ogDescription,
      images: socialImage,
    },
    icons: seo.favicon.length > 0 ? { icon: seo.favicon } : undefined,
    robots: seo.robots.length > 0 ? seo.robots : undefined,
  };
}

/** JSON-LD structured data — Person + WebSite, using only available values. */
async function StructuredData() {
  const { profile } = await getPublicContent();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role.length > 0 ? profile.role : undefined,
      url: siteConfig.url,
      email: profile.email.length > 0 ? profile.email : undefined,
      address:
        profile.location.length > 0
          ? { "@type": "PostalAddress", addressLocality: profile.location }
          : undefined,
      sameAs: [profile.github, profile.linkedin].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ].map((entry) =>
    Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== undefined))
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <StructuredData />
        <SkipLink />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Let every framer-motion animation respect reduced motion. */}
          <MotionConfig reducedMotion="user">
            {children}
            <Cursor />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
