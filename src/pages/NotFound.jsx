import React from 'react';
import { Link } from 'react-router-dom';
import './ArtworkDetail.css';

export default function NotFound() {
  return (
    <main id="main-content" className="artwork-detail-page page-state">
      <h1 className="section-title">Archive Record Not Found</h1>
      <p className="body-text">This address does not correspond to a public Archive record.</p>
      <Link to="/" className="metadata hover-link">Return to Encounter</Link>
    </main>
  );
}
