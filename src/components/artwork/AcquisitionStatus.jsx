import React from 'react';
import { Link } from 'react-router-dom';
import './ArtworkComponents.css';

const labels = {
  AVAILABLE: 'AVAILABLE',
  ACQUIRED: 'ACQUIRED',
  NOT_CURRENTLY_AVAILABLE: 'NOT CURRENTLY AVAILABLE',
};

export default function AcquisitionStatus({ status, artworkId }) {
  if (!status || !labels[status]) return null;

  return (
    <section className="acquisition-status" aria-label="Acquisition status">
      <h2 className="section-title">Acquisition Status</h2>
      <p className="acquisition-status-label">{labels[status]}</p>
      {status === 'AVAILABLE' && (
        <Link to={`/access?artwork=${encodeURIComponent(artworkId)}`} className="acquisition-enquiry-link">
          Acquisition Enquiry <span aria-hidden="true">→</span>
        </Link>
      )}
    </section>
  );
}
