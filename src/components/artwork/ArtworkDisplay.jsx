import React from 'react';
import ResponsiveArtworkImage from './ResponsiveArtworkImage';
import './ArtworkComponents.css';

export default function ArtworkDisplay({ artwork, series }) {
  if (!artwork) return null;

  return (
    <section className="artwork-display">
      <div className="artwork-display-inner">
        <ResponsiveArtworkImage artwork={artwork} className="artwork-display-image" sizes="(max-width: 1023px) 100vw, 45vw" priority />
        <div className="artwork-display-meta">
          <span className="display-id">{artwork.id}</span>
          {series && <span className="display-series">{series}</span>}
        </div>
      </div>
    </section>
  );
}
