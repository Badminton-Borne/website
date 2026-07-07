import type {StructureResolver} from 'sanity/structure'
import {
  AddUserIcon,
  CalendarIcon,
  CaseIcon,
  CogIcon,
  CommentIcon,
  CreditCardIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HelpCircleIcon,
  HomeIcon,
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
      S.documentTypeListItem('page').title("Pagina's").icon(DocumentIcon),
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
