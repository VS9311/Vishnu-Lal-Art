import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { getArtworkSummary, getSeriesData } from '../../lib/artwork';
import useMarbleNavigation from './useMarbleNavigation';
import { marbleImageSource } from './marbleImageReadiness';
import './MobileMarbleHomepage.css';
import { MotionLink } from '../../motion/RouteMotion';
import { useRouteMotion } from '../../motion/routeMotionContext';
import MobileArchiveHeader from './MobileArchiveHeader';
import { formatArtworkDisplayId } from '../../lib/artworkDisplay';

const STATE_KEY = 'vishnu-lal-archive:mobile-marble-v1';

export function MobileMarbleEmptySeries({ series }) {
  return <main id="main-content" className="landscape-homepage mobile-marble-homepage mobile-marble-collection">
    <section className="mobile-marble-scene" aria-label={`${series.label} artwork collection`}>
      <img className="mobile-marble-backdrop" src="/homepage-2/mobile-marble-podium-v1.png" alt="" fetchPriority="high" />
      <MobileArchiveHeader />
      <div className="mobile-marble-empty-collection">
        <p>{series.label}</p>
        <h1 lang="ml">{series.malayalamName}</h1>
        <h2>{series.romanizedName}</h2>
        {series.summary && <p className="mobile-marble-empty-summary">{series.summary}</p>}
        <span>No published works yet.</span>
      </div>
    </section>
  </main>;
}

function restoreState(allowed, count, stateKey) {
  if (!allowed) return { index: 0 };
  try {
    const saved = JSON.parse(sessionStorage.getItem(stateKey));
    if (Number.isInteger(saved?.index) && saved.index >= 0 && saved.index < count) return saved;
  } catch { /* Browsing works without storage. */ }
  return { index: 0 };
}

export default function MobileMarbleHomepage({ artworkIds, collectionId }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const artworks = useMemo(() => artworkIds.map(getArtworkSummary).filter(Boolean), [artworkIds]);
  const stateKey = collectionId ? `${STATE_KEY}:${collectionId}` : STATE_KEY;
  const [initial] = useState(() => {
    const selected = artworks.findIndex((artwork) => artwork.id === location.state?.artworkId);
    return selected >= 0 ? { index: selected } : restoreState(navigationType === 'POP' || location.state?.restoreLandscape, artworks.length, stateKey);
  });
  const { state: navigation, index, busy, move, bindSlot, bindScene, error, retry } = useMarbleNavigation(initial.index, artworks);
  const { moveTo } = useRouteMotion();
  const pointer = useRef(null);
  const didSwipe = useRef(false);
  const touchTapUntil = useRef(0);
  const work = artworks[index];
  const series = getSeriesData(work.seriesId);
  const save = (selectedIndex = index) => {
    try { sessionStorage.setItem(stateKey, JSON.stringify({ index: selectedIndex })); } catch { /* Optional storage. */ }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
        <MobileArchiveHeader />

        <div className={`mobile-marble-stage${busy ? ' is-moving' : ''}${['BOOT', 'ERROR'].includes(navigation.phase) ? ' is-unready' : ''}`} data-navigation-state={navigation.phase} data-navigation-phase={navigation.phase} aria-label="Swipe left or right to browse artworks" aria-busy={busy}
          onPointerDown={(event) => {
            if (['BOOT', 'ERROR'].includes(navigation.phase) || !event.isPrimary || event.button !== 0) return;
            didSwipe.current = false;
            pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
            // Capture on the pressed button so an ordinary tap still activates it.
            const captureTarget = event.target.closest('button') || event.currentTarget;
            captureTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={recognizeSwipe}
          onPointerUp={(event) => {
            recognizeSwipe(event);
            const tap = pointer.current?.id === event.pointerId
              && Math.abs(event.clientX - pointer.current.x) < 10
              && Math.abs(event.clientY - pointer.current.y) < 10;
            pointer.current = null;
            if (tap && event.pointerType === 'touch') {
              // Handle taps after a gesture explicitly: mobile browsers may suppress
              // the compatibility click following a rapid sequence of touch swipes.
              event.preventDefault();
              touchTapUntil.current = performance.now() + 500;
              event.target.closest('button')?.click();
            }
          }}
          onPointerCancel={() => { pointer.current = null; }}
          onClickCapture={(event) => {
            if (didSwipe.current || (event.nativeEvent.isTrusted && event.detail > 0 && performance.now() < touchTapUntil.current)) {
              event.preventDefault(); event.stopPropagation(); didSwipe.current = false;
            }
          }}
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
            return <button key={slot.key} ref={node => bindSlot(`${scene}:${slot.key}`, node)} type="button" data-slot={slot.key} data-artwork-id={artwork.id} data-anchor={positionAnchor} style={spareHidden ? { visibility: 'hidden' } : undefined} className={`mobile-marble-work mobile-marble-work--${positionAnchor}`} aria-hidden={!visible} tabIndex={visible && !busy ? 0 : -1} aria-label={settledAnchor === 'center' ? `Open artwork ${formatArtworkDisplayId(artwork.id)}` : `${settledAnchor === 'left' ? 'Previous' : 'Next'} artwork, ${formatArtworkDisplayId(artwork.id)}`}
              onClick={() => {
                if (settledAnchor !== 'center') {
                  move(settledAnchor === 'left' ? -1 : 1);
                } else if (!busy) {
                  save(slot.index);
                  moveTo(`/artwork/${artwork.id}`, { kind: 'focus', state: collectionId ? { fromCollection: collectionId } : { fromLandscape: true } });
                }
              }}>
              <span className="landscape-artwork-sheet"><img src={marbleImageSource(artwork)} width={artwork.width} height={artwork.height} alt={`Artwork ${artwork.id}`} className="landscape-artwork-image" decoding="async" draggable="false" /></span>
            </button>;
          })}</div>)}
        </div>

        <div className="mobile-marble-controls">
          {error && <div role="alert">{error} <button type="button" onClick={retry}>RETRY</button></div>}
          <div className="mobile-marble-caption" aria-live="polite" aria-atomic="true"><h1 lang={collectionId ? "ml" : undefined} className={`mobile-marble-series-title${!collectionId ? " is-english" : ""}`}>{collectionId ? series.malayalamName : series.romanizedName}</h1><p>{collectionId ? formatArtworkDisplayId(work.id) : series.label}</p></div>
          <div className="mobile-marble-actions">
            <button type="button" onClick={() => move(-1)} aria-label="Previous artwork">PREVIOUS</button>
            <MotionLink className="mobile-marble-open-artwork" to={`/artwork/${work.id}`} kind="focus" state={collectionId ? { fromCollection: collectionId } : { fromLandscape: true }} onClick={(event) => { if (busy) event.preventDefault(); else save(); }}>OPEN ARTWORK</MotionLink>
            <button type="button" onClick={() => move(1)} aria-label="Next artwork">NEXT</button>
          </div>
          <p className="mobile-marble-count">{index + 1} / {artworks.length}</p>
        </div>
      </section>

    </main>
  );
}
