const THUNDU_ID = /^THUNDU-(\d+)$/i;

export function formatArtworkDisplayId(artworkId) {
  if (typeof artworkId !== 'string') return '';
  const normalized = artworkId.trim();
  const match = normalized.match(THUNDU_ID);
  return match ? `തുണ്ട്-${match[1]}` : normalized;
}
