import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      description: 'Bijvoorbeeld: recreant, ouder, competitie',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Aantal sterren',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'quote'},
  },
})
