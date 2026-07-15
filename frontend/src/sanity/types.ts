/**
 * Handgeschreven types voor de GROQ-queryresultaten (zie queries.ts).
 * Kan later vervangen worden door `npm run typegen` in studio/
 * (genereert frontend/src/sanity/types.generated.ts).
 */

export interface Cta {
  label?: string | null;
  href?: string | null;
}

export interface SanityImage {
  alt?: string | null;
  hotspot?: { x: number; y: number } | null;
  crop?: unknown;
  asset?: {
    _id: string;
    url: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      } | null;
    } | null;
  } | null;
}

export interface HeroSection {
  _type: "hero";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  tagline?: string | null;
  primaryCta?: Cta | null;
  secondaryCta?: Cta | null;
  microcopy?: string | null;
  videoUrl?: string | null;
  videoPoster?: SanityImage | null;
  rating?: {
    score?: number | null;
    source?: string | null;
    note?: string | null;
  } | null;
}

export interface FeatureGridSection {
  _type: "featureGrid";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  features?: Array<{
    _key: string;
    title?: string | null;
    description?: string | null;
  }> | null;
}

export interface SportHighlightSection {
  _type: "sportHighlight";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  image?: SanityImage | null;
  stats?: Array<{
    _key: string;
    value?: string | null;
    label?: string | null;
  }> | null;
  footnote?: string | null;
}

export interface AnnouncementSection {
  _type: "announcement";
  _key: string;
  tag?: string | null;
  heading?: string | null;
  body?: string | null;
  link?: Cta | null;
  image?: SanityImage | null;
}

export interface AudienceSegmentsSection {
  _type: "audienceSegments";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  segments?: Array<{
    _key: string;
    title?: string | null;
    description?: string | null;
    link?: Cta | null;
    image?: SanityImage | null;
  }> | null;
}

export interface CtaBannerSection {
  _type: "ctaBanner";
  _key: string;
  heading?: string | null;
  cta?: Cta | null;
  microcopy?: string | null;
  theme?: "lime" | "navy" | null;
  enableGame?: boolean | null;
}

export interface TrainingLocation {
  name?: string | null;
  street?: string | null;
  city?: string | null;
  mapsUrl?: string | null;
}

export interface TrainingTimeRow {
  _id: string;
  group?: string | null;
  /** "training" of "vrij spelen" (optioneel) */
  activity?: string | null;
  day?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: TrainingLocation | null;
  /** Tijdelijk afwijkend schema — lege velden vallen terug op het gewone rooster. */
  override?: {
    enabled?: boolean | null;
    note?: string | null;
    day?: string | null;
    startTime?: string | null;
    endTime?: string | null;
    /** Vrije tekst voor eenmalige uitwijklocaties. */
    location?: string | null;
  } | null;
}

export interface TrainingTimesSection {
  _type: "trainingTimes";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  link?: Cta | null;
  rows?: TrainingTimeRow[] | null;
}

export interface GallerySection {
  _type: "gallery";
  _key: string;
  eyebrow?: string | null;
  images?: Array<SanityImage & { _key: string }> | null;
}

export interface Review {
  _id: string;
  quote?: string | null;
  name?: string | null;
  role?: string | null;
  rating?: number | null;
}

export interface TestimonialsSection {
  _type: "testimonials";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  reviews?: Review[] | null;
}

export interface FaqItem {
  _id: string;
  question?: string | null;
  answer?: string | null;
}

export interface FaqListSection {
  _type: "faqList";
  _key: string;
  heading?: string | null;
  items?: FaqItem[] | null;
}

/* ---- Componenten-handoff (artboards 4a–4f, 5a) ------------------------- */

export interface MembershipPackage {
  _id: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  priceSuffix?: string | null;
  features?: string[] | null;
  highlighted?: boolean | null;
  highlightLabel?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export interface PricingSection {
  _type: "pricingSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  packages?: MembershipPackage[] | null;
  footnote?: string | null;
}

export interface TeamMemberCard {
  _id: string;
  name?: string | null;
  role?: string | null;
  group?: string | null;
  /** Jaartal waarin dit teamlid begon — de site rekent er "X jaar ervaring" van uit. */
  activeSince?: number | null;
  photo?: SanityImage | null;
  bio?: string | null;
}

export interface TeamSection {
  _type: "teamSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  trainers?: TeamMemberCard[] | null;
  board?: TeamMemberCard[] | null;
}

export interface HonoraryMemberCard {
  _id: string;
  name?: string | null;
  memberSince?: number | null;
  photo?: SanityImage | null;
  contribution?: string | null;
}

export interface HonoraryMembersSection {
  _type: "honoraryMembersSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  members?: HonoraryMemberCard[] | null;
}

export interface ContactSection {
  _type: "contactSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  /** Clubinfo uit siteSettings — zelfde bron als de footer. */
  settings?: {
    email?: string | null;
    addressLines?: string | null;
    playTimes?: string | null;
    socialLinks?: Array<Cta & { _key: string }> | null;
  } | null;
}

export interface ComparisonSection {
  _type: "comparisonSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  columns?: Array<{
    _key: string;
    label?: string | null;
    highlighted?: boolean | null;
  }> | null;
  rows?: Array<{
    _key: string;
    label?: string | null;
    values?: string[] | null;
  }> | null;
  footnote?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
}

export interface AgendaEvent {
  _id: string;
  title?: string | null;
  description?: string | null;
  date?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
  featured?: boolean | null;
}

export interface AgendaSection {
  _type: "agendaSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  link?: Cta | null;
  events?: AgendaEvent[] | null;
}

export interface SponsorItem {
  _id: string;
  name?: string | null;
  url?: string | null;
  logo?: SanityImage | null;
}

export interface SponsorsSection {
  _type: "sponsorsSection";
  _key: string;
  eyebrow?: string | null;
  link?: Cta | null;
  joinLabel?: string | null;
  joinHref?: string | null;
  sponsors?: SponsorItem[] | null;
}

export interface NewsletterSection {
  _type: "newsletterSection";
  _key: string;
  heading?: string | null;
  body?: string | null;
  buttonLabel?: string | null;
  note?: string | null;
}

export interface NewsCardData {
  _id: string;
  title?: string | null;
  slug?: string | null;
  publishedAt?: string | null;
  excerpt?: string | null;
  category?: string | null;
  featured?: boolean | null;
  coverImage?: SanityImage | null;
}

export interface NewsSection {
  _type: "newsSection";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  link?: Cta | null;
  articles?: NewsCardData[] | null;
}

export type PageSection =
  | HeroSection
  | FeatureGridSection
  | SportHighlightSection
  | AnnouncementSection
  | AudienceSegmentsSection
  | CtaBannerSection
  | TrainingTimesSection
  | GallerySection
  | TestimonialsSection
  | FaqListSection
  | PricingSection
  | TeamSection
  | HonoraryMembersSection
  | ContactSection
  | ComparisonSection
  | AgendaSection
  | SponsorsSection
  | NewsletterSection
  | NewsSection;

/** Historische alias — homepage en subpagina's delen één sectiesysteem. */
export type HomeSection = PageSection;

export interface Seo {
  title?: string | null;
  description?: string | null;
  ogImage?: { asset?: { url: string | null } | null } | null;
}

export interface HomePageData {
  title?: string | null;
  sections?: HomeSection[] | null;
  seo?: Seo | null;
}

/** Subpagina uit de page-builder (document "page"). */
export interface PageData {
  _id?: string;
  title?: string | null;
  slug?: string | null;
  intro?: string | null;
  sections?: PageSection[] | null;
  seo?: Seo | null;
}

/** Volledig nieuwsbericht voor de detailpagina. Nieuws is NL-only. */
export interface NewsArticleData extends NewsCardData {
  body?: Array<{ _type: string; _key: string; [key: string]: unknown }> | null;
}

export interface FooterColumn {
  _key: string;
  title?: string | null;
  links?: Array<Cta & { _key: string }> | null;
}

export interface AnnouncementBarData {
  enabled?: boolean | null;
  text?: string | null;
  linkLabel?: string | null;
  link?: string | null;
}

export interface SiteSettingsData {
  mainNav?: Array<Cta & { _key: string }> | null;
  headerSecondaryCta?: Cta | null;
  headerPrimaryCta?: Cta | null;
  announcement?: AnnouncementBarData | null;
  playTimes?: string | null;
  footerTagline?: string | null;
  footerColumns?: FooterColumn[] | null;
  contactTitle?: string | null;
  addressLines?: string | null;
  email?: string | null;
  socialLinks?: Array<Cta & { _key: string }> | null;
  legalLinks?: Array<Cta & { _key: string }> | null;
  copyright?: string | null;
  stickyBarCta?: Cta | null;
  stickyBarMicrocopy?: string | null;
  defaultSeo?: Seo | null;
}
