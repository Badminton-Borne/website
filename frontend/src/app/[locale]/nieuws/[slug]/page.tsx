import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PortableText } from "next-sanity";
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBannerSection } from "@/components/home/CtaBannerSection";
import { AccentBar } from "@/components/ui/AccentBar";
import { SanityImg } from "@/components/ui/SanityImg";
import { formatNewsDate } from "@/lib/format";
import { getNewsArticle, getNewsSlugs } from "@/sanity/content";
import { hasImage } from "@/sanity/image";
import type { CtaBannerSection as CtaBannerData, SanityImage } from "@/sanity/types";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsArticle(slug, { stega: false });
  if (!article) return { title: "Nieuws" };

  const ogImage = article.coverImage?.asset?.url;
  return {
    title: article.title ?? "Nieuws",
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title ?? "Nieuws",
      description: article.excerpt ?? undefined,
      type: "article",
      locale,
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

/** Vast fotokader uit het designsysteem: radius 20, hairline, accentlijn eronder. */
function FramedImage({
  image,
  width,
  label,
}: {
  image: SanityImage | null | undefined;
  width: number;
  label?: string;
}) {
  const aspectRatio = image?.asset?.metadata?.dimensions?.aspectRatio ?? 16 / 9;
  const height = Math.round(width / aspectRatio);
  return (
    <figure className="flex flex-col gap-3.5">
      <div className="overflow-hidden rounded-[20px] border border-white/12">
        <SanityImg
          image={image}
          width={width}
          height={height}
          placeholderLabel={label}
          className="h-auto w-full object-cover"
          sizes="(min-width: 1024px) 880px, 100vw"
        />
      </div>
      <AccentBar />
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-2xl font-extrabold uppercase tracking-tight text-white first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-xl font-extrabold uppercase tracking-tight text-white first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-lime-400 pl-5 text-lg font-semibold text-white">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-lg leading-[1.7] text-white/90">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-6 text-lg leading-[1.7] text-white/90 marker:text-lime-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 pl-6 text-lg leading-[1.7] text-white/90 marker:text-lime-400">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={(value as { href?: string })?.href ?? "#"}
        className="font-semibold text-lime-400 underline underline-offset-2 transition-colors hover:text-lime-300"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <FramedImage image={value as SanityImage} width={720} label="Foto bij artikel" />
    ),
  },
};

function buildJsonLd(
  article: NonNullable<Awaited<ReturnType<typeof getNewsArticle>>>,
  locale: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://badmintonborne.nl";
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    ...(article.excerpt ? { description: article.excerpt } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.coverImage?.asset?.url
      ? { image: [article.coverImage.asset.url] }
      : {}),
    mainEntityOfPage: `${siteUrl}/${locale}/nieuws/${article.slug}`,
    author: { "@type": "Organization", name: "Badminton Vereniging Borne" },
    publisher: { "@type": "Organization", name: "Badminton Vereniging Borne" },
  };
}

export default async function NieuwsArtikelPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getNewsArticle(slug);
  if (!article) notFound();

  // De lime conversie-band van de homepage — sectie herbruikbaar
  const ctaBand: CtaBannerData = {
    _type: "ctaBanner",
    _key: "news-cta-band",
    heading: "Kom een keer langs.\nDe eerste maand is gratis.",
    cta: { label: "Plan je eerste bezoek", href: "/probeer-gratis" },
    microcopy: "1 maand gratis · geen verplichtingen · maandelijks opzegbaar",
    theme: "lime",
    enableGame: false,
  };

  return (
    <article className="bg-navy-950">
      <PageHero
        title={article.title ?? "Nieuws"}
        crumbs={[
          { label: "Home", href: `/${locale}` },
          { label: "Nieuws", href: `/${locale}/nieuws` },
          { label: article.title ?? "Artikel" },
        ]}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            {article.category && (
              <span className="rounded-full bg-lime-400 px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-wide text-navy-900">
                {article.category}
              </span>
            )}
            {article.publishedAt && (
              <time
                dateTime={article.publishedAt}
                className="text-[13px] text-navy-400"
              >
                {formatNewsDate(article.publishedAt)}
              </time>
            )}
          </div>
        }
      />

      <div className="mx-auto flex max-w-[880px] flex-col gap-10 px-5 py-12 lg:px-10 lg:py-16">
        {hasImage(article.coverImage) && (
          <FramedImage
            image={article.coverImage}
            width={880}
            label={article.title ?? "Nieuwsfoto"}
          />
        )}

        {article.body && (
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
            <PortableText
              value={article.body as unknown as PortableTextBlock[]}
              components={portableTextComponents}
            />
          </div>
        )}

        <div className="mx-auto w-full max-w-[720px]">
          <Link
            href={`/${locale}/nieuws`}
            className="text-[15px] font-bold text-lime-400 transition-colors hover:text-lime-300"
          >
            <span aria-hidden="true">←</span> Al het nieuws
          </Link>
        </div>
      </div>

      <CtaBannerSection section={ctaBand} locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(article, locale)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
    </article>
  );
}
