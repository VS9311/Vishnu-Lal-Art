import React from 'react';
import { Link } from 'react-router-dom';
import './Encounters.css';

export default function ExitEncounter() {
  return (
    <section className="encounter-exit">
      <Link to="/" className="metadata hover-link">Return to Encounter</Link>
    </section>
  );
}
