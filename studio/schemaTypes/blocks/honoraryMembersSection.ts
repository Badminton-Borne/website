import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

/**
 * Ere-leden (voor de "Over ons"-pagina). De kaarten komen automatisch
 * uit de losse "Erelid"-documenten, gesorteerd op volgorde.
 */
export const honoraryMembersSection = defineType({
  name: 'honoraryMembersSection',
  title: 'Ere-leden',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Ere-leden',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'De legendes van de club',
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
      return {title: title || 'De legendes van de club', subtitle: 'Ere-leden'}
    },
  },
})
