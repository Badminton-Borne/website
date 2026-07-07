import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Aanleveren als witte/lichte variant (staat op donkere tegel)',
      type: 'image',
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
      name: 'url',
      title: 'Website',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
    select: {title: 'name', media: 'logo'},
  },
})
