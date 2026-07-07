import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'media', title: 'Video'},
    {name: 'proof', title: 'Social proof'},
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Klein label boven de kop, bv. "Badminton in Borne"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Subregel',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primaire knop',
      type: 'cta',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secundaire knop',
      type: 'cta',
      group: 'content',
    }),
    defineField({
      name: 'microcopy',
      title: 'Microcopy onder de knoppen',
      description: 'Bv. "1 maand gratis · geen verplichtingen · maandelijks opzegbaar"',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video-URL',
      description: 'MP4-bestand; speelt automatisch, zonder geluid, in een loop',
      type: 'url',
      group: 'media',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video-poster',
      description: 'Stilstaand beeld dat toont terwijl de video laadt',
      type: 'image',
      group: 'media',
      fields: [
        defineField({name: 'alt', title: 'Alt-tekst', type: 'string'}),
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Beoordeling',
      type: 'object',
      group: 'proof',
      fields: [
        defineField({
          name: 'score',
          title: 'Score',
          type: 'number',
          description: 'Bv. 4.8',
          validation: (rule) => rule.min(0).max(5),
        }),
        defineField({
          name: 'source',
          title: 'Bron',
          type: 'string',
          description: 'Bv. "op Google"',
        }),
        defineField({
          name: 'note',
          title: 'Extra tekst',
          type: 'string',
          description: 'Bv. "Alle leeftijden en niveaus"',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Hero', subtitle: 'Hero'}
    },
  },
})
