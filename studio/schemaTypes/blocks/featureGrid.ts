import {defineArrayMember, defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons'

/** "Waarom Badminton Borne" — genummerde USP-kaarten. */
export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'USP-kaarten',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Kaarten',
      description: 'De nummers (01, 02, …) worden automatisch toegevoegd',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          title: 'Kaart',
          fields: [
            defineField({
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Tekst',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'description'},
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'USP-kaarten', subtitle: 'USP-kaarten'}
    },
  },
})
