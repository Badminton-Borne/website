import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getNewsSlugs, getPageSlugs } from "@/sanity/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://badmintonborne.nl";

/**
 * Homepage per taal + de Sanity-pagina's en nieuwsberichten.
 * Nieuws is NL-only en staat daarom alleen onder /nl in de sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, newsSlugs] = await Promise.all([
    getPageSlugs(),
    getNewsSlugs(),
  ]);

  const homes = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  const pages = pageSlugs.map((slug) => ({
    url: `${SITE_URL}/${routing.defaultLocale}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newsIndex = {
    url: `${SITE_URL}/${routing.defaultLocale}/nieuws`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  };

  const news = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/${routing.defaultLocale}/nieuws/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...homes, ...pages, newsIndex, ...news];
}
