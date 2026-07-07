/**
 * CMS-links zijn locale-loos opgeslagen (bv. /trainingen). Interne routes
 * krijgen de actieve locale als prefix; externe URL's, anchors, bestanden,
 * mailto: en tel: blijven ongemoeid.
 */
export function localizeHref(
  href: string | null | undefined,
  locale: string,
): string {
  if (!href) return `/${locale}`;
  if (!href.startsWith("/")) return href;
  if (/\.[a-z0-9]+$/i.test(href)) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
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
