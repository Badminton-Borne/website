import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/site/PageHero";
import { SectionRenderer } from "@/components/home/SectionRenderer";
import { getPage, getPageSlugs, getSiteSettings } from "@/sanity/content";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const [page, settings] = await Promise.all([
    getPage(slug, { stega: false }),
    getSiteSettings({ stega: false }),
  ]);
  if (!page) return {};

  const title = page.seo?.title ?? page.title ?? settings.defaultSeo?.title ?? undefined;
  const description =
    page.seo?.description ?? page.intro ?? settings.defaultSeo?.description ?? undefined;
  const ogImage =
    page.seo?.ogImage?.asset?.url ?? settings.defaultSeo?.ogImage?.asset?.url;

  return {
    title,
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

function buildBreadcrumbJsonLd(title: string, slug: string, locale: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://badmintonborne.nl";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: title, item: `${siteUrl}/${locale}/${slug}` },
    ],
  };
}

/**
 * Subpagina uit de page-builder: PageHero (breadcrumb + titel + intro) en
 * daaronder de door de redactie gekozen secties.
 */
export default async function SubPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug);
  if (!page) notFound();

  const title = page.title ?? "Pagina";

  return (
    <article className="bg-navy-950">
      <PageHero
        title={title}
        intro={page.intro}
        crumbs={[{ label: "Home", href: `/${locale}` }, { label: title }]}
      />
      <SectionRenderer sections={page.sections ?? []} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(title, slug, locale)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
    </article>
  );
}
