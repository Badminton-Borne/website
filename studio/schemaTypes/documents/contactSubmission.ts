import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Inzendingen van het contactformulier (via /api/contact).
 * Géén publieke content — alleen zichtbaar in de Studio.
 */
export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Contact-inzending',
  type: 'document',
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({name: 'name', title: 'Naam', type: 'string'}),
    defineField({name: 'email', title: 'E-mail', type: 'string'}),
    defineField({name: 'subject', title: 'Onderwerp', type: 'string'}),
    defineField({name: 'message', title: 'Bericht', type: 'text', rows: 5}),
    defineField({name: 'submittedAt', title: 'Verstuurd op', type: 'datetime'}),
  ],
  preview: {
    select: {title: 'name', subject: 'subject', date: 'submittedAt'},
    prepare({title, subject, date}) {
      return {
        title: [title, subject].filter(Boolean).join(' — ') || 'Inzending',
        subtitle: date ? new Date(date).toLocaleString('nl-NL') : undefined,
      }
    },
  },
})
