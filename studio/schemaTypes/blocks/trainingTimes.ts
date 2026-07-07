import {defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons'

/**
 * Trainingstijden-preview. De rijen komen automatisch uit de losse
 * "Trainingstijd"-documenten (gesorteerd op volgorde), zodat de tijden
 * op elke pagina hetzelfde zijn.
 */
export const trainingTimes = defineType({
  name: 'trainingTimes',
  title: 'Trainingstijden',
  type: 'object',
  icon: ClockIcon,
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
      name: 'link',
      title: 'Link naar alle tijden',
      type: 'cta',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Trainingstijden', subtitle: 'Trainingstijden'}
    },
  },
})
