import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

/**
 * Agenda-preview. De rijen komen automatisch uit de eerstvolgende
 * "Agenda-item"-documenten (op datum).
 */
export const agendaSection = defineType({
  name: 'agendaSection',
  title: 'Agenda',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Agenda',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Binnenkort bij Borne',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link naar de hele agenda',
      type: 'cta',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Binnenkort bij Borne', subtitle: 'Agenda'}
    },
  },
})
