import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Subpagina met page-builder: de redactie bepaalt per pagina welke secties
 * er staan en in welke volgorde. De pagina krijgt automatisch de subpagina-
 * hero (breadcrumb + H1 + intro) uit titel en intro.
 */
export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Inhoud', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Paginatitel',
      description: 'Wordt de H1 in de pagina-hero en de breadcrumb',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      description: 'Korte introductie onder de paginatitel (optioneel)',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Secties',
      description: 'Sleep om de volgorde te wijzigen',
      type: 'array',
      group: 'content',
      of: [
        // Nieuwe secties (componenten-handoff)
        defineArrayMember({type: 'pricingSection'}),
        defineArrayMember({type: 'teamSection'}),
        defineArrayMember({type: 'honoraryMembersSection'}),
        defineArrayMember({type: 'contactSection'}),
        defineArrayMember({type: 'comparisonSection'}),
        defineArrayMember({type: 'agendaSection'}),
        defineArrayMember({type: 'sponsorsSection'}),
        defineArrayMember({type: 'newsletterSection'}),
        defineArrayMember({type: 'newsSection'}),
        // Homepage-secties — één systeem, overal inzetbaar
        defineArrayMember({type: 'hero'}),
        defineArrayMember({type: 'featureGrid'}),
        defineArrayMember({type: 'sportHighlight'}),
        defineArrayMember({type: 'announcement'}),
        defineArrayMember({type: 'audienceSegments'}),
        defineArrayMember({type: 'ctaBanner'}),
        defineArrayMember({type: 'trainingTimes'}),
        defineArrayMember({type: 'gallery'}),
        defineArrayMember({type: 'testimonials'}),
        defineArrayMember({type: 'faqList'}),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO-titel',
          type: 'string',
          validation: (rule) => rule.max(60).warning('Houd de titel onder de 60 tekens'),
        }),
        defineField({
          name: 'description',
          title: 'SEO-omschrijving',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(160).warning('Houd de omschrijving onder de 160 tekens'),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social share-afbeelding',
          type: 'image',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {title: title || 'Pagina', subtitle: slug ? `/${slug}` : undefined}
    },
  },
})
