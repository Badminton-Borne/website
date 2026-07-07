import Link from "next/link";
import { SanityImg } from "@/components/ui/SanityImg";
import { formatNewsDate } from "@/lib/format";
import type { NewsCardData } from "@/sanity/types";

/**
 * Nieuwskaart — zelfde stramien als de teamkaart: navy-800, radius 20,
 * foto boven met lichte zoom op hover, hover-lift + lime rand.
 */
export function NewsCard({
  article,
  locale,
  large = false,
}: {
  article: NewsCardData;
  locale: string;
  large?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/nieuws/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-navy-800 transition-[transform,border-color] duration-200 ease-brand hover:-translate-y-1 hover:border-lime-400/40"
    >
      <div
        className={`overflow-hidden ${large ? "h-[240px] lg:h-[300px]" : "h-[200px]"}`}
      >
        <SanityImg
          image={article.coverImage}
          width={large ? 880 : 420}
          height={large ? 300 : 200}
          placeholderLabel={article.title ?? "Nieuwsfoto"}
          className="h-full w-full object-cover transition-transform duration-300 ease-brand group-hover:scale-[1.04]"
          sizes={
            large
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, 100vw"
          }
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
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
        <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-white lg:text-[19px]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-[15px] leading-normal text-navy-300">
            {article.excerpt}
          </p>
        )}
        <span className="mt-auto pt-1 text-[15px] font-bold text-lime-400 transition-colors group-hover:text-lime-300">
          Lees meer <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
