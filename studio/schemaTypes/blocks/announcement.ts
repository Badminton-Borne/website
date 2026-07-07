import {defineField, defineType} from 'sanity'
import {BellIcon} from '@sanity/icons'

/** "Splinternieuwe sporthal" — aankondigingsband met tag, tekst en foto. */
export const announcement = defineType({
  name: 'announcement',
  title: 'Aankondiging',
  type: 'object',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'tag',
      title: 'Tag',
      type: 'string',
      description: 'Bv. "Nieuw"',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'link',
      title: 'Tekstlink',
      type: 'cta',
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      description: 'Dronefoto of render van de nieuwe hal',
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
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Aankondiging', subtitle: 'Aankondiging', media}
    },
  },
})
