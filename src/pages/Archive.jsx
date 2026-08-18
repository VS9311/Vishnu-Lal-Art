import React from 'react';
import { Link } from 'react-router-dom';
import { getAllSeries } from '../lib/artwork';
import MalayalamMarker from '../components/MalayalamMarker';
import './Archive.css';

export default function Archive() {
  const allSeries = getAllSeries();

  return (
    <main id="main-content" className="archive-portal-page">
      <section className="archive-portal-opening">
        <h1 className="section-title">THE ARCHIVE</h1>
        <p className="body-text">The public corpus of Vishnu Lal, organized into two distinct series.</p>
      </section>

      <section className="series-selection-grid" aria-label="Available Series">
        {allSeries.map((series, idx) => {
          const seriesUrl = `/archive/${series.slug || series.id}`;

          return (
            <article key={series.id} className={`series-card series-card-${idx + 1}`}>
              <Link to={seriesUrl} className="series-card-link" aria-label={`Enter ${series.label}: ${series.romanizedName}`}>
                <div className="series-card-header">
                  <span className="series-ordinal">{series.label}</span>
                  <span className="series-work-count">{series.workCount} selected works</span>
                </div>

                <div className="series-card-identity">
                  <MalayalamMarker
                    text={series.malayalamName}
                    align="left"
                    className="series-card-malayalam"
                  />
                  <div className="series-romanized-name">{series.romanizedName}</div>
                </div>

                <div className="series-card-footer">
                  <span className="series-enter-cta">
                    ENTER SERIES <span className="cta-arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}



