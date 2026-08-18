import React from 'react';
import MalayalamMarker from '../MalayalamMarker';
import './Encounters.css';

export default function ArchivalInterruption({ text }) {
  if (!text) return null;

  return (
    <section className="encounter-interruption">
      <div className="interruption-content">
        <MalayalamMarker
          text="അന്തരാളം"
          align="left"
          className="homepage-interruption-marker"
        />
        <p className="body-text archival-interruption-text">{text}</p>
      </div>
    </section>
  );
}

