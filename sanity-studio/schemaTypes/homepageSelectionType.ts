import {defineArrayMember, defineField, defineType} from 'sanity'

const publishedArtworkReference = defineArrayMember({
  type: 'reference',
  to: [{type: 'artwork'}],
  options: {
    filter: 'status in $visibleStatuses',
    filterParams: {visibleStatuses: ['published', 'soldOut']},
  },
})

export const homepageSelectionType = defineType({
  name: 'homepageSelection',
  title: 'Homepage selection',
  type: 'document',
  initialValue: {
    title: 'Current homepage selection',
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Internal label',
      type: 'string',
      description: 'For Studio organization only. It is not shown on the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'desktopArtworks',
      title: 'Desktop selected works',
      type: 'array',
      description:
        'Choose exactly six published or sold-out artworks. Their order maps to the six existing marble positions from top left to bottom right.',
      of: [publishedArtworkReference],
      validation: (rule) => rule.required().length(6).unique(),
    }),
    defineField({
      name: 'mobileArtworks',
      title: 'Mobile selected works',
      type: 'array',
      description:
        'Choose and drag to order 4–12 published or sold-out artworks for the mobile homepage carousel.',
      of: [publishedArtworkReference],
      validation: (rule) => rule.required().min(4).max(12).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      desktopCount: 'desktopArtworks',
      mobileCount: 'mobileArtworks',
    },
    prepare({title, desktopCount, mobileCount}) {
      return {
        title: title || 'Homepage selection',
        subtitle: `${desktopCount?.length || 0} desktop · ${mobileCount?.length || 0} mobile`,
      }
    },
  },
})
