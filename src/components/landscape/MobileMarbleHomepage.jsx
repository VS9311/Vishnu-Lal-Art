import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { getArtworkSummary, getSeriesData } from '../../lib/artwork';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import useMarbleNavigation from './useMarbleNavigation';
import { marbleImageSource } from './marbleImageReadiness';
import './MobileMarbleHomepage.css';
import { MotionLink } from '../../motion/RouteMotion';

const STATE_KEY = 'vishnu-lal-archive:mobile-marble-v1';

function restoreState(allowed, count, stateKey) {
  if (!allowed) return { index: 0, details: false };
  try {
    const saved = JSON.parse(sessionStorage.getItem(stateKey));
    if (Number.isInteger(saved?.index) && saved.index >= 0 && saved.index < count) return saved;
  } catch { /* Browsing works without storage. */ }
  return { index: 0, details: false };
}

export default function MobileMarbleHomepage({ artworkIds, collectionId }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const artworks = useMemo(() => artworkIds.map(getArtworkSummary).filter(Boolean), [artworkIds]);
  const stateKey = collectionId ? `${STATE_KEY}:${collectionId}` : STATE_KEY;
  const [initial] = useState(() => {
    const selected = artworks.findIndex((artwork) => artwork.id === location.state?.artworkId);
    return selected >= 0 ? { index: selected, details: false } : restoreState(navigationType === 'POP' || location.state?.restoreLandscape, artworks.length, stateKey);
  });
  const { state: navigation, index, busy, move, select: requestSelection, bindSlot, bindScene, error, retry } = useMarbleNavigation(initial.index, artworks);
  const [details, setDetails] = useState(initial.details);
  const [indexOpen, setIndexOpen] = useState(false);
  const pointer = useRef(null);
  const didSwipe = useRef(false);
  const detailsButton = useRef(null);
  const indexButton = useRef(null);
  const work = artworks[index];
  const series = getSeriesData(work.seriesId);
  const save = () => {
    try { sessionStorage.setItem(stateKey, JSON.stringify({ index, details })); } catch { /* Optional storage. */ }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!collectionId) return;
    document.querySelectorAll('.mobile-marble-thumbnails').forEach((strip) => {
      const selected = strip.querySelector('[aria-current]');
      if (!selected) return;
      const left = selected.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
      strip.scrollTo({ left: left - (strip.clientWidth - selected.offsetWidth) / 2, behavior: 'instant' });
    });
  }, [index, details, collectionId]);

  useEffect(() => {
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      if (indexOpen) { setIndexOpen(false); indexButton.current?.focus(); }
      else if (details) { setDetails(false); detailsButton.current?.focus(); }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [details, indexOpen]);

  const thumbnails = (label) => (
    <nav className="mobile-marble-thumbnails" aria-label={label}>
      {artworks.map((artwork, position) => (
        <button key={artwork.id} type="button" aria-label={`Show ${artwork.id}`} aria-current={position === index ? 'true' : undefined} onClick={() => requestSelection(position)}>
          <ResponsiveArtworkImage artwork={artwork} sizes="60px" className="mobile-marble-thumbnail" />
        </button>
      ))}
    </nav>
  );

  const recognizeSwipe = (event) => {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Yield early to vertical intent so scrolling cannot become a late swipe.
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      pointer.current = null;
      return;
    }
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      pointer.current = null;
      didSwipe.current = true;
      move(dx < 0 ? 1 : -1);
    }
  };

  return (
    <main id="main-content" className={`landscape-homepage mobile-marble-homepage${collectionId ? ' mobile-marble-collection' : ''}`}>
      <section className="mobile-marble-scene" aria-label="Marble artwork collection">
        <img className="mobile-marble-backdrop" src="/homepage-2/mobile-marble-podium-v1.png" alt="" fetchPriority="high" />
        <header className="mobile-marble-header">
          <MotionLink to="/" kind="portal" className="mobile-marble-identity"><strong>VISHNU LAL</strong><span>THE ARCHIVE</span></MotionLink>
          <button ref={indexButton} type="button" aria-expanded={indexOpen} aria-controls="mobile-marble-index" onClick={() => { setIndexOpen(!indexOpen); setDetails(false); }}>{indexOpen ? 'CLOSE' : 'INDEX'}</button>
        </header>

        {indexOpen && <nav id="mobile-marble-index" className="mobile-marble-index" aria-label="Marble archive index">
          <MotionLink to="/" kind="portal" onClick={() => setIndexOpen(false)}>MARBLE HOMEPAGE</MotionLink>
          <MotionLink to="/artist" kind="portal" onClick={() => setIndexOpen(false)}>THE ARTIST · OUTSIDE THE SYSTEM</MotionLink>
          {['series-i', 'series-ii'].map((id) => {
            const item = getSeriesData(id);
            return <MotionLink className="mobile-marble-series-destination" to={`/${id}`} kind="portal" key={id} onClick={() => setIndexOpen(false)}>
              <span>{item.label}</span><strong lang="ml">{item.malayalamName}</strong><span>{item.romanizedName}</span>
            </MotionLink>;
          })}
        </nav>}

        <div className={`mobile-marble-stage${busy ? ' is-moving' : ''}${['BOOT', 'ERROR'].includes(navigation.phase) ? ' is-unready' : ''}`} data-navigation-state={navigation.phase} data-navigation-phase={navigation.phase} aria-label="Swipe left or right to browse artworks" aria-busy={busy}
          onPointerDown={(event) => {
            if (busy || !event.isPrimary || event.button !== 0) return;
            didSwipe.current = false;
            pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
            // Capture on the pressed button so an ordinary tap still activates it.
            const captureTarget = event.target.closest('button') || event.currentTarget;
            captureTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={recognizeSwipe}
          onPointerUp={(event) => { recognizeSwipe(event); pointer.current = null; }}
          onPointerCancel={() => { pointer.current = null; }}
          onClickCapture={(event) => { if (didSwipe.current) { event.preventDefault(); event.stopPropagation(); didSwipe.current = false; } }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
          }}>
          {['a', 'b'].map(scene => <div key={scene} ref={node => bindScene(scene, node)} className="mobile-marble-scene-group" data-scene={scene} data-current={scene === navigation.scene} style={{ transform: `translateX(${navigation.offsets[scene]}%)` }}>
          {(scene === navigation.scene ? navigation.slots : navigation.standbySlots).map((slot) => {
            const artwork = artworks[slot.index];
            const positionAnchor = slot.anchor;
            const settledAnchor = slot.anchor;
            const visible = scene === navigation.scene && ['center', 'left', 'right'].includes(positionAnchor);
            const spareHidden = (navigation.direct || scene !== navigation.scene) && positionAnchor.startsWith('off-');
            return <button key={slot.key} ref={node => bindSlot(`${scene}:${slot.key}`, node)} type="button" data-slot={slot.key} data-artwork-id={artwork.id} data-anchor={positionAnchor} style={spareHidden ? { visibility: 'hidden' } : undefined} className={`mobile-marble-work mobile-marble-work--${positionAnchor}`} aria-hidden={!visible} tabIndex={visible && !busy ? 0 : -1} aria-label={settledAnchor === 'center' ? `Show details for ${artwork.id}` : `${settledAnchor === 'left' ? 'Previous' : 'Next'} artwork, ${artwork.id}`} aria-expanded={settledAnchor === 'center' ? details : undefined} aria-controls={settledAnchor === 'center' ? 'mobile-marble-details' : undefined}
              onClick={() => { if (busy) return; if (slot.index === index) setDetails(!details); else move(settledAnchor === 'left' ? -1 : 1); }}>
              <span className="landscape-artwork-sheet"><img src={marbleImageSource(artwork)} width={artwork.width} height={artwork.height} alt={`Artwork ${artwork.id}`} className="landscape-artwork-image" decoding="async" draggable="false" /></span>
            </button>;
          })}</div>)}
        </div>

        <div className="mobile-marble-controls">
          {error && <div role="alert">{error} <button type="button" onClick={retry}>RETRY</button></div>}
          <div className="mobile-marble-caption" aria-live="polite" aria-atomic="true"><h1>{work.id}</h1><p>{series.label}{collectionId ? ` · ${series.romanizedName}` : ''}</p></div>
          <div className="mobile-marble-actions">
            <button type="button" onClick={() => move(-1)} aria-label="Previous artwork">PREVIOUS</button>
            <button ref={detailsButton} type="button" className="mobile-marble-details-toggle" aria-expanded={details} aria-controls="mobile-marble-details" onClick={() => setDetails(!details)}>{details ? 'HIDE DETAILS' : 'DETAILS'}</button>
            <button type="button" onClick={() => move(1)} aria-label="Next artwork">NEXT</button>
          </div>
          {!details && thumbnails('Choose an artwork')}
          <p className="mobile-marble-count">{index + 1} / {artworks.length}</p>
        </div>
      </section>

      {details && <section id="mobile-marble-details" className="mobile-marble-details" aria-label={`Details for ${work.id}`}>
        <div className="mobile-marble-details-heading"><h2>{work.id}</h2><button type="button" onClick={() => { setDetails(false); detailsButton.current?.focus(); }}>HIDE DETAILS</button></div>
        <p className="mobile-marble-series"><span>{series.label}</span><span lang="ml">{series.malayalamName}</span><span>{series.romanizedName}</span></p>
        <div className="mobile-marble-record-links">
          <MotionLink to={`/artwork/${work.id}`} kind="focus" state={collectionId ? { fromCollection: collectionId } : { fromLandscape: true }} onClick={save}>VIEW RECORD & INQUIRE</MotionLink>
          <MotionLink to={collectionId ? '/' : `/${work.seriesId}`} kind="portal" onClick={save}>{collectionId ? 'MARBLE HOMEPAGE' : `ENTER ${series.label}`}</MotionLink>
        </div>
        <div className="mobile-marble-details-pagination"><button type="button" onClick={() => move(-1)}>PREVIOUS</button><span aria-live="polite">{index + 1} / {artworks.length}</span><button type="button" onClick={() => move(1)}>NEXT</button></div>
        {thumbnails('Choose an artwork while reading details')}
      </section>}
    </main>
  );
}
