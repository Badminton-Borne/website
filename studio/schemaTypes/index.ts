import {cta} from './objects/cta'
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {siteSettings} from './documents/siteSettings'
import {trainingTime} from './documents/trainingTime'
import {location} from './documents/location'
import {review} from './documents/review'
import {faqItem} from './documents/faqItem'
import {membershipPackage} from './documents/membershipPackage'
import {teamMember} from './documents/teamMember'
import {honoraryMember} from './documents/honoraryMember'
import {event} from './documents/event'
import {sponsor} from './documents/sponsor'
import {newsArticle} from './documents/newsArticle'
import {contactSubmission} from './documents/contactSubmission'
import {newsletterSignup} from './documents/newsletterSignup'
import {hero} from './blocks/hero'
import {featureGrid} from './blocks/featureGrid'
import {sportHighlight} from './blocks/sportHighlight'
import {announcement} from './blocks/announcement'
import {audienceSegments} from './blocks/audienceSegments'
import {ctaBanner} from './blocks/ctaBanner'
import {trainingTimes} from './blocks/trainingTimes'
import {gallery} from './blocks/gallery'
import {testimonials} from './blocks/testimonials'
import {faqList} from './blocks/faqList'
import {pricingSection} from './blocks/pricingSection'
import {teamSection} from './blocks/teamSection'
import {honoraryMembersSection} from './blocks/honoraryMembersSection'
import {contactSection} from './blocks/contactSection'
import {comparisonSection} from './blocks/comparisonSection'
import {agendaSection} from './blocks/agendaSection'
import {sponsorsSection} from './blocks/sponsorsSection'
import {newsletterSection} from './blocks/newsletterSection'
import {newsSection} from './blocks/newsSection'

export const schemaTypes = [
  // Objects
  cta,
  // Blocks (homepage-handoff)
  hero,
  featureGrid,
  sportHighlight,
  announcement,
  audienceSegments,
  ctaBanner,
  trainingTimes,
  gallery,
  testimonials,
  faqList,
  // Blocks (componenten-handoff 4a–4f, 5a)
  pricingSection,
  teamSection,
  honoraryMembersSection,
  contactSection,
  comparisonSection,
  agendaSection,
  sponsorsSection,
  newsletterSection,
  newsSection,
  // Documents
  homePage,
  page,
  siteSettings,
  trainingTime,
  location,
  review,
  faqItem,
  membershipPackage,
  teamMember,
  honoraryMember,
  event,
  sponsor,
  newsArticle,
  // Inzendingen (privé)
  contactSubmission,
  newsletterSignup,
]
