import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { NewsCard } from "@/components/news/NewsCard";
import { localizeHref } from "@/lib/links";
import type { NewsSection as NewsData } from "@/sanity/types";

/**
 * Nieuws-preview: de 3 nieuwste artikelen. Een uitgelicht eerste artikel
 * wordt groter (2 kolommen breed) — zelfde kaart, grotere foto.
 */
export function NewsSection({
  section,
  locale,
}: {
  section: NewsData;
  locale: string;
}) {
  const articles = section.articles ?? [];
  if (articles.length === 0) return null;

  const firstIsLarge = Boolean(articles[0]?.featured);
  const link = section.link?.label ? (
    <Link
      href={localizeHref(section.link.href, locale)}
      className="text-[15px] font-bold text-lime-400 transition-colors hover:text-lime-300 lg:text-base"
    >
      {section.link.label} <span aria-hidden="true">→</span>
    </Link>
  ) : null;

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 lg:gap-9 lg:px-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col items-start gap-4">
            {section.eyebrow && (
              <Eyebrow className="max-lg:hidden">{section.eyebrow}</Eyebrow>
            )}
            <h2 className="font-display text-h2 font-extrabold uppercase text-white">
              {section.heading}
            </h2>
          </div>
          <div className="max-lg:hidden">{link}</div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal
              key={article._id}
              delay={index * 70}
              className={`h-full ${firstIsLarge && index === 0 ? "lg:col-span-2" : ""}`}
            >
              <NewsCard
                article={article}
                locale={locale}
                large={firstIsLarge && index === 0}
              />
            </Reveal>
          ))}
        </div>

        <div className="lg:hidden">{link}</div>
      </div>
    </section>
  );
}
