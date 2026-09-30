import assert from 'node:assert/strict';
import { A1_SIZE_MM, buildArtworkMedia, clampMediaIndex, getArtworkMediaSequence } from '../src/components/artwork/artworkMedia.js';

const artwork = { id: 'VL-TEST-001' };
const minimal = buildArtworkMedia(artwork);

assert.notStrictEqual(
  minimal.marblePresentation,
  minimal.canonical,
  'The environmental presentation and authoritative canonical media must remain distinct records.',
);
assert.equal(minimal.marblePresentation.kind, 'marble');
assert.equal(minimal.canonical.kind, 'canonical');
assert.deepEqual(A1_SIZE_MM.portrait, { width: 594, height: 841 });
assert.deepEqual(A1_SIZE_MM.landscape, { width: 841, height: 594 });
assert.equal(minimal.presentations.interior.template.frameTone, 'dark-heavy');
assert.equal(minimal.presentations.bedroom.template.frameTone, 'dark');

assert.deepEqual(
  getArtworkMediaSequence(minimal).map((item) => item.kind),
  ['marble', 'living-room', 'workspace', 'interior', 'bedroom', 'canonical'],
  'Desktop must move from the approved marble world through four interiors to the canonical artwork reveal.',
);

assert.equal(clampMediaIndex(1, 1), 0, 'A shorter responsive sequence must synchronously clamp the previous slide index.');
assert.equal(clampMediaIndex(5, 2), 1, 'Out-of-range media indexes must clamp to the final available item.');

assert.deepEqual(
  getArtworkMediaSequence(minimal, true).map((item) => item.kind),
  ['canonical', 'living-room', 'workspace', 'interior', 'bedroom'],
  'Mobile must begin with the canonical artwork, omit marble, and retain the four interior contexts.',
);

const complete = buildArtworkMedia(artwork, {
  presentations: {
    livingRoom: { src: '/living.webp', alt: 'Artwork in a living room' },
    workspace: { src: '/workspace.webp', alt: 'Artwork in a workspace' },
    interior: { src: '/interior.webp', alt: 'Artwork in a third interior' },
    bedroom: { src: '/bedroom.webp', alt: 'Artwork in a bedroom' },
  },
  details: [
    { src: '/detail-1.webp', label: 'Surface detail' },
    { src: '' },
  ],
  installations: [{ src: '/installation-1.webp', label: 'Installation view' }],
});

assert.deepEqual(
  getArtworkMediaSequence(complete).map((item) => item.kind),
  ['marble', 'living-room', 'workspace', 'interior', 'bedroom', 'canonical'],
  'Configured real media must retain the six-slide desktop order.',
);

assert.deepEqual(
  getArtworkMediaSequence(complete, true).map((item) => item.kind),
  ['canonical', 'living-room', 'workspace', 'interior', 'bedroom'],
  'Mobile must place the four real interior presentations after the canonical artwork.',
);
assert.equal(complete.presentations.livingRoom.template.a1MaxWidthCqw, 31, 'Per-artwork media overrides must inherit the calibrated A1 template.');

console.log('Artwork media ordering checks passed.');
