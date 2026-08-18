import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import { isPublicArtwork } from '../../lib/artwork';
import './Encounters.css';

export default function MultipleWorksEncounter({ artworks, allowPending }) {
  if (!artworks || artworks.length === 0) return null;

  return (
    <section className="encounter-multiple">
      {artworks.map((work, index) => {
        const pending = !isPublicArtwork(work.id);
        return (
          <div key={work.id} className={`multiple-item multiple-pos-${index}`}>
            <Link to={`/archive/${work.id}`} aria-label={pending ? `${work.id} — catalogue record pending` : `View ${work.id}`}>
              <ResponsiveArtworkImage artwork={work} className="multiple-image" sizes="(max-width: 768px) 100vw, 30vw" />
            </Link>
            <div className="multiple-metadata">
              {(!pending || allowPending) && <Link to={`/archive/${work.id}`} className="metadata hover-link">{work.id}</Link>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
