import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
