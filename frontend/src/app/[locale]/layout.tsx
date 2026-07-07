import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Hanken_Grotesk, Unbounded } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileStickyBar } from "@/components/site/MobileStickyBar";
import { getSiteSettings } from "@/sanity/content";
import { isSanityConfigured } from "@/sanity/env";
import { SanityLive } from "@/sanity/live";
import "../globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-unbounded",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hanken",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opt into static rendering: without this, next-intl reads the locale from
  // request headers and forces every route under [locale] into dynamic SSR.
  setRequestLocale(locale);

  const messages = await getMessages();
  const settings = await getSiteSettings();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${unbounded.variable} ${hankenGrotesk.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <a href="#main-content" className="skip-link">
          {locale === "ar"
            ? "انتقل إلى المحتوى"
            : locale === "en"
              ? "Skip to content"
              : "Ga naar inhoud"}
        </a>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader settings={settings} locale={locale} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter settings={settings} locale={locale} />
          <MobileStickyBar settings={settings} locale={locale} />
        </NextIntlClientProvider>
        {isSanityConfigured && <SanityLive />}
      </body>
    </html>
  );
}
