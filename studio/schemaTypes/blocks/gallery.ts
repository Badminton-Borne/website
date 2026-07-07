import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

/** "De club in actie" — fotogalerij met slider op mobiel. */
export const gallery = defineType({
  name: 'gallery',
  title: 'Fotogalerij',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: "Foto's",
      type: 'array',
      of: [
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
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'eyebrow', media: 'images.0'},
    prepare({title, media}) {
      return {title: title || 'Fotogalerij', subtitle: 'Fotogalerij', media}
    },
  },
})
