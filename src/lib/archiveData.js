const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function seriesIdFromNumber(seriesNumber) {
  const numeral = ROMAN_NUMERALS[Number(seriesNumber)];
  return numeral ? `series-${numeral.toLowerCase()}` : `series-${seriesNumber}`;
}

export function remapLegacySeriesId(seriesId) {
  if (seriesId === 'series-i') return 'series-ii';
  if (seriesId === 'series-ii') return 'series-iii';
  return seriesId;
}

function normalizeSanitySeries(series) {
  const seriesNumber = Number(series.seriesNumber);
  if (!Number.isInteger(seriesNumber) || seriesNumber < 1) return null;
  const id = seriesIdFromNumber(seriesNumber);
  return {
    id,
    slug: id,
    seriesNumber,
    label: `Series ${ROMAN_NUMERALS[seriesNumber] || seriesNumber}`,
    malayalamName: series.titleMalayalam || '',
    romanizedName: series.title || '',
    summary: series.summary || '',
    source: 'sanity',
  };
}

function normalizeSanityArtwork(artwork) {
  const id = artwork.artworkId?.trim();
  const seriesNumber = Number(artwork.seriesNumber);
  if (!id || !Number.isInteger(seriesNumber) || !artwork.imageUrl) return null;
  return {
    id,
    seriesId: seriesIdFromNumber(seriesNumber),
    width: Number(artwork.width) || 594,
    height: Number(artwork.height) || 841,
    imageUrl: artwork.imageUrl,
    priceUsd: Number(artwork.priceUsd) || null,
    status: artwork.status || 'unpublished',
    source: 'sanity',
  };
}

export function buildArchiveSnapshot({ fallbackSeries, fallbackArtworks, sanitySeries = [], sanityArtworks = [] }) {
  const seriesById = new Map(fallbackSeries.map((series, index) => [series.id, {
    ...series,
    seriesNumber: series.seriesNumber || index + 1,
    source: series.source || 'static',
  }]));
  sanitySeries.map(normalizeSanitySeries).filter(Boolean).forEach((series) => seriesById.set(series.id, series));

  const remappedFallback = fallbackArtworks.map((artwork) => ({
    ...artwork,
    seriesId: remapLegacySeriesId(artwork.seriesId),
    source: 'static',
  }));
  const managedIds = new Set(sanityArtworks.map((artwork) => artwork.artworkId?.trim()).filter(Boolean));
  const visibleSanity = sanityArtworks
    .map(normalizeSanityArtwork)
    .filter((artwork) => artwork && ['published', 'soldOut'].includes(artwork.status));
  const artworks = [
    ...remappedFallback.filter((artwork) => !managedIds.has(artwork.id)),
    ...visibleSanity,
  ].sort((left, right) => {
    const leftSeries = seriesById.get(left.seriesId)?.seriesNumber || 999;
    const rightSeries = seriesById.get(right.seriesId)?.seriesNumber || 999;
    return leftSeries - rightSeries || left.id.localeCompare(right.id, undefined, { numeric: true });
  });

  return {
    series: [...seriesById.values()].sort((left, right) => left.seriesNumber - right.seriesNumber),
    artworks,
    knownArtworkIds: [...new Set([...remappedFallback.map((artwork) => artwork.id), ...managedIds])],
    publicArtworkIds: artworks.map((artwork) => artwork.id),
  };
}
