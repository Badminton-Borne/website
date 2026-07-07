import {defineField, defineType} from 'sanity'
import {CreditCardIcon} from '@sanity/icons'

export const membershipPackage = defineType({
  name: 'membershipPackage',
  title: 'Lidmaatschapspakket',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Naam',
      description: 'Bv. "Jeugd", "Recreatief", "Competitie"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Omschrijving',
      description: 'Eén korte zin onder de naam',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Prijs (€)',
      description: 'Alleen het bedrag, bv. 48',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'priceSuffix',
      title: 'Prijs-toevoeging',
      type: 'string',
      initialValue: 'per kwartaal',
    }),
    defineField({
      name: 'features',
      title: 'Inbegrepen (lijst met vinkjes)',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'highlighted',
      title: 'Uitgelicht ("Meest gekozen")',
      description: 'Lime rand + tag. Zet dit bij maximaal één pakket aan.',
      type: 'boolean',
      initialValue: false,
      validation: (rule) =>
        rule.custom(async (value, context) => {
          if (!value) return true
          const client = context.getClient({apiVersion: '2026-02-01'})
          const id = context.document?._id?.replace(/^drafts\./, '')
          const others = await client.fetch<number>(
            `count(*[_type == "membershipPackage" && highlighted == true && !(_id in [$id, "drafts." + $id])])`,
            {id: id ?? ''},
          )
          return others > 0
            ? {message: 'Er is al een ander pakket uitgelicht — meestal wil je er maar één.'}
            : true
        }).warning(),
    }),
    defineField({
      name: 'highlightLabel',
      title: 'Tag-tekst bij uitgelicht',
      type: 'string',
      initialValue: 'Meest gekozen',
      hidden: ({document}) => !document?.highlighted,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Knoptekst',
      type: 'string',
      initialValue: 'Kies dit pakket',
    }),
    defineField({
      name: 'ctaHref',
      title: 'Knop-link',
      description: 'Waar de knop naartoe gaat, bv. /lid-worden',
      type: 'string',
      initialValue: '/lid-worden',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Volgorde',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Volgorde',
      name: 'sortOrder',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', price: 'price', suffix: 'priceSuffix', highlighted: 'highlighted'},
    prepare({title, price, suffix, highlighted}) {
      return {
        title: `${title ?? 'Pakket'}${highlighted ? ' ★' : ''}`,
        subtitle: price != null ? `€${price} ${suffix ?? ''}` : undefined,
      }
    },
  },
})
