import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const honoraryMember = defineType({
  name: 'honoraryMember',
  title: 'Erelid',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'memberSince',
      title: 'Erelid sinds (jaartal)',
      description: 'Bv. 1998 → "Erelid sinds 1998"',
      type: 'number',
      validation: (rule) => rule.min(1900).max(2100).integer(),
    }),
    defineField({
      name: 'photo',
      title: 'Portret',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'contribution',
      title: 'Verdienste (één zin)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Volgorde',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Volgorde',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', since: 'memberSince', media: 'photo'},
    prepare({title, since, media}) {
      return {
        title: title || 'Erelid',
        subtitle: since ? `Erelid sinds ${since}` : undefined,
        media,
      }
    },
  },
})
