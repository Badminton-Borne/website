"use client";

import { useId, useState } from "react";
import type { FaqListSection as FaqData } from "@/sanity/types";

/** Accordeon: eerste vraag staat open, lime +/− indicatoren, toetsenbord-toegankelijk. */
export function FaqSection({ section }: { section: FaqData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const items = section.items ?? [];

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto flex max-w-[880px] flex-col gap-5 px-5 lg:gap-9 lg:px-20">
        <h2 className="font-display text-h2 font-extrabold uppercase text-white">
          {section.heading}
        </h2>

        <div className="flex flex-col">
          {items.map((item, index) => {
            const open = openIndex === index;
            const headerId = `${baseId}-faq-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            return (
              <div
                key={item._id}
                className={`border-t border-white/10 ${
                  index === items.length - 1 ? "border-b" : ""
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left lg:py-[22px]"
                  >
                    <span className="text-[15px] font-bold text-white lg:text-[17px]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xl font-bold leading-none text-lime-400 lg:text-[22px]"
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-brand ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] px-1 pb-4 text-sm leading-relaxed text-mist-300 lg:pb-[22px] lg:text-[15px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
