import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * Trainers & bestuur. De kaarten komen automatisch uit de losse
 * "Teamlid"-documenten, gegroepeerd op trainer/bestuur en gesorteerd
 * op volgorde.
 */
export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team (trainers & bestuur)',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Ons team',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Wie je op de baan tegenkomt',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Wie je op de baan tegenkomt', subtitle: 'Team'}
    },
  },
})
