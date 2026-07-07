import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Agenda-item',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Omschrijving',
      description: 'Eén of twee korte zinnen',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knoptekst',
      description: 'Bv. "Doe mee", "Programma". Leeg = geen knop.',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Knop-link',
      type: 'string',
    }),
    defineField({
      name: 'featured',
      title: 'Aanmeld-event (lime knop)',
      description: 'Open/aanmeld-events krijgen de primaire (lime) knop',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Datum (eerstvolgende eerst)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'date'},
    prepare({title, date}) {
      return {
        title: title || 'Agenda-item',
        subtitle: date
          ? new Date(date).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : undefined,
      }
    },
  },
})
