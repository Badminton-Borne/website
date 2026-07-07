import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

/**
 * Sponsorband. De logo's komen automatisch uit de losse
 * "Sponsor"-documenten (op volgorde). De laatste tegel is altijd de
 * "Jouw logo hier?"-uitnodiging.
 */
export const sponsorsSection = defineType({
  name: 'sponsorsSection',
  title: 'Sponsors',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Onze sponsors',
    }),
    defineField({
      name: 'link',
      title: 'Link rechtsboven',
      description: 'Bv. "Ook sponsor worden? →"',
      type: 'cta',
    }),
    defineField({
      name: 'joinLabel',
      title: 'Tekst laatste tegel',
      type: 'string',
      initialValue: 'Jouw logo hier?',
    }),
    defineField({
      name: 'joinHref',
      title: 'Link laatste tegel',
      description: 'Naar de sponsorpagina of het contactformulier',
      type: 'string',
      initialValue: '/contact',
    }),
  ],
  preview: {
    select: {title: 'eyebrow'},
    prepare({title}) {
      return {title: title || 'Onze sponsors', subtitle: 'Sponsors'}
    },
  },
})
