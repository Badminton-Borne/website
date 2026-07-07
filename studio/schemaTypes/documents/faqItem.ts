import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Veelgestelde vraag',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Vraag',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Antwoord',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})
