import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArtworkDisplay from '../components/artwork/ArtworkDisplay';
import ArtworkRecordIdentity from '../components/artwork/ArtworkRecordIdentity';
import CatalogueRecord from '../components/artwork/CatalogueRecord';
import FormalObservation from '../components/artwork/FormalObservation';
import CuratorialObservation from '../components/artwork/CuratorialObservation';
import AcquisitionStatus from '../components/artwork/AcquisitionStatus';
import ArtworkFooter from '../components/artwork/ArtworkFooter';
import { getArtworkSummary, getSeriesData, getSeriesLabel, getSeriesNavigation, isKnownArtwork, isPublicArtwork } from '../lib/artwork';
import './ArtworkDetail.css';

export default function ArtworkDetail() {
  const { id } = useParams();
  const artwork = getArtworkSummary(id);
  const knownArtwork = isKnownArtwork(id);
  const publicArtwork = isPublicArtwork(id);
  const [artworkData, setArtworkData] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setArtworkData(null);
    setLoadError(false);

    if (!publicArtwork) return;

    import(`../data/artworks/${id}.json`)
      .then((module) => setArtworkData(module.default))
      .catch(() => setLoadError(true));
  }, [id, publicArtwork]);

  if (!knownArtwork) {
    return (
      <main id="main-content" className="artwork-detail-page page-state">
        <h1 className="section-title">Archive Record Not Found</h1>
        <p className="body-text">This address does not correspond to an Archive record.</p>
        <Link to="/" className="metadata hover-link">Return to Encounter</Link>
      </main>
    );
  }

  if (!publicArtwork) {
    return (
      <main id="main-content" className="artwork-detail-page page-state">
        <h1 className="section-title">Record Pending</h1>
        <p className="body-text">This catalogue record is not currently available for study.</p>
        <Link to="/" className="metadata hover-link">Return to Encounter</Link>
      </main>
    );
  }

  if (loadError) {
    return (
      <main id="main-content" className="artwork-detail-page page-state">
        <h1 className="section-title">Archive Record Not Found</h1>
        <p className="body-text">This public catalogue record could not be loaded.</p>
        <Link to="/" className="metadata hover-link">Return to Encounter</Link>
      </main>
    );
  }

  if (!artworkData || !artwork) {
    return <main id="main-content" className="artwork-detail-page"><div className="loading-state" aria-label="Loading catalogue record" /></main>;
  }

  const seriesNav = getSeriesNavigation(id);
  const series = getSeriesData(artwork.seriesId);

  return (
    <main id="main-content" className="artwork-detail-page">
      <div className="study-view-container">
        <div className="study-left-column">
          <ArtworkDisplay artwork={artwork} series={getSeriesLabel(artwork.seriesId)} />
        </div>
        <div className="study-right-column">
          <ArtworkRecordIdentity artwork={artwork} series={series} />
          <CatalogueRecord metadata={artworkData.catalogue} />
          {artworkData.formalObservation && <FormalObservation data={artworkData.formalObservation} />}
          {artworkData.curatorialObservation && <CuratorialObservation data={artworkData.curatorialObservation} />}
          <AcquisitionStatus status={artworkData.acquisitionStatus} artworkId={artwork.id} />
        </div>
      </div>
      <ArtworkFooter seriesNav={seriesNav} />
    </main>
  );
}
