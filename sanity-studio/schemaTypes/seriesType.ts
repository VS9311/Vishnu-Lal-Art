import {defineField, defineType, getPublishedId} from 'sanity'

const seriesCodeFromTitle = (title: string) =>
  title
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const seriesType = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  orderings: [
    {
      title: 'Series number',
      name: 'seriesNumberAsc',
      by: [{field: 'seriesNumber', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Series title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seriesNumber',
      title: 'Series number',
      type: 'number',
      description: 'Controls the website order and address. Use 1 for Series I, 2 for Series II, and so on.',
      validation: (rule) =>
        rule.required().integer().min(1).custom(async (seriesNumber, context) => {
          if (!seriesNumber) return true
          const documentId = context.document?._id
          if (!documentId) return true
          const duplicate = await context
            .getClient({apiVersion: '2026-11-07'})
            .fetch(
              '*[_type == "series" && seriesNumber == $seriesNumber && !sanity::versionOf($publishedId)][0]._id',
              {seriesNumber, publishedId: getPublishedId(documentId)},
            )
          return duplicate ? 'Another series already uses this number.' : true
        }),
    }),
    defineField({
      name: 'titleMalayalam',
      title: 'Malayalam title',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Series code',
      type: 'slug',
      description:
        'Use Generate to create a stable code from the series title. You can edit the result before publishing.',
      options: {
        source: 'title',
        slugify: seriesCodeFromTitle,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Series summary',
      type: 'text',
      rows: 8,
      description: 'This shared summary is used for every artwork in the series.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      malayalam: 'titleMalayalam',
      code: 'code.current',
      seriesNumber: 'seriesNumber',
    },
    prepare({title, malayalam, code, seriesNumber}) {
      return {
        title: malayalam || title,
        subtitle: [`Series ${seriesNumber || '—'}`, title, code].filter(Boolean).join(' · '),
      }
    },
  },
})
