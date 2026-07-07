import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Contactformulier met clubinfo. E-mail, adres, speelavonden en socials
 * komen uit de Site-instellingen (zelfde bron als de footer).
 */
export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contactformulier',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Stel je vraag',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Stel je vraag', subtitle: 'Contactformulier'}
    },
  },
})
