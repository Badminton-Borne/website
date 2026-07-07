import {defineArrayMember, defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'

/** "Badminton is cool" — foto + tekst + statistieken. */
export const sportHighlight = defineType({
  name: 'sportHighlight',
  title: 'Sport-highlight (foto + stats)',
  type: 'object',
  icon: BoltIcon,
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
      name: 'body',
      title: 'Tekst',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      description: 'Actiefoto — smash of sprong, bevroren beweging',
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
      name: 'stats',
      title: 'Statistieken',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          title: 'Statistiek',
          fields: [
            defineField({
              name: 'value',
              title: 'Waarde',
              type: 'string',
              description: 'Bv. "±450" of "#1"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Bv. "kcal per uur*"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'footnote',
      title: 'Voetnoot',
      type: 'string',
      description: 'Bv. "*Cijfers checken vóór publicatie."',
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Sport-highlight', subtitle: 'Sport-highlight', media}
    },
  },
})
