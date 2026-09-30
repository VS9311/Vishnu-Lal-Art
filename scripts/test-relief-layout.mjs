import assert from 'node:assert/strict';
import { buildReliefBays, classifyArtwork, getArtworkRecordPath, SERIES_RELIEF_CONFIG } from '../src/components/landscape/reliefLayout.js';
import { readFileSync } from 'node:fs';

const records = JSON.parse(readFileSync(new URL('../src/data/artworks-index.json', import.meta.url))).artworks;
assert.equal(classifyArtwork({ width: 400, height: 800 }), 'portrait');
assert.equal(classifyArtwork({ width: 800, height: 400 }), 'landscape');
assert.equal(classifyArtwork({ width: 500, height: 510 }), 'square');
for (const count of [12, 17, 30, 100, 103]) {
  const input = Array.from({ length: count }, (_, i) => ({ id: `test-${i}`, width: i % 3 === 0 ? 800 : 400, height: 600 }));
  const bays = buildReliefBays(input, 'series-i');
  const slots = bays.flatMap(bay => bay.slots);
  assert.equal(bays.length, Math.ceil(count / 3));
  assert.equal(slots.length, count);
  assert.equal(new Set(slots.map(slot => slot.artwork.id)).size, count);
  assert.ok(slots.every(slot => slot.width > 0 && Number.isFinite(slot.width)));
  assert.deepEqual(buildReliefBays(input, 'series-i'), bays, 'Layout must be deterministic');
}
for (const [seriesId, expectedCount] of [['series-i', 17], ['series-ii', 12]]) {
  const corpus = records.filter(work => work.seriesId === seriesId);
  const bays = buildReliefBays(corpus, seriesId);
  assert.equal(corpus.length, expectedCount);
  assert.equal(bays.flatMap(bay => bay.slots).length, corpus.length);
  assert.equal(new Set(bays.flatMap(bay => bay.slots).map(slot => slot.artwork.id)).size, corpus.length);
  assert.deepEqual(
    bays.flatMap(bay => bay.slots).map(slot => slot.artwork.id).sort(),
    corpus.map(work => work.id).sort(),
    `${seriesId} must render every canonical ID exactly once`,
  );
  assert.ok(bays.flatMap(bay => bay.slots).every(slot => getArtworkRecordPath(slot.artwork.id) === `/artwork/${slot.artwork.id}`));
}
assert.deepEqual(SERIES_RELIEF_CONFIG['series-i'].sequence, ['levels', 'cut', 'broad', 'open', 'broad', 'levels']);
assert.deepEqual(SERIES_RELIEF_CONFIG['series-ii'].sequence, ['open', 'broad', 'levels', 'cut']);
console.log('Relief layout: orientation, assignment, uniqueness, deterministic growth to 103 works passed.');
