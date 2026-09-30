export const A1_SIZE_MM = Object.freeze({
  portrait: Object.freeze({ width: 594, height: 841 }),
  landscape: Object.freeze({ width: 841, height: 594 }),
});

const SHARED_INTERIOR_PRESENTATIONS = Object.freeze({
  livingRoom: {
    src: '/artwork-interiors/living-room-v1.jpg',
    alt: 'Artwork presented in a quiet pale living room',
    template: Object.freeze({ x: 50, y: 35, a1MaxWidthCqw: 31, a1MaxHeightCqh: 26, frameTone: 'light', objectPosition: '50% 50%' }),
  },
  workspace: {
    src: '/artwork-interiors/workspace-v1.jpg',
    alt: 'Artwork presented in a refined pale workspace',
    template: Object.freeze({ x: 50, y: 34, a1MaxWidthCqw: 38, a1MaxHeightCqh: 30, frameTone: 'light', objectPosition: '50% 50%' }),
  },
  interior: {
    src: '/artwork-interiors/collector-gallery-v1.jpg',
    alt: 'Artwork presented in a warmly lit collector gallery',
    template: Object.freeze({ x: 50, y: 35, a1MaxWidthCqw: 31, a1MaxHeightCqh: 26, frameTone: 'dark-heavy', objectPosition: '50% 50%' }),
  },
  bedroom: {
    src: '/artwork-interiors/bedroom-v1.jpg',
    alt: 'Artwork presented above a bed in a warm collector bedroom',
    template: Object.freeze({ x: 58, y: 32, a1MaxWidthCqw: 29, a1MaxHeightCqh: 25, frameTone: 'dark', objectPosition: '50% 50%' }),
  },
});

const MEDIA_BY_ARTWORK = Object.freeze({});

function imageMedia(kind, label, entry, artwork) {
  if (!entry || typeof entry.src !== 'string' || !entry.src.trim()) return null;
  return {
    id: entry.id || kind,
    kind,
    label,
    src: entry.src,
    alt: entry.alt || '',
    width: entry.width,
    height: entry.height,
    artwork,
    template: entry.template,
  };
}

function mergePresentation(defaults, configured) {
  if (!configured) return defaults;
  return {
    ...defaults,
    ...configured,
    template: { ...defaults.template, ...(configured.template || {}) },
  };
}

export function buildArtworkMedia(artwork, configured = MEDIA_BY_ARTWORK[artwork.id]) {
  const source = configured || {};
  const configuredPresentations = source.presentations || {};
  const presentations = {
    livingRoom: mergePresentation(SHARED_INTERIOR_PRESENTATIONS.livingRoom, configuredPresentations.livingRoom),
    workspace: mergePresentation(SHARED_INTERIOR_PRESENTATIONS.workspace, configuredPresentations.workspace),
    interior: mergePresentation(SHARED_INTERIOR_PRESENTATIONS.interior, configuredPresentations.interior),
    bedroom: mergePresentation(SHARED_INTERIOR_PRESENTATIONS.bedroom, configuredPresentations.bedroom),
  };
  return {
    marblePresentation: {
      id: 'marble-presentation',
      kind: 'marble',
      label: 'Marble presentation',
      artwork,
    },
    canonical: {
      id: 'canonical',
      kind: 'canonical',
      label: 'Full artwork',
      artwork,
    },
    presentations: {
      livingRoom: imageMedia('living-room', 'Living room', presentations.livingRoom, artwork),
      workspace: imageMedia('workspace', 'Workspace / office', presentations.workspace, artwork),
      interior: imageMedia('interior', 'Interior', presentations.interior, artwork),
      bedroom: imageMedia('bedroom', 'Bedroom', presentations.bedroom, artwork),
    },
    details: (source.details || []).map((entry, index) => imageMedia('detail', entry.label || `Detail ${index + 1}`, entry)).filter(Boolean),
    installations: (source.installations || []).map((entry, index) => imageMedia('installation', entry.label || `Installation ${index + 1}`, entry)).filter(Boolean),
  };
}

export function getArtworkMediaSequence(media, mobile = false) {
  if (mobile) return [
    media.canonical,
    media.presentations.livingRoom,
    media.presentations.workspace,
    media.presentations.interior,
    media.presentations.bedroom,
  ].filter(Boolean);

  return [
    media.marblePresentation,
    media.presentations.livingRoom,
    media.presentations.workspace,
    media.presentations.interior,
    media.presentations.bedroom,
    media.canonical,
  ].filter(Boolean);
}

export function clampMediaIndex(index, itemCount) {
  if (itemCount <= 0) return 0;
  return Math.min(Math.max(index, 0), itemCount - 1);
}

