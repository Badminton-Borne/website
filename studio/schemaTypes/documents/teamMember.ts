import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Teamlid',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol',
      description: 'Bv. "Voorzitter", "Hoofdtrainer"',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'group',
      title: 'Groep',
      type: 'string',
      options: {
        list: [
          {title: 'Trainer', value: 'trainer'},
          {title: 'Bestuur', value: 'bestuur'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Jaren ervaring',
      description: 'Wordt de chip "X jaar ervaring" op de foto. Leeg = geen chip.',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
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
      name: 'bio',
      title: 'Bio (één regel)',
      description: 'Optioneel — in het design alleen bij trainers',
      type: 'string',
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
      by: [
        {field: 'group', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo', group: 'group'},
    prepare({title, subtitle, media, group}) {
      return {
        title: title || 'Teamlid',
        subtitle: [subtitle, group === 'trainer' ? 'Trainer' : 'Bestuur']
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
