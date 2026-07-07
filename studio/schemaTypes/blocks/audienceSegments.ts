import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/** "Waar sta jij?" — doelgroepkaarten die naar eigen pagina's linken. */
export const audienceSegments = defineType({
  name: 'audienceSegments',
  title: 'Doelgroepkaarten',
  type: 'object',
  icon: UsersIcon,
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
      name: 'segments',
      title: 'Kaarten',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'segment',
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
            defineField({
              name: 'link',
              title: 'Link',
              type: 'cta',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Foto (uitgeknipte persoon, PNG met transparante achtergrond)',
              description: 'Steekt boven de kaart uit',
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
          ],
          preview: {
            select: {title: 'title', subtitle: 'description', media: 'image'},
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Doelgroepkaarten', subtitle: 'Doelgroepkaarten'}
    },
  },
})
