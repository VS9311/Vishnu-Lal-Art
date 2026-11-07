import { createClient } from '@sanity/client';
import artworkIndex from '../data/artworks-index.json';
import seriesData from '../data/series.json';
import { configureArchiveData } from './artwork';
import { setCataloguePriceOverrides } from './cataloguePricing';
import { configureHomepageSelection } from './homepageSelection';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '2gtua40d';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'staging';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-11-07',
  useCdn: false,
  perspective: 'published',
});

const archiveQuery = `{
  "series": *[_type == "series"] | order(seriesNumber asc) {
    _id, title, titleMalayalam, "code": code.current, summary, seriesNumber
  },
  "artworks": *[_type == "artwork"] | order(artworkId asc) {
    artworkId, priceUsd, status,
    "seriesNumber": series->seriesNumber,
    "seriesCode": series->code.current,
    "imageUrl": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  },
  "homepageSelection": *[_type == "homepageSelection"] | order(_updatedAt desc)[0] {
    "desktopArtworkIds": desktopArtworks[]->artworkId,
    "mobileArtworkIds": mobileArtworks[]->artworkId
  }
}`;

export async function initializeArchiveFromSanity() {
  try {
    const result = await Promise.race([
      client.fetch(archiveQuery),
      new Promise((_, reject) => window.setTimeout(() => reject(new Error('Sanity staging request timed out.')), 5000)),
    ]);
    const snapshot = configureArchiveData({
      fallbackSeries: seriesData.series,
      fallbackArtworks: artworkIndex.artworks,
      fallbackKnownArtworkIds: artworkIndex.knownArtworkIds,
      sanitySeries: result?.series || [],
      sanityArtworks: result?.artworks || [],
    });
    configureHomepageSelection({
      desktopArtworkIds: result?.homepageSelection?.desktopArtworkIds,
      mobileArtworkIds: result?.homepageSelection?.mobileArtworkIds,
      publicArtworkIds: snapshot.publicArtworkIds,
    });
    setCataloguePriceOverrides(snapshot.artworks.map((artwork) => [artwork.id, artwork.priceUsd]));
    document.documentElement.dataset.archiveSource = 'sanity-staging';
    return snapshot;
  } catch (error) {
    console.warn('Sanity staging data was unavailable; using the preserved local archive.', error);
    document.documentElement.dataset.archiveSource = 'local-fallback';
    return null;
  }
}
