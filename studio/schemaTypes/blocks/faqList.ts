import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

/** "Veelgestelde vragen" — accordeon met gekozen FAQ-documenten. */
export const faqList = defineType({
  name: 'faqList',
  title: 'Veelgestelde vragen',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Vragen',
      description: 'Kies welke vragen op de homepage staan (de eerste staat open)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'faqItem'}],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Veelgestelde vragen', subtitle: 'FAQ'}
    },
  },
})
