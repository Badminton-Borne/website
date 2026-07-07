import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * Nieuws-preview (bv. op de homepage). Toont automatisch de nieuwste
 * nieuwsberichten; een uitgelicht artikel mag groter.
 */
export const newsSection = defineType({
  name: 'newsSection',
  title: 'Nieuws',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Nieuws',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Nieuws van de club',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link naar al het nieuws',
      type: 'cta',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Nieuws', subtitle: 'Nieuws-preview'}
    },
  },
})
