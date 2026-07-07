import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

/** "Wat leden zeggen" — gekozen reviews uit de review-documenten. */
export const testimonials = defineType({
  name: 'testimonials',
  title: 'Reviews',
  type: 'object',
  icon: StarIcon,
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
      name: 'reviews',
      title: 'Reviews',
      description: 'Kies welke reviews op de homepage staan',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'review'}],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Reviews', subtitle: 'Reviews'}
    },
  },
})
