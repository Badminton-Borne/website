import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'jouw-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Documenttypes die als singleton via de structure worden beheerd:
// geen "nieuw document"-optie en niet dupliceerbaar.
const SINGLETON_TYPES = new Set(['homePage', 'siteSettings'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Badminton Borne',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
      // "Nieuw document" in de SEO-lijsten zet de paginagroep alvast goed
      {
        id: 'page-buurt',
        title: 'SEO-pagina · Badminton in de buurt',
        schemaType: 'page',
        value: {pageGroup: 'buurt'},
      },
      {
        id: 'page-vergelijking',
        title: 'SEO-pagina · Badminton vs sporten',
        schemaType: 'page',
        value: {pageGroup: 'vergelijking'},
      },
    ],
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : input,
  },
})
