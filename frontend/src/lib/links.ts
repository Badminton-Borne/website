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
