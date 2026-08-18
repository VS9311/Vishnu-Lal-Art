import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import './Encounters.css';

export default function SelectedWorkEncounter({ artwork, pending, allowPending }) {
  if (!artwork) return null;

  const label = pending ? `${artwork.id} — catalogue record pending` : `View ${artwork.id}`;

  return (
    <section className="encounter-selected">
      <div className="selected-container">
        <Link to={`/archive/${artwork.id}`} aria-label={label}>
          <ResponsiveArtworkImage artwork={artwork} className="selected-image" sizes="(max-width: 768px) 100vw, 35vw" />
        </Link>
        <div className="selected-metadata">
          {(!pending || allowPending) && <Link to={`/archive/${artwork.id}`} className="metadata hover-link">{artwork.id}</Link>}
        </div>
      </div>
    </section>
  );
}
