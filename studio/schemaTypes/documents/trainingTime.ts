import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

const TIME_REGEX = /^([01]?\d|2[0-3])[:.][0-5]\d$/

export const trainingTime = defineType({
  name: 'trainingTime',
  title: 'Trainingstijd',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'group',
      title: 'Groep',
      description: 'Bijvoorbeeld: Jeugd, Senioren',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activity',
      title: 'Activiteit',
      description: 'Optioneel — laat leeg als het niet uitmaakt',
      type: 'string',
      options: {
        list: [
          {title: 'Training', value: 'training'},
          {title: 'Vrij spelen', value: 'vrij spelen'},
        ],
        layout: 'radio',
      },
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
      description: 'Formaat: 19:00',
      validation: (rule) =>
        rule.required().regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 19:00'),
    }),
    defineField({
      name: 'endTime',
      title: 'Tot',
      type: 'string',
      description: 'Formaat: 20:00',
      validation: (rule) =>
        rule.required().regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 20:00'),
    }),
    defineField({
      name: 'location',
      title: 'Locatie',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'override',
      title: 'Aangepaste tijd/locatie',
      description:
        'Tijdelijk afwijkend schema (bv. vakantie of zaalwissel). Aanzetten toont de afwijkende gegevens op de site, met een "Aangepast"-label.',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'enabled',
          title: 'Actief',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'note',
          title: 'Toelichting',
          description: 'Bv. "t/m 28 augustus" of "tijdens de vakantie"',
          type: 'string',
        }),
        defineField({
          name: 'day',
          title: 'Afwijkende dag',
          description: 'Leeg = dag blijft gelijk',
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
        }),
        defineField({
          name: 'startTime',
          title: 'Afwijkend van',
          description: 'Leeg = tijd blijft gelijk',
          type: 'string',
          validation: (rule) =>
            rule.regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 19:00'),
        }),
        defineField({
          name: 'endTime',
          title: 'Afwijkend tot',
          type: 'string',
          validation: (rule) =>
            rule.regex(TIME_REGEX).error('Gebruik het formaat UU:MM, bv. 20:00'),
        }),
        defineField({
          name: 'location',
          title: 'Afwijkende locatie',
          description: 'Vrije tekst (bv. "Gymzaal De Vonder"); leeg = locatie blijft gelijk',
          type: 'string',
        }),
      ],
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
    select: {
      title: 'group',
      activity: 'activity',
      day: 'day',
      start: 'startTime',
      end: 'endTime',
      location: 'location.name',
      overrideEnabled: 'override.enabled',
    },
    prepare({title, activity, day, start, end, location, overrideEnabled}) {
      return {
        title: [title, activity].filter(Boolean).join(' · ') || 'Trainingstijd',
        subtitle: [
          overrideEnabled ? '⚠ aangepast' : null,
          day,
          start && end ? `${start} – ${end}` : null,
          location,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
