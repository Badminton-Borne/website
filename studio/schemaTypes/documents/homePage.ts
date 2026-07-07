import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Secties', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Interne titel',
      type: 'string',
      initialValue: 'Homepage',
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Taal',
      type: 'string',
      initialValue: 'nl',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'sections',
      title: 'Secties',
      description: 'Sleep om de volgorde van de homepage-secties te wijzigen',
      type: 'array',
      group: 'content',
      of: [
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
        // Componenten-handoff (artboards 4a–4f, 5a)
        defineArrayMember({type: 'pricingSection'}),
        defineArrayMember({type: 'teamSection'}),
        defineArrayMember({type: 'honoraryMembersSection'}),
        defineArrayMember({type: 'contactSection'}),
        defineArrayMember({type: 'comparisonSection'}),
        defineArrayMember({type: 'agendaSection'}),
        defineArrayMember({type: 'sponsorsSection'}),
        defineArrayMember({type: 'newsletterSection'}),
        defineArrayMember({type: 'newsSection'}),
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
          validation: (rule) =>
            rule.max(60).warning('Houd de titel onder de 60 tekens'),
        }),
        defineField({
          name: 'description',
          title: 'SEO-omschrijving',
          type: 'text',
          rows: 3,
          validation: (rule) =>
            rule.max(160).warning('Houd de omschrijving onder de 160 tekens'),
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
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Homepage'}
    },
  },
})
