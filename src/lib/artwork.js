import artworkIndex from '../data/artworks-index.json';
import seriesData from '../data/series.json';

const imageWidths = [480, 900, 1440, 2400];

export function getAllSeries() {
  return seriesData.series;
}

export function getSeriesData(seriesId) {
  return seriesData.series.find((s) => s.id === seriesId || s.slug === seriesId) ?? null;
}

export function getArtworkSummary(id) {
  return artworkIndex.artworks.find((artwork) => artwork.id === id) ?? null;
}

export function isKnownArtwork(id) {
  return artworkIndex.knownArtworkIds.includes(id);
}

export function isPublicArtwork(id) {
  return artworkIndex.publicArtworkIds.includes(id);
}

export function getSeriesLabel(seriesId) {
  const series = getSeriesData(seriesId);
  if (!series) return null;
  if (series.malayalamName && series.romanizedName) {
    return `${series.label} — ${series.malayalamName} (${series.romanizedName})`;
  }
  return series.label;
}

export function getSeriesArtworks(seriesId) {
  const targetSeries = getSeriesData(seriesId);
  if (!targetSeries) return [];
  return artworkIndex.artworks.filter(
    (artwork) => artwork.seriesId === targetSeries.id && artworkIndex.publicArtworkIds.includes(artwork.id),
  );
}

export function getSeriesNavigation(artworkId) {
  const artwork = getArtworkSummary(artworkId);
  if (!artwork) return { prevId: null, nextId: null, series: null, seriesId: null };

  const series = getSeriesData(artwork.seriesId);
  const seriesWorks = getSeriesArtworks(artwork.seriesId);
  const currentIndex = seriesWorks.findIndex((w) => w.id === artworkId);

  if (currentIndex === -1) {
    return { prevId: null, nextId: null, series, seriesId: artwork.seriesId };
  }

  const prevWork = currentIndex > 0 ? seriesWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < seriesWorks.length - 1 ? seriesWorks[currentIndex + 1] : null;

  return {
    prevId: prevWork ? prevWork.id : null,
    nextId: nextWork ? nextWork.id : null,
    series,
    seriesId: artwork.seriesId,
    currentIndex: currentIndex + 1,
    totalWorks: seriesWorks.length,
  };
}

export function getArtworkImage(id, width, height) {
  return {
    src: `/artworks/${id}/1440.webp`,
    srcSet: imageWidths.map((imageWidth) => `/artworks/${id}/${imageWidth}.webp ${imageWidth}w`).join(', '),
    width,
    height,
    alt: `Artwork ${id}`,
  };
}
