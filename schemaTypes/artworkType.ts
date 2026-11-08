import {defineField, defineType, getPublishedId} from 'sanity'
import {SeriesReferenceInput} from '../SeriesReferenceInput'

const artworkIdPattern = /^(?:VL-[A-Z0-9]+|THUNDU)-[0-9]{3,}$/

const getSeriesFromStructurePath = () => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const match = decodeURIComponent(window.location.pathname).match(
    /(?:^|[;/])artwork-series-([^;/]+)/,
  )

  return match ? {_type: 'reference' as const, _ref: match[1]} : undefined
}

export const artworkType = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  initialValue: () => {
    const series = getSeriesFromStructurePath()

    return {
      status: 'unpublished',
      ...(series ? {series} : {}),
    }
  },
  fields: [
    defineField({
      name: 'artworkId',
      title: 'Artwork ID',
      type: 'string',
      description:
        'Permanent archive identifier. Use THUNDU-001 for the new system; historical VL-A-007 identifiers remain valid. Moving an artwork between series never changes this ID.',
      validation: (rule) =>
        rule
          .required()
          .uppercase()
          .regex(artworkIdPattern, {
            name: 'artwork ID',
            invert: false,
          })
          .error('Use THUNDU-001 for new artworks, or preserve an existing ID such as VL-A-007.')
          .custom(async (artworkId, context) => {
            const {document, getClient} = context

            if (!artworkId || !document) {
              return true
            }

            const client = getClient({apiVersion: '2026-09-03'})
            const isTaken = await client.fetch<boolean>(
              `defined(*[
                _type == "artwork" &&
                artworkId == $artworkId &&
                !sanity::versionOf($published)
              ][0]._id)`,
              {
                artworkId,
                published: getPublishedId(document._id),
              },
            )

            return isTaken ? `Artwork ID ${artworkId} is already in use.` : true
          }),
    }),
    defineField({
      name: 'image',
      title: 'Artwork image',
      type: 'image',
      description: 'Upload the approved highest-quality artwork image.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      description:
        'Choose an existing series or create a new one here. Changing this reference preserves the artwork ID and image.',
      to: [{type: 'series'}],
      components: {
        input: SeriesReferenceInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceUsd',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'unpublished',
      description:
        "Controls website visibility and sale status. This is separate from Sanity's document Publish button.",
      options: {
        layout: 'radio',
        list: [
          {title: 'Unpublished', value: 'unpublished'},
          {title: 'Published', value: 'published'},
          {title: 'Sold out', value: 'soldOut'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Artwork ID',
      name: 'artworkIdAsc',
      by: [{field: 'artworkId', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'artworkId',
      media: 'image',
      seriesTitle: 'series.title',
      status: 'status',
    },
    prepare({title, media, seriesTitle, status}) {
      const statusLabel =
        status === 'soldOut' ? 'Sold out' : status === 'published' ? 'Published' : 'Unpublished'

      return {
        title: title || 'Artwork without an ID',
        subtitle: [seriesTitle, statusLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
