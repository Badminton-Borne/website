import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site-instellingen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'header', title: 'Header', default: true},
    {name: 'announcement', title: 'Aankondigingsbalk'},
    {name: 'footer', title: 'Footer'},
    {name: 'mobile', title: 'Mobiele CTA-balk'},
    {name: 'seo', title: 'Standaard SEO'},
  ],
  fields: [
    // Aankondigingsbalk (sitewide, boven de header)
    defineField({
      name: 'announcement',
      title: 'Aankondigingsbalk',
      description: 'Lime balk boven de header, op alle pagina\'s',
      type: 'object',
      group: 'announcement',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Tonen',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'text',
          title: 'Tekst',
          type: 'string',
        }),
        defineField({
          name: 'linkLabel',
          title: 'Linktekst',
          type: 'string',
          initialValue: 'Lees meer',
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    // Header
    defineField({
      name: 'mainNav',
      title: 'Hoofdmenu',
      type: 'array',
      group: 'header',
      of: [defineArrayMember({type: 'cta'})],
    }),
    defineField({
      name: 'headerSecondaryCta',
      title: 'Secundaire header-knop',
      description: 'Bv. "Lid worden" (omlijnde knop)',
      type: 'cta',
      group: 'header',
    }),
    defineField({
      name: 'headerPrimaryCta',
      title: 'Primaire header-knop',
      description: 'Bv. "Plan je eerste bezoek" (lime knop)',
      type: 'cta',
      group: 'header',
    }),
    // Footer
    defineField({
      name: 'footerTagline',
      title: 'Footer-tagline',
      description: 'Bv. "Elke smash telt. Badminton voor heel Borne — …"',
      type: 'text',
      rows: 2,
      group: 'footer',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer-kolommen',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          title: 'Kolom',
          fields: [
            defineField({
              name: 'title',
              title: 'Kolomtitel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({type: 'cta'})],
            }),
          ],
          preview: {
            select: {title: 'title'},
          },
        }),
      ],
    }),
    defineField({
      name: 'contactTitle',
      title: 'Contact-koptekst',
      type: 'string',
      initialValue: 'Contact',
      group: 'footer',
    }),
    defineField({
      name: 'addressLines',
      title: 'Adres',
      description: 'Elke regel op een nieuwe regel',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      group: 'footer',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      description: 'Bv. "06 81 05 60 15" — getoond in de footer en op de contactpagina',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'cta'})],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Juridische links',
      description: 'Bv. Privacy, Sitemap',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'cta'})],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright-regel',
      description: 'Bv. "© 2026 Badminton Vereniging Borne"',
      type: 'string',
      group: 'footer',
    }),
    // Mobiele sticky balk
    defineField({
      name: 'stickyBarCta',
      title: 'Knop in mobiele sticky balk',
      type: 'cta',
      group: 'mobile',
    }),
    defineField({
      name: 'stickyBarMicrocopy',
      title: 'Microcopy in mobiele sticky balk',
      type: 'string',
      group: 'mobile',
    }),
    // SEO
    defineField({
      name: 'defaultSeo',
      title: 'Standaard SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({name: 'title', title: 'Standaard titel', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Standaard omschrijving',
          type: 'text',
          rows: 3,
        }),
        defineField({name: 'ogImage', title: 'Standaard share-afbeelding', type: 'image'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site-instellingen'}
    },
  },
})
