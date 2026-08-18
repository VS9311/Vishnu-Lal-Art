import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import './Encounters.css';

export default function EntryEncounter({ artwork, pending }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!artwork) return null;

  return (
    <section className="encounter-entry">
      <div className={`entry-image-container ${loaded ? 'loaded' : ''}`}>
        <Link to={`/archive/${artwork.id}`} aria-label={pending ? `${artwork.id} — catalogue record pending` : `View ${artwork.id}`}>
          <ResponsiveArtworkImage artwork={artwork} className="entry-image" sizes="(max-width: 768px) 100vw, 75vw" priority />
        </Link>
      </div>
    </section>
  );
}
