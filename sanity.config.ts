import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const homepageSelectionDocumentId = '57a09b5e-b3f8-4f4d-927d-b21bb0abb08b'

export default defineConfig({
  name: 'default',
  title: 'Vishnu Lal Archive',

  projectId: '2gtua40d',
  dataset: 'staging',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== 'homepageSelection'),
  },

  document: {
    actions: (actions, context) => {
      if (context.schemaType !== 'homepageSelection') {
        return actions
      }

      const documentId = context.documentId?.replace(/^drafts\./, '')

      return documentId === homepageSelectionDocumentId
        ? actions.filter(
            (action) => !['delete', 'duplicate', 'unpublish'].includes(action.action || ''),
          )
        : actions.filter((action) => action.action !== 'duplicate')
    },
  },
})
