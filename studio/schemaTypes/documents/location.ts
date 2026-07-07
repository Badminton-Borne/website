import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'

export const location = defineType({
  name: 'location',
  title: 'Locatie',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      description: "Bv. 't Wooldrik Hal B (nieuwe sporthal)",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'street',
      title: 'Straat + huisnummer',
      description: "Bv. 't Wooldrik 1",
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'Plaats',
      type: 'string',
      initialValue: 'Borne',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps-link (optioneel)',
      description: 'Leeg = automatisch zoeken op naam + adres',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'name', street: 'street', city: 'city'},
    prepare({title, street, city}) {
      return {
        title: title || 'Locatie',
        subtitle: [street, city].filter(Boolean).join(', '),
      }
    },
  },
})
