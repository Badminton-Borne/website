import { isSanityConfigured } from "./env";
import { client } from "./client";
import { sanityFetch } from "./live";
import {
  HOME_QUERY,
  NEWS_ARTICLE_QUERY,
  NEWS_LIST_QUERY,
  NEWS_SLUGS_QUERY,
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  SETTINGS_QUERY,
} from "./queries";
import {
  HOME_FALLBACK,
  NEWS_FALLBACK,
  NEWS_LIST_FALLBACK,
  PAGE_FALLBACKS,
  SETTINGS_FALLBACK,
} from "./defaults";
import type {
  HomePageData,
  NewsArticleData,
  NewsCardData,
  PageData,
  SiteSettingsData,
} from "./types";

interface FetchOptions {
  stega?: boolean;
}

/** Homepage-content uit Sanity, met de designcontent als fallback. */
export async function getHomePage(
  options: FetchOptions = {},
): Promise<HomePageData> {
  if (!isSanityConfigured) return HOME_FALLBACK;
  try {
    const { data } = await sanityFetch({
      query: HOME_QUERY,
      ...(options.stega === false ? { stega: false } : {}),
    });
    return (data as HomePageData | null) ?? HOME_FALLBACK;
  } catch (error) {
    console.error("Sanity homePage fetch mislukt, fallback actief:", error);
    return HOME_FALLBACK;
  }
}

/**
 * Subpagina (page-builder) op slug. Zonder Sanity-koppeling vallen we terug
 * op de demo-pagina's met de designcontent; mét koppeling is het CMS leidend
 * (onbekende slug → null → 404).
 */
export async function getPage(
  slug: string,
  options: FetchOptions = {},
): Promise<PageData | null> {
  if (!isSanityConfigured) return PAGE_FALLBACKS[slug] ?? null;
  try {
    const { data } = await sanityFetch({
      query: PAGE_QUERY,
      params: { slug },
      ...(options.stega === false ? { stega: false } : {}),
    });
    return (data as PageData | null) ?? null;
  } catch (error) {
    console.error(`Sanity page fetch mislukt voor /${slug}:`, error);
    return PAGE_FALLBACKS[slug] ?? null;
  }
}

/**
 * Alle pagina-slugs (voor generateStaticParams en de sitemap).
 * Bewust via de kale client: generateStaticParams draait buiten de
 * request-scope waar de live sanityFetch van afhangt.
 */
export async function getPageSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return Object.keys(PAGE_FALLBACKS);
  try {
    const data = await client.fetch<string[]>(PAGE_SLUGS_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Sanity page-slugs fetch mislukt:", error);
    return [];
  }
}

/** Alle nieuwsberichten, nieuwste eerst. Nieuws is NL-only. */
export async function getNewsList(
  options: FetchOptions = {},
): Promise<NewsCardData[]> {
  if (!isSanityConfigured) return NEWS_LIST_FALLBACK;
  try {
    const { data } = await sanityFetch({
      query: NEWS_LIST_QUERY,
      ...(options.stega === false ? { stega: false } : {}),
    });
    return (data as NewsCardData[] | null) ?? [];
  } catch (error) {
    console.error("Sanity nieuws fetch mislukt, fallback actief:", error);
    return NEWS_LIST_FALLBACK;
  }
}

/** Eén nieuwsbericht op slug (detailpagina). */
export async function getNewsArticle(
  slug: string,
  options: FetchOptions = {},
): Promise<NewsArticleData | null> {
  if (!isSanityConfigured)
    return NEWS_FALLBACK.find((article) => article.slug === slug) ?? null;
  try {
    const { data } = await sanityFetch({
      query: NEWS_ARTICLE_QUERY,
      params: { slug },
      ...(options.stega === false ? { stega: false } : {}),
    });
    return (data as NewsArticleData | null) ?? null;
  } catch (error) {
    console.error(`Sanity nieuwsartikel fetch mislukt voor ${slug}:`, error);
    return NEWS_FALLBACK.find((article) => article.slug === slug) ?? null;
  }
}

/** Alle nieuws-slugs (voor generateStaticParams en de sitemap), via de kale client. */
export async function getNewsSlugs(): Promise<string[]> {
  if (!isSanityConfigured)
    return NEWS_FALLBACK.map((article) => article.slug!).filter(Boolean);
  try {
    const data = await client.fetch<string[]>(NEWS_SLUGS_QUERY);
    return data ?? [];
  } catch (error) {
    console.error("Sanity nieuws-slugs fetch mislukt:", error);
    return [];
  }
}

/** Site-instellingen (header/footer/sticky balk) met fallback. */
export async function getSiteSettings(
  options: FetchOptions = {},
): Promise<SiteSettingsData> {
  if (!isSanityConfigured) return SETTINGS_FALLBACK;
  try {
    const { data } = await sanityFetch({
      query: SETTINGS_QUERY,
      ...(options.stega === false ? { stega: false } : {}),
    });
    return (data as SiteSettingsData | null) ?? SETTINGS_FALLBACK;
  } catch (error) {
    console.error("Sanity siteSettings fetch mislukt, fallback actief:", error);
    return SETTINGS_FALLBACK;
  }
}
