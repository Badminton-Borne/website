import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/fx/Reveal";
import type { ContactSection as ContactData } from "@/sanity/types";
import { ContactForm } from "./ContactForm";

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-lime-400">
        {label}
      </h3>
      {children}
    </div>
  );
}

/** Contact (artboard 4d): clubinfo links, formulierkaart rechts. */
export function ContactSection({ section }: { section: ContactData }) {
  const info = section.settings;

  return (
    <section className="bg-navy-950 py-14 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] items-start gap-10 px-5 lg:grid-cols-[1fr_1.15fr] lg:gap-[72px] lg:px-20">
        <Reveal className="flex flex-col items-start gap-5 lg:gap-[26px]">
          {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
          <h2 className="font-display text-h2 font-extrabold uppercase text-white">
            {section.heading}
          </h2>
          {section.intro && (
            <p className="max-w-[44ch] text-[15px] leading-relaxed text-navy-300 lg:text-[17px]">
              {section.intro}
            </p>
          )}
          <div className="flex w-full flex-col gap-[18px]">
            {info?.email && (
              <InfoBlock label="E-mail">
                <a
                  href={`mailto:${info.email}`}
                  className="text-base font-semibold text-white transition-colors hover:text-lime-400"
                >
                  {info.email}
                </a>
              </InfoBlock>
            )}
            {info?.addressLines && (
              <InfoBlock label="Locatie">
                <p className="whitespace-pre-line text-base leading-relaxed text-white">
                  {info.addressLines}
                </p>
              </InfoBlock>
            )}
            {info?.playTimes && (
              <InfoBlock label="Speelavonden">
                <p className="text-base leading-relaxed text-white">
                  {info.playTimes}
                </p>
              </InfoBlock>
            )}
            {(info?.socialLinks?.length ?? 0) > 0 && (
              <ul className="flex gap-4">
                {info!.socialLinks!.map(
                  (link) =>
                    link.label && (
                      <li key={link._key}>
                        <a
                          href={link.href ?? "#"}
                          className="text-sm font-semibold text-navy-300 transition-colors hover:text-lime-400"
                        >
                          {link.label}
                        </a>
                      </li>
                    ),
                )}
              </ul>
            )}
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
