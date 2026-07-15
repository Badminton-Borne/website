import { defineQuery } from "next-sanity";

const IMAGE_FIELDS = `alt, hotspot, crop, "asset": asset->{_id, url, metadata{lqip, dimensions}}`;

/**
 * Gedeelde sectie-projectie: homepage en subpagina's gebruiken hetzelfde
 * page-builder-systeem, dus ook dezelfde GROQ. (Door de interpolatie doet
 * typegen hier niets — de types staan handgeschreven in types.ts.)
 */
const SECTION_FIELDS = `
    _key,
    _type,
    _type == "hero" => {
      eyebrow,
      heading,
      tagline,
      primaryCta{label, href},
      secondaryCta{label, href},
      microcopy,
      videoUrl,
      videoPoster{${IMAGE_FIELDS}},
      rating{score, source, note}
    },
    _type == "featureGrid" => {
      eyebrow,
      heading,
      features[]{_key, title, description}
    },
    _type == "sportHighlight" => {
      eyebrow,
      heading,
      body,
      image{${IMAGE_FIELDS}},
      stats[]{_key, value, label},
      footnote
    },
    _type == "announcement" => {
      tag,
      heading,
      body,
      link{label, href},
      image{${IMAGE_FIELDS}}
    },
    _type == "audienceSegments" => {
      eyebrow,
      heading,
      segments[]{
        _key,
        title,
        description,
        link{label, href},
        image{${IMAGE_FIELDS}}
      }
    },
    _type == "ctaBanner" => {
      heading,
      cta{label, href},
      microcopy,
      theme,
      enableGame
    },
    _type == "trainingTimes" => {
      eyebrow,
      heading,
      link{label, href},
      "rows": *[_type == "trainingTime"] | order(order asc, group asc){
        _id, group, activity, day, startTime, endTime,
        location->{name, street, city, mapsUrl},
        override{enabled, note, day, startTime, endTime, location}
      }
    },
    _type == "gallery" => {
      eyebrow,
      images[]{_key, ${IMAGE_FIELDS}}
    },
    _type == "testimonials" => {
      eyebrow,
      heading,
      "reviews": reviews[]->{_id, quote, name, role, rating}
    },
    _type == "faqList" => {
      heading,
      "items": items[]->{_id, question, answer}
    },
    _type == "pricingSection" => {
      eyebrow,
      heading,
      intro,
      "packages": packages[]->{
        _id, title, description, price, priceSuffix, features,
        highlighted, highlightLabel, ctaLabel, ctaHref
      },
      footnote
    },
    _type == "teamSection" => {
      eyebrow,
      heading,
      "trainers": *[_type == "teamMember" && group == "trainer"] | order(sortOrder asc, name asc){
        _id, name, role, group, activeSince, bio,
        photo{${IMAGE_FIELDS}}
      },
      "board": *[_type == "teamMember" && group == "bestuur"] | order(sortOrder asc, name asc){
        _id, name, role, group, activeSince, bio,
        photo{${IMAGE_FIELDS}}
      }
    },
    _type == "honoraryMembersSection" => {
      eyebrow,
      heading,
      intro,
      "members": *[_type == "honoraryMember"] | order(sortOrder asc, memberSince asc){
        _id, name, memberSince, contribution,
        photo{${IMAGE_FIELDS}}
      }
    },
    _type == "contactSection" => {
      eyebrow,
      heading,
      intro,
      "settings": *[_id == "siteSettings"][0]{
        email, phone,
        socialLinks[]{_key, label, href}
      },
      "locations": *[_type == "location"] | order(sortOrder asc, name asc){
        _id, name, street, city, mapsUrl
      }
    },
    _type == "comparisonSection" => {
      eyebrow,
      heading,
      columns[]{_key, label, highlighted},
      rows[]{_key, label, values},
      footnote,
      ctaLabel,
      ctaLink
    },
    _type == "agendaSection" => {
      eyebrow,
      heading,
      link{label, href},
      "events": *[_type == "event" && date >= now()] | order(date asc)[0..2]{
        _id, title, description, date, ctaLabel, ctaLink, featured
      }
    },
    _type == "sponsorsSection" => {
      eyebrow,
      link{label, href},
      joinLabel,
      joinHref,
      "sponsors": *[_type == "sponsor"] | order(sortOrder asc, name asc){
        _id, name, url,
        logo{${IMAGE_FIELDS}}
      }
    },
    _type == "newsletterSection" => {
      heading,
      body,
      buttonLabel,
      note
    },
    _type == "newsSection" => {
      eyebrow,
      heading,
      link{label, href},
      "articles": *[_type == "newsArticle"] | order(publishedAt desc)[0..2]{
        _id, title, "slug": slug.current, publishedAt, excerpt, category, featured,
        coverImage{${IMAGE_FIELDS}}
      }
    }
`;

const SEO_FIELDS = `seo{title, description, ogImage{"asset": asset->{url}}}`;

export const HOME_QUERY = defineQuery(`*[_id == "homePage"][0]{
  title,
  "sections": sections[]{${SECTION_FIELDS}},
  ${SEO_FIELDS}
}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  intro,
  "sections": sections[]{${SECTION_FIELDS}},
  ${SEO_FIELDS}
}`);

export const PAGE_SLUGS_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)].slug.current`,
);

export const NEWS_LIST_QUERY = defineQuery(`*[_type == "newsArticle"] | order(publishedAt desc){
  _id, title, "slug": slug.current, publishedAt, excerpt, category, featured,
  coverImage{${IMAGE_FIELDS}}
}`);

export const NEWS_ARTICLE_QUERY = defineQuery(`*[_type == "newsArticle" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, publishedAt, excerpt, category, featured,
  coverImage{${IMAGE_FIELDS}},
  body[]{
    ...,
    _type == "image" => {${IMAGE_FIELDS}}
  }
}`);

export const NEWS_SLUGS_QUERY = defineQuery(
  `*[_type == "newsArticle" && defined(slug.current)].slug.current`,
);

export const SETTINGS_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  mainNav[]{_key, label, href},
  headerSecondaryCta{label, href},
  headerPrimaryCta{label, href},
  announcement{enabled, text, linkLabel, link},
  footerTagline,
  footerColumns[]{_key, title, links[]{_key, label, href}},
  contactTitle,
  "locations": *[_type == "location"] | order(sortOrder asc, name asc){
    _id, name, street, city, mapsUrl
  },
  email,
  phone,
  socialLinks[]{_key, label, href},
  legalLinks[]{_key, label, href},
  copyright,
  stickyBarCta{label, href},
  stickyBarMicrocopy,
  defaultSeo{title, description, ogImage{"asset": asset->{url}}}
}`);
