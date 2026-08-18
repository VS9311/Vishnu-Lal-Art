import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSeriesData, getSeriesArtworks, getAllSeries } from '../lib/artwork';
import MalayalamMarker from '../components/MalayalamMarker';
import NotFound from './NotFound';
import './SeriesPage.css';

export default function SeriesPage({ seriesId: propSeriesId }) {
  const { seriesId: paramSeriesId } = useParams();
  const seriesKey = propSeriesId || paramSeriesId;
  const series = getSeriesData(seriesKey);

  if (!series) {
    return <NotFound />;
  }

  const artworks = getSeriesArtworks(series.id);
  const allSeries = getAllSeries();
  const otherSeries = allSeries.find((s) => s.id !== series.id);

  const renderArtwork = (work, index) => {
    const isEager = index < 2;
    const loading = isEager ? 'eager' : 'lazy';
    const fetchPriority = isEager ? 'high' : 'auto';
    const imageWidths = [480, 900, 1440, 2400];
    const srcSet = imageWidths.map((w) => `/artworks/${work.id}/${w}.webp ${w}w`).join(', ');
    const src = `/artworks/${work.id}/900.webp`;

    // Dynamic layout class based on series and index to create structured exhibition rhythm
    const layoutVariant = (index % 4) + 1;
    const itemClass = `series-artwork-item item-variant-${layoutVariant}`;

    return (
      <div key={work.id} className={itemClass}>
        <Link to={`/archive/${work.id}`} className="artwork-link" aria-label={`Study view of ${work.id}`}>
          <div className="artwork-image-wrapper">
            <img
              src={src}
              srcSet={srcSet}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 42vw"
              alt={`Artwork ${work.id}`}
              width={work.width}
              height={work.height}
              className="artwork-image"
              loading={loading}
              fetchPriority={fetchPriority}
            />
          </div>
          <div className="artwork-meta">
            <span className="id">{work.id}</span>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <main id="main-content" className="series-page">
      <div className="series-nav-back">
        <Link to="/archive" className="back-link">
          <span className="arrow" aria-hidden="true">←</span> THE ARCHIVE
        </Link>
      </div>

      <header className="series-header">
        <div className="series-header-identity">
          <MalayalamMarker
            text={series.malayalamName}
            align="left"
            className="series-header-malayalam"
          />
          <div className="series-header-title-group">
            <h1 className="series-romanized-title">{series.romanizedName}</h1>
            <div className="series-header-meta">
              <span className="series-badge">{series.label}</span>
              <span className="series-dot" aria-hidden="true">·</span>
              <span className="series-count">{artworks.length} selected works</span>
            </div>
          </div>
        </div>
      </header>

      <section className="series-grid" aria-label={`Artworks in ${series.label}`}>
        {artworks.map((work, index) => renderArtwork(work, index))}
      </section>

      <footer className="series-footer">
        <div className="series-footer-nav">
          <Link to="/archive" className="footer-link">
            ← RETURN TO ALL SERIES
          </Link>
          {otherSeries && (
            <Link to={`/archive/${otherSeries.slug || otherSeries.id}`} className="footer-link next-series-link">
              EXPLORE {otherSeries.label.toUpperCase()} ({otherSeries.romanizedName.toUpperCase()}) →
            </Link>
          )}
        </div>
      </footer>
    </main>
  );
}
