import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Nieuwsbrief',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Mis geen smash',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
      description: 'Eén zin over wat je ontvangt',
      type: 'string',
      initialValue: 'Eén mailtje per maand over toernooien, de nieuwe hal en clubnieuws.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Knoptekst',
      type: 'string',
      initialValue: 'Aanmelden',
    }),
    defineField({
      name: 'note',
      title: 'Regel onder het veld',
      type: 'string',
      initialValue: 'Uitschrijven kan altijd met één klik.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Mis geen smash', subtitle: 'Nieuwsbrief'}
    },
  },
})
