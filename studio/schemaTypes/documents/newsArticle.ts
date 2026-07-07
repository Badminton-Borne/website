import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * Nieuws is uitsluitend Nederlands: geen taalvelden, geen vertaalworkflow
 * (afspraak uit het componenten-handoff).
 */
export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'Nieuwsbericht',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Kort & krachtig',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicatiedatum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Samenvatting',
      description: '1–2 zinnen — voor kaarten en de meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200).warning('Houd de samenvatting kort (max ±200 tekens)'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Coverfoto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Artikel',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt-tekst',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: ['Club', 'Competitie', 'Jeugd', 'Evenement'],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Uitgelicht',
      description: 'Uitgelichte artikelen mogen groter op de homepage-sectie',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Nieuwste eerst',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedAt', media: 'coverImage', category: 'category'},
    prepare({title, date, media, category}) {
      return {
        title: title || 'Nieuwsbericht',
        subtitle: [
          category,
          date
            ? new Date(date).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : null,
        ]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
