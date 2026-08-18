import React from 'react';
import './ArtworkComponents.css';

function formatLabel(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

export default function CatalogueRecord({ metadata }) {
  if (!metadata || Object.keys(metadata).length === 0) return null;

  return (
    <section className="catalogue-record">
      <h2 className="section-title">Catalogue Record</h2>
      <div className="metadata-grid">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="metadata-row">
            <div className="metadata-key">{formatLabel(key)}</div>
            <div className="metadata-value">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
