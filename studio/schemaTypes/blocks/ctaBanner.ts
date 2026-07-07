import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

/** Conversieband ("Kom een keer langs") en afsluitende CTA ("Klaar voor je eerste smash?"). */
export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA-band',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Kop',
      type: 'text',
      rows: 2,
      description: 'Een regeleinde in dit veld wordt ook op de site een regeleinde',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'cta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'microcopy',
      title: 'Microcopy onder de knop',
      type: 'string',
    }),
    defineField({
      name: 'theme',
      title: 'Kleurthema',
      type: 'string',
      options: {
        list: [
          {title: 'Lime (opvallende band)', value: 'lime'},
          {title: 'Navy (donker)', value: 'navy'},
        ],
        layout: 'radio',
      },
      initialValue: 'lime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enableGame',
      title: 'Shuttle-minigame actief in deze sectie',
      description: 'Racket-cursor + overvliegende shuttles (alleen desktop)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'heading', theme: 'theme'},
    prepare({title, theme}) {
      return {
        title: (title || 'CTA-band').split('\n')[0],
        subtitle: `CTA-band · ${theme === 'navy' ? 'navy' : 'lime'}`,
      }
    },
  },
})
