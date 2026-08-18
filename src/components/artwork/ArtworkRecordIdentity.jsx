import React from 'react';
import './ArtworkComponents.css';

export default function ArtworkRecordIdentity({ artwork, series }) {
  if (!artwork || !series) return null;

  return (
    <section className="artwork-record-identity" aria-label="Artwork record identity">
      <p className="record-id">{artwork.id}</p>
      <p className="record-series">{series.label}</p>
      {series.malayalamName && <p className="record-series-malayalam">{series.malayalamName}</p>}
      {series.romanizedName && <p className="record-series-romanized">{series.romanizedName}</p>}
    </section>
  );
}
