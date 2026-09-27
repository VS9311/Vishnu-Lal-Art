// Fixed mobile rendition avoids responsive-source reselection after decoding.
export const marbleImageSource = artwork => `/artworks/${artwork.id}/900.webp`;
const cache = new Map();
export function decodeMarbleArtwork(artwork) {
  const src = marbleImageSource(artwork);
  if (cache.has(src)) {
    const entry = cache.get(src);
    cache.delete(src);
    cache.set(src, entry);
    return entry.ready;
  }
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  const entry = { image, ready: image.decode().catch(error => { cache.delete(src); throw error; }) };
  cache.set(src, entry);
  while (cache.size > 10) cache.delete(cache.keys().next().value);
  return entry.ready;
}
export function warmMarbleNeighbors(artworks, index) {
  for (const offset of [0, -1, 1, -2, 2]) {
    void decodeMarbleArtwork(artworks[(index + offset + artworks.length) % artworks.length]).catch(() => {});
  }
}
