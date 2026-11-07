import artworkIndex from '../data/artworks-index.json';
import seriesData from '../data/series.json';
import { buildArchiveSnapshot } from './archiveData';

const imageWidths = [480, 900, 1440, 2400];

let archive = buildArchiveSnapshot({
  fallbackSeries: seriesData.series,
  fallbackArtworks: artworkIndex.artworks,
});

export function configureArchiveData({
  fallbackSeries = seriesData.series,
  fallbackArtworks = artworkIndex.artworks,
  sanitySeries = [],
  sanityArtworks = [],
} = {}) {
  archive = buildArchiveSnapshot({ fallbackSeries, fallbackArtworks, sanitySeries, sanityArtworks });
  return archive;
}

export function getAllSeries() {
  return archive.series;
}

export function getSeriesData(seriesId) {
  return archive.series.find((series) => series.id === seriesId || series.slug === seriesId) ?? null;
}

export function getArtworkSummary(id) {
  return archive.artworks.find((artwork) => artwork.id === id) ?? null;
}

export function isKnownArtwork(id) {
  return archive.knownArtworkIds.includes(id);
}

export function isPublicArtwork(id) {
  return archive.publicArtworkIds.includes(id);
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
  return archive.artworks.filter((artwork) => artwork.seriesId === targetSeries.id);
}

export function getSeriesNavigation(artworkId) {
  const artwork = getArtworkSummary(artworkId);
  if (!artwork) return { prevId: null, nextId: null, series: null, seriesId: null };
  const series = getSeriesData(artwork.seriesId);
  const seriesWorks = getSeriesArtworks(artwork.seriesId);
  const currentIndex = seriesWorks.findIndex((work) => work.id === artworkId);
  if (currentIndex === -1) return { prevId: null, nextId: null, series, seriesId: artwork.seriesId };
  return {
    currentId: artworkId,
    prevId: seriesWorks[currentIndex - 1]?.id ?? null,
    nextId: seriesWorks[currentIndex + 1]?.id ?? null,
    series,
    seriesId: artwork.seriesId,
    currentIndex: currentIndex + 1,
    totalWorks: seriesWorks.length,
  };
}

export function getArtworkImageSource(artwork, width = 900) {
  if (artwork?.imageUrl) {
    const separator = artwork.imageUrl.includes('?') ? '&' : '?';
    return `${artwork.imageUrl}${separator}w=${width}&auto=format&fit=max&q=88`;
  }
  return `/artworks/${artwork?.id}/${width}.webp`;
}

export function getArtworkImage(id, width, height) {
  const artwork = getArtworkSummary(id);
  if (artwork?.imageUrl) {
    return {
      src: getArtworkImageSource(artwork, 1440),
      srcSet: imageWidths.map((imageWidth) => `${getArtworkImageSource(artwork, imageWidth)} ${imageWidth}w`).join(', '),
      width: artwork.width || width,
      height: artwork.height || height,
      alt: `Artwork ${id}`,
    };
  }
  return {
    src: `/artworks/${id}/1440.webp`,
    srcSet: imageWidths.map((imageWidth) => `/artworks/${id}/${imageWidth}.webp ${imageWidth}w`).join(', '),
    width,
    height,
    alt: `Artwork ${id}`,
  };
}
