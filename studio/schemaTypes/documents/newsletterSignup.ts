import {defineField, defineType} from 'sanity'
import {AddUserIcon} from '@sanity/icons'

/**
 * Nieuwsbrief-aanmeldingen (via /api/newsletter) zolang er nog geen
 * maildienst (Laposta/Mailchimp) gekoppeld is. Geen publieke content.
 */
export const newsletterSignup = defineType({
  name: 'newsletterSignup',
  title: 'Nieuwsbrief-aanmelding',
  type: 'document',
  icon: AddUserIcon,
  readOnly: true,
  fields: [
    defineField({name: 'email', title: 'E-mail', type: 'string'}),
    defineField({name: 'submittedAt', title: 'Aangemeld op', type: 'datetime'}),
  ],
  preview: {
    select: {title: 'email', date: 'submittedAt'},
    prepare({title, date}) {
      return {
        title: title || 'Aanmelding',
        subtitle: date ? new Date(date).toLocaleString('nl-NL') : undefined,
      }
    },
  },
})
