import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

/** Knop of tekstlink: label + interne route (bv. /trainingen) of externe URL. */
export const cta = defineType({
  name: 'cta',
  title: 'Knop / link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Tekst',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description: 'Interne route (bv. /trainingen) of volledige URL',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (value.startsWith('/') || value.startsWith('#')) return true
          if (/^https?:\/\//.test(value)) return true
          if (value.startsWith('mailto:') || value.startsWith('tel:')) return true
          return 'Gebruik een interne route (/pagina), volledige URL, mailto: of tel:'
        }),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
