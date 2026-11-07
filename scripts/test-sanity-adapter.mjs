import assert from 'node:assert/strict';
import { buildArchiveSnapshot } from '../src/lib/archiveData.js';

const fallbackSeries = [
  { id: 'series-i', seriesNumber: 1, label: 'Series I', romanizedName: 'Alolam' },
  { id: 'series-ii', seriesNumber: 2, label: 'Series II', romanizedName: 'Anamam' },
  { id: 'series-iii', seriesNumber: 3, label: 'Series III', romanizedName: 'Andaralam' },
];
const snapshot = buildArchiveSnapshot({
  fallbackSeries,
  fallbackArtworks: [
    { id: 'VL-A-001', seriesId: 'series-i', width: 10, height: 20 },
    { id: 'VL-B-001', seriesId: 'series-ii', width: 20, height: 10 },
  ],
  sanitySeries: [{ seriesNumber: 1, title: 'Alolam', titleMalayalam: 'അലോലം', summary: 'New series.' }],
  sanityArtworks: [
    { artworkId: 'VL-A-001', seriesNumber: 1, imageUrl: 'https://cdn.sanity.io/a.jpg', status: 'unpublished' },
    { artworkId: 'VL-C-001', seriesNumber: 1, imageUrl: 'https://cdn.sanity.io/c.jpg', width: 100, height: 200, status: 'published', priceUsd: 2400 },
    { artworkId: 'VL-C-002', seriesNumber: 1, imageUrl: 'https://cdn.sanity.io/d.jpg', status: 'soldOut' },
  ],
});

assert.deepEqual(snapshot.series.map((series) => series.id), ['series-i', 'series-ii', 'series-iii']);
assert.equal(snapshot.series[0].romanizedName, 'Alolam');
assert.equal(snapshot.artworks.some((artwork) => artwork.id === 'VL-A-001'), false, 'An unpublished Sanity record suppresses its fallback duplicate.');
assert.equal(snapshot.artworks.find((artwork) => artwork.id === 'VL-B-001').seriesId, 'series-iii');
assert.equal(snapshot.artworks.find((artwork) => artwork.id === 'VL-C-001').seriesId, 'series-i');
assert.equal(snapshot.artworks.find((artwork) => artwork.id === 'VL-C-001').priceUsd, 2400);
assert.equal(snapshot.publicArtworkIds.includes('VL-C-002'), true, 'Sold works remain visible.');
assert.equal(snapshot.knownArtworkIds.includes('VL-A-001'), true, 'Historical identifiers remain known.');

console.log('Sanity adapter tests passed.');
