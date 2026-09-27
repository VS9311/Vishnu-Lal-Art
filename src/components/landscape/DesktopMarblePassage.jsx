import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReliefBay from './ReliefBay';
import { buildReliefBays } from './reliefLayout';
import './DesktopMarblePassage.css';

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

export default function DesktopMarblePassage({ series, artworks, restoreArtworkId, restoreFromHistory }) {
  const sceneRef = useRef(null);
  const frameRef = useRef(null);
  const worldRef = useRef(null);
  const artworkRefs = useRef(new Map());
  const travelRef = useRef(0);
  const [region, setRegion] = useState(1);
  const [imageDimensions, setImageDimensions] = useState({});
  const bays = buildReliefBays(artworks.map(work => ({ ...work, ...imageDimensions[work.id] })), series.id);
  const measureImage = (event) => {
    const image = event.target;
    const id = image.closest('.collection-paper')?.id.replace('marble-', '');
    if (!id || !image.naturalWidth || !image.naturalHeight) return;
    setImageDimensions(current => {
      if (current[id]?.width === image.naturalWidth && current[id]?.height === image.naturalHeight) return current;
      return { ...current, [id]: { width: image.naturalWidth, height: image.naturalHeight } };
    });
  };

  const saveSelection = useCallback((id) => {
    try { sessionStorage.setItem(`marble-collection:${series.id}`, id); } catch { /* Restoration is optional. */ }
  }, [series.id]);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const frame = frameRef.current;
    const world = worldRef.current;
    if (!scene || !frame || !world) return undefined;

    const syncToScroll = () => {
      const travel = travelRef.current;
      const progress = travel ? clamp((window.scrollY - scene.offsetTop) / travel) : 0;
      world.style.transform = `translate3d(${-(progress * travel)}px, 0, 0)`;
      setRegion(Math.min(bays.length, 1 + Math.floor(progress * bays.length)));
      frame.style.setProperty('--passage-progress', progress);
    };

    const measure = () => {
      const travel = Math.max(world.scrollWidth - frame.clientWidth, 0);
      travelRef.current = travel;
      scene.style.height = `${window.innerHeight + travel}px`;
      syncToScroll();
    };

    let savedArtworkId = restoreArtworkId;
    if (!savedArtworkId && restoreFromHistory) {
      try { savedArtworkId = sessionStorage.getItem(`marble-collection:${series.id}`); } catch { /* Restoration is optional. */ }
    }

    const restoreFrame = window.requestAnimationFrame(() => {
      measure();
      const restoredNode = savedArtworkId ? artworkRefs.current.get(savedArtworkId) : null;
      if (restoredNode) {
        const restoredX = clamp(
          restoredNode.getBoundingClientRect().left - world.getBoundingClientRect().left + (restoredNode.offsetWidth / 2) - (frame.clientWidth / 2) - 100,
          0,
          travelRef.current,
        );
        world.style.transform = `translate3d(${-restoredX}px, 0, 0)`;
        window.scrollTo({ top: scene.offsetTop + restoredX, left: 0, behavior: 'instant' });
      } else {
        window.scrollTo({ top: scene.offsetTop, left: 0, behavior: 'instant' });
      }
      syncToScroll();
    });

    window.addEventListener('scroll', syncToScroll, { passive: true });
    window.addEventListener('resize', measure);
    const horizontalWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? frame.clientWidth : 1;
      window.scrollBy({ top: event.deltaX * unit, behavior: 'instant' });
    };
    frame.addEventListener('wheel', horizontalWheel, { passive: false });
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.removeEventListener('scroll', syncToScroll);
      window.removeEventListener('resize', measure);
      frame.removeEventListener('wheel', horizontalWheel);
    };
  }, [restoreArtworkId, restoreFromHistory, series.id, bays.length]);

  return (
    <main id="main-content" className="landscape-homepage marble-passage-page" onLoadCapture={measureImage}>
      <aside className="marble-passage-index" aria-label={`${series.label} collection`}>
        <Link className="marble-passage-brand" to="/homepage-2">
          <strong>VISHNU LAL</strong>
          <span>THE ARCHIVE</span>
        </Link>
        <div className="marble-passage-series">
          <span>{series.label}</span>
          <strong lang="ml">{series.malayalamName}</strong>
          <em>{series.romanizedName}</em>
          <small>{series.totalWorks || 17} WORKS</small>
        </div>
        <Link className="marble-passage-return" to="/homepage-2">RETURN TO ARCHIVE</Link>
        <p>VERTICAL SCROLL<br />MOVES THROUGH THE PASSAGE</p>
      </aside>

      <section ref={sceneRef} className="marble-passage-scene" aria-label={`${series.label} relief wall`}>
        <div ref={frameRef} className="marble-passage-frame">
          <div ref={worldRef} className="marble-passage-world">
            {bays.map((bay, index) => <ReliefBay key={bay.key} bay={bay} index={index} seriesId={series.id} artworkRefs={artworkRefs} saveSelection={saveSelection} />)}
          </div>

          <div className="marble-passage-progress" aria-hidden="true">
            <span>{String(region).padStart(2, '0')} / {String(bays.length).padStart(2, '0')}</span>
            <i><b /></i>
            <em>SCROLL TO MOVE →</em>
          </div>
        </div>
      </section>
    </main>
  );
}
