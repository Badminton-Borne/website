import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/links";
import { getNewsSlugs, getPageSlugs } from "@/sanity/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://badmintonborne.nl";

/** Absolute URL voor een locale-loos pad, met de prefixregels van localizeHref. */
function url(path: string) {
  return `${SITE_URL}${localizedPath(path, routing.defaultLocale)}`;
}

/**
 * Homepage + de Sanity-pagina's en nieuwsberichten. De site is NL-only en de
 * standaardtaal draait zonder prefix, dus de URL's zijn hier locale-loos.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, newsSlugs] = await Promise.all([
    getPageSlugs(),
    getNewsSlugs(),
  ]);

  const home = {
    url: url("/"),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  };

  const pages = pageSlugs.map((slug) => ({
    url: url(`/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newsIndex = {
    url: url("/nieuws"),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  };

  const news = newsSlugs.map((slug) => ({
    url: url(`/nieuws/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [home, ...pages, newsIndex, ...news];
}
