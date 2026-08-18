import React from 'react';
import { Link } from 'react-router-dom';
import './Encounters.css';

export default function RecordEncounter({ artwork }) {
  if (!artwork) return null;

  return (
    <section className="encounter-record">
      <div className="record-metadata">
        <Link to={`/archive/${artwork.id}`} className="metadata hover-link">
          {artwork.id}
        </Link>
        {artwork.series && (
          <span className="metadata">{artwork.series}</span>
        )}
      </div>
    </section>
  );
}
