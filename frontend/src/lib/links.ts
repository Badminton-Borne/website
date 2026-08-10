import { routing } from "@/i18n/routing";

/**
 * CMS-links zijn locale-loos opgeslagen (bv. /tijden). Met
 * localePrefix: "as-needed" krijgt de standaardtaal (nl) géén prefix, andere
 * talen wél — zodat de NL-URL's niet wijzigen zodra er een taal bijkomt.
 * Externe URL's, anchors, bestanden, mailto: en tel: blijven ongemoeid.
 */
export function localizeHref(
  href: string | null | undefined,
  locale: string,
): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (!href) return prefix || "/";
  if (!href.startsWith("/")) return href;
  if (/\.[a-z0-9]+$/i.test(href)) return href;
  if (href === "/") return prefix || "/";
  return `${prefix}${href}`;
}

/**
 * Zelfde als localizeHref, maar bedoeld om achter een origin te plakken
 * (JSON-LD, sitemap): de homepage levert "" op i.p.v. "/", zodat er geen
 * dubbele of overbodige slash ontstaat.
 */
export function localizedPath(
  href: string | null | undefined,
  locale: string,
): string {
  const localized = localizeHref(href, locale);
  return localized === "/" ? "" : localized;
}

/**
 * Google Maps-link voor een locatie: een handmatige mapsUrl wint, anders
 * zoeken op naam + adres.
 */
export function mapsHref(location: {
  name?: string | null;
  street?: string | null;
  city?: string | null;
  mapsUrl?: string | null;
}): string {
  if (location.mapsUrl) return location.mapsUrl;
  const query = [location.name, location.street, location.city]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
