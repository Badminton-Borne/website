import type {StructureResolver} from 'sanity/structure'
import {
  AddUserIcon,
  CalendarIcon,
  CaseIcon,
  CogIcon,
  CommentIcon,
  CreditCardIcon,
  DocumentIcon,
  DocumentsIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HelpCircleIcon,
  HomeIcon,
  PinIcon,
  SortIcon,
  StarIcon,
  UsersIcon,
} from '@sanity/icons'

const SINGLETONS = ['homePage', 'siteSettings']
const CURATED = [
  'page',
  'newsArticle',
  'event',
  'membershipPackage',
  'teamMember',
  'honoraryMember',
  'sponsor',
  'trainingTime',
  'location',
  'review',
  'faqItem',
  'contactSubmission',
  'newsletterSignup',
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Inhoud')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Homepage')),
      // Pagina's gegroepeerd op pageGroup, zodat de SEO-landingspagina's
      // ("Badminton in <plaats>", "Badminton vs <sport>") de gewone
      // pagina's niet ondersneeuwen.
      S.listItem()
        .title("Pagina's")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Pagina's")
            .items([
              S.listItem()
                .title("Gewone pagina's")
                .icon(DocumentIcon)
                .child(
                  S.documentList()
                    .title("Gewone pagina's")
                    .schemaType('page')
                    .filter('_type == "page" && (!defined(pageGroup) || pageGroup == "standaard")')
                    .apiVersion('2026-02-01'),
                ),
              S.listItem()
                .title('SEO · Badminton in de buurt')
                .icon(PinIcon)
                .child(
                  S.documentList()
                    .title('SEO · Badminton in de buurt')
                    .schemaType('page')
                    .filter('_type == "page" && pageGroup == "buurt"')
                    .apiVersion('2026-02-01')
                    .initialValueTemplates([S.initialValueTemplateItem('page-buurt')]),
                ),
              S.listItem()
                .title('SEO · Badminton vs sporten')
                .icon(SortIcon)
                .child(
                  S.documentList()
                    .title('SEO · Badminton vs sporten')
                    .schemaType('page')
                    .filter('_type == "page" && pageGroup == "vergelijking"')
                    .apiVersion('2026-02-01')
                    .initialValueTemplates([S.initialValueTemplateItem('page-vergelijking')]),
                ),
              S.divider(),
              S.documentTypeListItem('page').title("Alle pagina's").icon(DocumentsIcon),
            ]),
        ),
      S.listItem()
        .title('Site-instellingen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site-instellingen'),
        ),
      S.divider(),
      S.documentTypeListItem('newsArticle').title('Nieuws').icon(DocumentTextIcon),
      S.documentTypeListItem('event').title('Agenda').icon(CalendarIcon),
      S.divider(),
      S.documentTypeListItem('membershipPackage').title('Lidmaatschappen').icon(CreditCardIcon),
      S.documentTypeListItem('teamMember').title('Team').icon(UsersIcon),
      S.documentTypeListItem('honoraryMember').title('Ere-leden').icon(StarIcon),
      S.documentTypeListItem('sponsor').title('Sponsors').icon(CaseIcon),
      S.divider(),
      S.documentTypeListItem('trainingTime').title('Trainingstijden').icon(CalendarIcon),
      S.documentTypeListItem('location').title('Locaties').icon(PinIcon),
      S.documentTypeListItem('review').title('Reviews').icon(CommentIcon),
      S.documentTypeListItem('faqItem').title('Veelgestelde vragen').icon(HelpCircleIcon),
      S.divider(),
      S.documentTypeListItem('contactSubmission').title('Contact-inzendingen').icon(EnvelopeIcon),
      S.documentTypeListItem('newsletterSignup').title('Nieuwsbrief-aanmeldingen').icon(AddUserIcon),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return !SINGLETONS.includes(id as string) && !CURATED.includes(id as string)
      }),
    ])
