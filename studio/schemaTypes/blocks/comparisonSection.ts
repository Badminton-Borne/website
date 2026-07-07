import {defineArrayMember, defineField, defineType} from 'sanity'
import {SortIcon} from '@sanity/icons'

export const comparisonSection = defineType({
  name: 'comparisonSection',
  title: 'Vergelijkingstabel',
  type: 'object',
  icon: SortIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Badminton vs andere sporten',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Waarom badminton wint',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Kolommen (sporten)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comparisonColumn',
          title: 'Kolom',
          fields: [
            defineField({
              name: 'label',
              title: 'Sportnaam',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'highlighted',
              title: 'Uitgelicht (lime kolom)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'label', highlighted: 'highlighted'},
            prepare({title, highlighted}) {
              return {title: `${title}${highlighted ? ' ★' : ''}`}
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(2).custom((columns) => {
          const highlighted = (columns ?? []).filter(
            (col) => (col as {highlighted?: boolean}).highlighted,
          ).length
          return highlighted > 1 ? 'Licht maximaal één kolom uit' : true
        }),
    }),
    defineField({
      name: 'rows',
      title: 'Rijen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comparisonRow',
          title: 'Rij',
          fields: [
            defineField({
              name: 'label',
              title: 'Rij-label',
              description: 'Bv. "Topsnelheid"',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'values',
              title: 'Waarden (één per kolom, in dezelfde volgorde)',
              description: '"✓" mag als waarde',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
          preview: {
            select: {title: 'label', values: 'values'},
            prepare({title, values}) {
              return {title, subtitle: (values ?? []).join(' · ')}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'footnote',
      title: 'Voetnoot',
      type: 'string',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knoptekst',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Knop-link',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Waarom badminton wint', subtitle: 'Vergelijkingstabel'}
    },
  },
})
