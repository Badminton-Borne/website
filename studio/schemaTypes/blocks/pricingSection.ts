import {defineArrayMember, defineField, defineType} from 'sanity'
import {CreditCardIcon} from '@sanity/icons'

export const pricingSection = defineType({
  name: 'pricingSection',
  title: 'Lidmaatschappen',
  type: 'object',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Lidmaatschap',
    }),
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'string',
      initialValue: 'Kies je pakket',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'packages',
      title: 'Pakketten',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'membershipPackage'}],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'footnote',
      title: 'Voetnoot',
      description: 'Kleine regel onder de pakketten',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Kies je pakket', subtitle: 'Lidmaatschappen'}
    },
  },
})
