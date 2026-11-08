import type {StructureResolver} from 'sanity/structure'

const apiVersion = '2026-11-07'
const homepageSelectionDocumentId = '57a09b5e-b3f8-4f4d-927d-b21bb0abb08b'

type SeriesMenuItem = {
  _id: string
  title?: string
  titleMalayalam?: string
  seriesNumber?: number
}

export const structure: StructureResolver = async (S, context) => {
  const series = await context.getClient({apiVersion}).fetch<SeriesMenuItem[]>(
    `*[_type == "series" && !(_id in path("drafts.**"))]
      | order(seriesNumber asc) {
        _id,
        title,
        titleMalayalam,
        seriesNumber
      }`,
  )

  const artworkBySeries = series.map((item) => {
    const title = [item.titleMalayalam, item.title].filter(Boolean).join(' · ')

    return S.listItem()
      .id(`artwork-series-${item._id}`)
      .title(title || `Series ${item.seriesNumber ?? '—'}`)
      .schemaType('artwork')
      .child(
        S.documentTypeList('artwork')
          .id(`artworks-${item._id}`)
          .title(title || 'Artwork')
          .apiVersion(apiVersion)
          .filter('_type == "artwork" && series._ref == $seriesId')
          .params({seriesId: item._id})
          .canHandleIntent(
            (intentName, params) => intentName === 'create' && params.type === 'artwork',
          )
          .defaultOrdering([{field: 'artworkId', direction: 'asc'}]),
      )
  })

  return S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('series').title('Series'),
      S.listItem()
        .id('artwork')
        .title('Artwork')
        .schemaType('artwork')
        .child(
          S.list()
            .id('artwork-navigation')
            .title('Artwork')
            .items([
              S.listItem()
                .id('all-artworks')
                .title('All artworks')
                .child(S.documentTypeList('artwork').title('All artworks')),
              S.divider(),
              ...artworkBySeries,
            ]),
        ),
      S.listItem()
        .id('homepageSelection')
        .title('Homepage selection')
        .schemaType('homepageSelection')
        .child(
          S.document()
            .id(homepageSelectionDocumentId)
            .schemaType('homepageSelection')
            .documentId(homepageSelectionDocumentId)
            .title('Homepage selection'),
        ),
    ])
}
