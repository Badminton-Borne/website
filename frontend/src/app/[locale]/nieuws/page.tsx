import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { stegaClean } from "next-sanity";
import { PageHero } from "@/components/site/PageHero";
import { NewsCard } from "@/components/news/NewsCard";
import { Reveal } from "@/components/fx/Reveal";
import { getNewsList } from "@/sanity/content";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categorie?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Nieuws",
    description:
      "Al het nieuws van Badminton Borne: clubnieuws, competitie, jeugd en evenementen.",
    openGraph: {
      title: "Nieuws — Badminton Borne",
      description:
        "Al het nieuws van Badminton Borne: clubnieuws, competitie, jeugd en evenementen.",
      type: "website",
      locale,
    },
  };
}

/** Nieuwsoverzicht (NL-only content) met categorie-filter als pill-chips. */
export default async function NieuwsPage({ params, searchParams }: PageProps) {
  const [{ locale }, { categorie }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const articles = await getNewsList();
  const categories = Array.from(
    new Set(
      articles
        .map((article) => stegaClean(article.category))
        .filter((category): category is string => Boolean(category)),
    ),
  );
  const activeCategory =
    categorie && categories.includes(categorie) ? categorie : null;
  const filtered = activeCategory
    ? articles.filter(
        (article) => stegaClean(article.category) === activeCategory,
      )
    : articles;

  const chipBase =
    "rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200";

  return (
    <article className="bg-navy-950">
      <PageHero
        title="Nieuws"
        intro="Clubnieuws, competitie, jeugd en evenementen — alles wat er speelt bij Borne."
        crumbs={[{ label: "Home", href: `/${locale}` }, { label: "Nieuws" }]}
      />

      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-14 lg:px-20 lg:py-20">
        {categories.length > 0 && (
          <nav aria-label="Categorieën">
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <Link
                  href={`/${locale}/nieuws`}
                  className={`${chipBase} ${
                    activeCategory === null
                      ? "bg-lime-400 text-navy-900"
                      : "border border-white/16 bg-navy-800 text-white hover:border-lime-400/50"
                  }`}
                  aria-current={activeCategory === null ? "true" : undefined}
                >
                  Alle
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/${locale}/nieuws?categorie=${encodeURIComponent(category)}`}
                    className={`${chipBase} ${
                      activeCategory === category
                        ? "bg-lime-400 text-navy-900"
                        : "border border-white/16 bg-navy-800 text-white hover:border-lime-400/50"
                    }`}
                    aria-current={activeCategory === category ? "true" : undefined}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, index) => (
              <Reveal key={article._id} delay={index * 60} className="h-full">
                <NewsCard article={article} locale={locale} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[15px] text-navy-300">
            Nog geen nieuws in deze categorie — kom snel terug!
          </p>
        )}
      </div>
    </article>
  );
}
