import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

const TIME_REGEX = /^([01]?\d|2[0-3]):[0-5]\d$/

export const trainingTime = defineType({
  name: 'trainingTime',
  title: 'Trainingstijd',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'group',
      title: 'Groep',
      description: 'Bijvoorbeeld: Jeugd, Recreanten, Competitie',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'day',
      title: 'Dag',
      type: 'string',
      options: {
        list: [
          {title: 'Maandag', value: 'maandag'},
          {title: 'Dinsdag', value: 'dinsdag'},
          {title: 'Woensdag', value: 'woensdag'},
          {title: 'Donderdag', value: 'donderdag'},
          {title: 'Vrijdag', value: 'vrijdag'},
          {title: 'Zaterdag', value: 'zaterdag'},
          {title: 'Zondag', value: 'zondag'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Van',
      type: 'string',
      description: 'Formaat: 18:30',
      validation: (rule) =>
        rule.required().regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 18:30'),
    }),
    defineField({
      name: 'endTime',
      title: 'Tot',
      type: 'string',
      description: 'Formaat: 19:45',
      validation: (rule) =>
        rule.required().regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 19:45'),
    }),
    defineField({
      name: 'order',
      title: 'Volgorde',
      type: 'number',
      description: 'Laag nummer komt eerst',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Volgorde',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'group', day: 'day', start: 'startTime', end: 'endTime'},
    prepare({title, day, start, end}) {
      return {
        title: title || 'Trainingstijd',
        subtitle: [day, start && end ? `${start} – ${end}` : null].filter(Boolean).join(' · '),
      }
    },
  },
})
