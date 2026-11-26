import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * 301-redirects van de oude site (badmintonverenigingborne.nl) naar de nieuwe
 * slugs. De domeinwissel zelf (oud domein → badmintonborne.nl, pad behouden)
 * regel je in Vercel; deze redirects vangen de drie paden die van naam zijn
 * veranderd. `/`, `/lid-worden` en `/competitie` blijven gelijk en hoeven hier
 * dus niet. statusCode 301 (i.p.v. permanent: true → 308) omdat dat de klassieke
 * "permanent verplaatst"-code is die zoekmachines verwachten.
 */
const LEGACY_REDIRECTS: NextConfig["redirects"] = async () => [
  { source: "/wie-zijn-wij", destination: "/badminton", statusCode: 301 },
  { source: "/spelen", destination: "/tijden", statusCode: 301 },
  { source: "/activiteiten", destination: "/nieuws", statusCode: 301 },
  // De pagina "Tijden" heette eerst "Trainingen" (/trainingen); vangnet voor
  // bestaande links naar de oude slug.
  { source: "/trainingen", destination: "/tijden", statusCode: 301 },
  // /lidmaatschap was een weespagina: geen enkele interne link wees erheen en
  // de prijstabel stond ook al op /lid-worden. Samengevoegd naar /lid-worden,
  // dat het stappenplan, de FAQ en de aanmeldknop heeft.
  { source: "/lidmaatschap", destination: "/lid-worden", statusCode: 301 },
];

const nextConfig: NextConfig = {
  redirects: LEGACY_REDIRECTS,
  images: {
    // Let op: geen `search` opnemen — een `new URL(...)` heeft altijd een
    // (lege) search, en Next eist dan een URL zónder query-parameters.
    // Sanity-afbeeldingen hebben juist altijd query-parameters (?rect=&w=…),
    // waardoor élke afbeelding 400 gaf. Objectvorm zonder `search` staat
    // alle query-parameters toe.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
