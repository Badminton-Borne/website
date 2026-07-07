import type { Metadata } from "next";

export const metadata: Metadata = {
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
