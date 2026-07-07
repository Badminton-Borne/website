import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import { stars } from "@/lib/format";
import type { TestimonialsSection as TestimonialsData } from "@/sanity/types";

export function TestimonialsSection({
  section,
}: {
  section: TestimonialsData;
}) {
  return (
    <section className="bg-navy-900 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 lg:gap-9 lg:px-20">
        <Reveal className="flex flex-col items-start gap-4">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
          {(section.reviews ?? []).map((review, index) => (
            <Reveal key={review._id} delay={index * 70}>
              <figure className="flex h-full flex-col gap-2.5 rounded-2xl border border-white/10 bg-navy-800 p-[22px] lg:gap-3.5 lg:rounded-[20px] lg:p-7">
                <span
                  aria-hidden="true"
                  className="text-[15px] tracking-[3px] text-lime-400 lg:text-base"
                >
                  {stars(review.rating)}
                </span>
                <span className="sr-only">
                  {review.rating ?? 5} van 5 sterren
                </span>
                <blockquote className="text-sm leading-relaxed text-white lg:text-[15px]">
                  “{review.quote}”
                </blockquote>
                <figcaption className="text-[13px] font-bold text-navy-300 lg:text-sm">
                  {review.name}
                  {review.role ? ` — ${review.role}` : ""}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
