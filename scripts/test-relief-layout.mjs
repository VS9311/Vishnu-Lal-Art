import assert from 'node:assert/strict';
import { buildReliefBays, classifyArtwork, selectReliefProof } from '../src/components/landscape/reliefLayout.js';
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
for (const seriesId of ['series-i', 'series-ii']) {
  const proof = selectReliefProof(records.filter(work => work.seriesId === seriesId), seriesId);
  const bays = buildReliefBays(proof, seriesId);
  assert.equal(proof.length, seriesId === 'series-i' ? 9 : 3);
  assert.equal(bays.flatMap(bay => bay.slots).length, proof.length);
}
const broad = buildReliefBays(selectReliefProof(records, 'series-i'), 'series-i')[2];
assert.equal(broad.slots.find(slot => slot.prefer === 'landscape').artwork.id, 'VL-A-016');
assert.equal(buildReliefBays([records[0], records[0]], 'series-i')[0].slots.length, 1);
console.log('Relief layout: orientation, assignment, uniqueness, deterministic growth to 103 works passed.');
