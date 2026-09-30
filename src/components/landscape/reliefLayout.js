// Presentation only: canonical records and their catalogue order remain unchanged.
export const SERIES_RELIEF_CONFIG = {
  'series-i': { sequence: ['levels', 'cut', 'broad', 'open', 'broad', 'levels'] },
  'series-ii': { sequence: ['open', 'broad', 'levels', 'cut'] },
};

// Slots share ledge baselines with the architectural planes, in a 560px-high bay.
// Every slot has a flex fallback; orientation affects assignment AND paper dimensions.
export const RELIEF_FAMILIES = {
  levels: {
    slots: [{ x: 16, base: 180, prefer: 'portrait', size: 1 }, { x: 49, base: 110, prefer: 'square', size: .86 }, { x: 80, base: 155, prefer: 'portrait', size: .94 }],
    planes: [{ x: 3, w: 91, base: 108, h: 390, depth: 9, kind: 'recess' }, { x: 2, w: 33, base: 180, h: 8, kind: 'ledge' }, { x: 30, w: 34, base: 110, h: 10, kind: 'ledge' }, { x: 65, w: 32, base: 155, h: 12, kind: 'ledge' }],
  },
  broad: {
    slots: [{ x: 16, base: 140, prefer: 'portrait', size: .91 }, { x: 49, base: 140, prefer: 'landscape', size: 1 }, { x: 81, base: 230, prefer: 'portrait', size: .86 }],
    planes: [{ x: 1, w: 65, base: 140, h: 325, depth: 8, kind: 'recess' }, { x: 0, w: 68, base: 140, h: 12, kind: 'ledge' }, { x: 65, w: 34, base: 230, h: 13, kind: 'ledge' }, { x: 72, w: 22, base: 55, h: 165, depth: 12, kind: 'plane' }],
  },
  cut: {
    slots: [{ x: 17, base: 135, prefer: 'portrait', size: 1.06 }, { x: 51, base: 220, prefer: 'landscape', size: .88 }, { x: 82, base: 105, prefer: 'square', size: .85 }],
    planes: [{ x: 2, w: 30, base: 132, h: 425, depth: 14, kind: 'recess' }, { x: 32, w: 63, base: 104, h: 370, depth: 5, kind: 'plane' }, { x: 0, w: 34, base: 135, h: 12, kind: 'ledge' }, { x: 35, w: 34, base: 220, h: 8, kind: 'ledge' }, { x: 67, w: 31, base: 105, h: 10, kind: 'ledge' }],
  },
  open: {
    slots: [{ x: 15, base: 155, prefer: 'landscape', size: .92 }, { x: 49, base: 155, prefer: 'landscape', size: 1 }, { x: 82, base: 215, prefer: 'portrait', size: .9 }],
    planes: [{ x: 0, w: 69, base: 155, h: 9, kind: 'ledge' }, { x: 12, w: 61, base: 100, h: 350, depth: 3, kind: 'plane' }, { x: 68, w: 29, base: 215, h: 7, kind: 'ledge' }],
  },
};

export function classifyArtwork(artwork) {
  const ratio = Number(artwork.width) / Number(artwork.height);
  if (Number.isFinite(ratio) && ratio > 0) return ratio > 1.15 ? 'landscape' : ratio < .87 ? 'portrait' : 'square';
  return ['portrait', 'landscape', 'square'].includes(artwork.orientation) ? artwork.orientation : 'square';
}

export function getArtworkRecordPath(artworkId) {
  return `/artwork/${artworkId}`;
}

export function buildReliefBays(artworks, seriesId) {
  const sequence = SERIES_RELIEF_CONFIG[seriesId]?.sequence || SERIES_RELIEF_CONFIG['series-i'].sequence;
  return Array.from({ length: Math.ceil(artworks.length / 3) }, (_, index) => {
    const family = sequence[index % sequence.length];
    const definition = RELIEF_FAMILIES[family];
    const group = artworks.slice(index * 3, index * 3 + 3);
    const remaining = [...group];
    const assigned = new Map();
    // Claim exact-compatible slots first so fallback works cannot take them.
    definition.slots.forEach((slot, slotIndex) => {
      const match = remaining.findIndex(work => classifyArtwork(work) === slot.prefer);
      if (match >= 0) assigned.set(slotIndex, remaining.splice(match, 1)[0]);
    });
    definition.slots.forEach((_, slotIndex) => {
      if (!assigned.has(slotIndex) && remaining.length) assigned.set(slotIndex, remaining.shift());
    });
    const seed = group.reduce((sum, work) => sum + [...work.id].reduce((n, char) => n + char.charCodeAt(0), 0), 0);
    const shift = (seed % 5 - 2) * 5;
    return {
      family, key: group[0].id, shift, inset: seed % 3 * 3,
      planes: definition.planes,
      slots: definition.slots.flatMap((slot, slotIndex) => {
        const artwork = assigned.get(slotIndex);
        if (!artwork) return [];
        const orientation = classifyArtwork(artwork);
        const ratio = artwork.width > 0 && artwork.height > 0 ? artwork.width / artwork.height : 1;
        const weight = { small: .88, medium: 1, large: 1.08 }[artwork.presentationSize] || 1;
        const width = Math.min(orientation === 'landscape' ? 290 : orientation === 'square' ? 235 : 220, 320 * ratio) * slot.size * weight;
        return [{ ...slot, artwork, orientation, width }];
      }),
    };
  });
}
