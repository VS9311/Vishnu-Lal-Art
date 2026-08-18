import React from 'react';
import { Link } from 'react-router-dom';
import './ArtworkComponents.css';

export default function ArtworkFooter({ seriesNav }) {
  const { prevId, nextId, series } = seriesNav || {};
  const seriesUrl = series ? `/archive/${series.slug || series.id}` : '/archive';
  const seriesLabel = series ? `${series.label} (${series.romanizedName})` : 'Series';

  return (
    <section className="artwork-footer">
      <nav className="artwork-series-nav" aria-label="Series Artwork Navigation">
        <div className="series-nav-col prev-col">
          {prevId ? (
            <Link to={`/archive/${prevId}`} className="series-nav-btn" aria-label={`Previous work: ${prevId}`}>
              <span aria-hidden="true">←</span> PREVIOUS
            </Link>
          ) : (
            <span className="series-nav-disabled" aria-hidden="true">← PREVIOUS</span>
          )}
        </div>

        <div className="series-nav-col center-col">
          <Link to={seriesUrl} className="series-return-link" aria-label={`Return to ${seriesLabel}`}>
            RETURN TO {seriesLabel.toUpperCase()}
          </Link>
        </div>

        <div className="series-nav-col next-col">
          {nextId ? (
            <Link to={`/archive/${nextId}`} className="series-nav-btn" aria-label={`Next work: ${nextId}`}>
              NEXT <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="series-nav-disabled" aria-hidden="true">NEXT →</span>
          )}
        </div>
      </nav>

      <div className="artwork-secondary-links">
        <Link to="/" className="metadata hover-link">Return to Encounter</Link>
        <span className="dot-sep" aria-hidden="true">·</span>
        <Link to="/archive" className="metadata hover-link">All Series Overview</Link>
      </div>
    </section>
  );
}

