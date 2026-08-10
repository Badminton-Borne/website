import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://badmintonborne.nl";

export const metadata: Metadata = {
  // Basis voor relatieve metadata-URL's (o.a. alternates.canonical per pagina).
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Badminton Borne",
    template: "%s | Badminton Borne",
  },
  description:
    "Badmintonvereniging in Borne voor alle leeftijden en niveaus. Eerste maand gratis proberen!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
