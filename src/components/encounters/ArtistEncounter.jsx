import React from 'react';
import './Encounters.css';

export default function ArtistEncounter({ text }) {
  if (!text) return null;

  return (
    <section className="encounter-artist">
      <h2 className="section-title">{text}</h2>
    </section>
  );
}
