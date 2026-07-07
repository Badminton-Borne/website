import type { PageSection } from "@/sanity/types";
import { HeroSection } from "./HeroSection";
import { FeatureGridSection } from "./FeatureGridSection";
import { SportHighlightSection } from "./SportHighlightSection";
import { AnnouncementSection } from "./AnnouncementSection";
import { AudienceSegmentsSection } from "./AudienceSegmentsSection";
import { CtaBannerSection } from "./CtaBannerSection";
import { TrainingTimesSection } from "./TrainingTimesSection";
import { GallerySection } from "./GallerySection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FaqSection } from "./FaqSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { HonoraryMembersSection } from "@/components/sections/HonoraryMembersSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { AgendaSection } from "@/components/sections/AgendaSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { NewsSection } from "@/components/sections/NewsSection";

/** Rendert de CMS-secties (page builder) in de door de redactie gekozen volgorde. */
export function SectionRenderer({
  sections,
  locale,
}: {
  sections: PageSection[];
  locale: string;
}) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "hero":
            return (
              <HeroSection key={section._key} section={section} locale={locale} />
            );
          case "featureGrid":
            return <FeatureGridSection key={section._key} section={section} />;
          case "sportHighlight":
            return <SportHighlightSection key={section._key} section={section} />;
          case "announcement":
            return (
              <AnnouncementSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "audienceSegments":
            return (
              <AudienceSegmentsSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "ctaBanner":
            return (
              <CtaBannerSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "trainingTimes":
            return (
              <TrainingTimesSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "gallery":
            return <GallerySection key={section._key} section={section} />;
          case "testimonials":
            return <TestimonialsSection key={section._key} section={section} />;
          case "faqList":
            return <FaqSection key={section._key} section={section} />;
          case "pricingSection":
            return (
              <PricingSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "teamSection":
            return <TeamSection key={section._key} section={section} />;
          case "honoraryMembersSection":
            return (
              <HonoraryMembersSection key={section._key} section={section} />
            );
          case "contactSection":
            return <ContactSection key={section._key} section={section} />;
          case "comparisonSection":
            return (
              <ComparisonSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "agendaSection":
            return (
              <AgendaSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "sponsorsSection":
            return (
              <SponsorsSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          case "newsletterSection":
            return <NewsletterSection key={section._key} section={section} />;
          case "newsSection":
            return (
              <NewsSection
                key={section._key}
                section={section}
                locale={locale}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
