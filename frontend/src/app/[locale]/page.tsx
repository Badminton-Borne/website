import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getHomePage, getSiteSettings } from "@/sanity/content";
import { SectionRenderer } from "@/components/home/SectionRenderer";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const [home, settings] = await Promise.all([
    getHomePage({ stega: false }),
    getSiteSettings({ stega: false }),
  ]);

  const title =
    home.seo?.title ?? settings.defaultSeo?.title ?? "Badminton Borne";
  const description =
    home.seo?.description ?? settings.defaultSeo?.description ?? undefined;
  const ogImage =
    home.seo?.ogImage?.asset?.url ?? settings.defaultSeo?.ogImage?.asset?.url;

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

/** JSON-LD voor de vereniging + FAQ (rich results). */
function buildJsonLd(
  home: Awaited<ReturnType<typeof getHomePage>>,
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
) {
  const graph: object[] = [
    {
      "@type": "SportsClub",
      name: "Badminton Vereniging Borne",
      sport: "Badminton",
      ...(settings.email ? { email: settings.email } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Borne",
        addressCountry: "NL",
      },
    },
  ];

  const faq = home.sections?.find((s) => s._type === "faqList");
  if (faq && faq._type === "faqList" && (faq.items?.length ?? 0) > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.items!.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [home, settings] = await Promise.all([
    getHomePage(),
    getSiteSettings({ stega: false }),
  ]);

  return (
    <article>
      <SectionRenderer sections={home.sections ?? []} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(home, settings)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
    </article>
  );
}
