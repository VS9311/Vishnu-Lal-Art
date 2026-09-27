import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeMarbleArtwork } from './marbleImageReadiness.js';

test('decode readiness is awaited, cached, bounded, and failed loads can retry', async () => {
  const OriginalImage = globalThis.Image;
  const images = [];
  globalThis.Image = class {
    constructor() { images.push(this); }
    decode() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
  };
  try {
    const artwork = { id: 'decode-test-1' };
    const first = decodeMarbleArtwork(artwork);
    let ready = false;
    first.then(() => { ready = true; });
    await Promise.resolve();
    assert.equal(ready, false);
    assert.equal(decodeMarbleArtwork(artwork), first);
    assert.equal(images.length, 1);
    assert.equal(images[0].src, '/artworks/decode-test-1/900.webp');
    images[0].resolve();
    await first;
    assert.equal(ready, true);
    const failed = decodeMarbleArtwork({ id: 'decode-failure' });
    images.at(-1).reject(new Error('decode failed'));
    await assert.rejects(failed);
    const retry = decodeMarbleArtwork({ id: 'decode-failure' });
    assert.notEqual(failed, retry);
    images.at(-1).resolve();
    await retry;
    for (let i = 0; i < 11; i++) {
      const promise = decodeMarbleArtwork({ id: `cache-${i}` });
      images.at(-1).resolve();
      await promise;
    }
    const before = images.length;
    const evicted = decodeMarbleArtwork(artwork);
    assert.equal(images.length, before + 1);
    images.at(-1).resolve();
    await evicted;
  } finally { globalThis.Image = OriginalImage; }
});
