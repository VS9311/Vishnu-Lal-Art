import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArtworkSummary } from '../lib/artwork';
import './Homepage.css';

const CAVE_STATE_KEY = 'vishnu-lal-cave-state-v2';
const SELECTED_WORKS = [
  { id: 'VL-A-004', x: 29, y: 38, size: 10.2, rotate: -2 },
  { id: 'VL-B-003', x: 43, y: 29, size: 9.2, rotate: 1 },
  { id: 'VL-A-016', x: 58, y: 32, size: 15.5, rotate: -1 },
  { id: 'VL-B-006', x: 76, y: 36, size: 14.2, rotate: 1 },
  { id: 'VL-A-007', x: 37, y: 60, size: 9.5, rotate: 1 },
  { id: 'VL-A-012', x: 55, y: 59, size: 9.4, rotate: -1 },
  { id: 'VL-B-010', x: 74, y: 59, size: 15.2, rotate: 0 },
];
const CAMERA_ROUTE = [
  { at: 0, x: 0, y: 0, scale: 1 },
  { at: 0.18, x: 3, y: 0, scale: 1.08 },
  { at: 0.38, x: -7, y: -3, scale: 1.11 },
  { at: 0.56, x: -3, y: -8, scale: 1.12 },
  { at: 0.76, x: 7, y: -6, scale: 1.1 },
  { at: 1, x: -4, y: -1, scale: 1.08 },
];
const VERIFIED_OBSERVATIONS = {
  'VL-B-006': 'Large enclosing boundary. Strong vertical axis on the left.',
};

function interpolateCamera(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  let from = CAMERA_ROUTE[0];
  let to = CAMERA_ROUTE[CAMERA_ROUTE.length - 1];
  for (let index = 1; index < CAMERA_ROUTE.length; index += 1) {
    if (clamped <= CAMERA_ROUTE[index].at) {
      from = CAMERA_ROUTE[index - 1];
      to = CAMERA_ROUTE[index];
      break;
    }
  }
  const amount = (clamped - from.at) / (to.at - from.at || 1);
  const smooth = amount * amount * (3 - (2 * amount));
  return {
    x: from.x + ((to.x - from.x) * smooth),
    y: from.y + ((to.y - from.y) * smooth),
    scale: from.scale + ((to.scale - from.scale) * smooth),
  };
}

export default function Homepage() {
  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const progressRef = useRef(0);
  const restorationStartedRef = useRef(false);
  const [focusedId, setFocusedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSeries, setActiveSeries] = useState(null);
  const works = useMemo(
    () => SELECTED_WORKS.map((work) => ({ ...work, artwork: getArtworkSummary(work.id) })).filter((work) => work.artwork),
    [],
  );
  const focusedIndex = works.findIndex((work) => work.id === focusedId);
  const focusedWork = focusedIndex >= 0 ? works[focusedIndex] : null;

  const applyCamera = useCallback((camera, immediate = false) => {
    const world = worldRef.current;
    if (!world) return;
    world.style.setProperty('--camera-x', `${camera.x}vw`);
    world.style.setProperty('--camera-y', `${camera.y}vh`);
    world.style.setProperty('--camera-scale', camera.scale);
    world.classList.toggle('is-immediate', immediate);
    if (immediate) requestAnimationFrame(() => world.classList.remove('is-immediate'));
  }, []);

  const applyRouteCamera = useCallback((progress, immediate = false) => {
    progressRef.current = progress;
    applyCamera(interpolateCamera(progress), immediate);
  }, [applyCamera]);

  const persistState = useCallback((nextFocusedId = focusedId, nextDrawerOpen = drawerOpen) => {
    sessionStorage.setItem(CAVE_STATE_KEY, JSON.stringify({
      scrollY: window.scrollY,
      focusedId: nextFocusedId,
      drawerOpen: nextDrawerOpen,
    }));
  }, [drawerOpen, focusedId]);

  const focusWork = useCallback((id, openDrawer = false) => {
    const work = works.find((candidate) => candidate.id === id);
    if (!work) return;
    setFocusedId(id);
    setDrawerOpen(openDrawer);
    setActiveSeries(work.artwork.seriesId);
    applyCamera({ x: 62.72 - (1.36 * work.x), y: 67.28 - (1.36 * work.y), scale: 1.36 });
    persistState(id, openDrawer);
  }, [applyCamera, persistState, works]);

  const closeFocus = useCallback(() => {
    setDrawerOpen(false);
    setFocusedId(null);
    applyRouteCamera(progressRef.current);
    persistState(null, false);
  }, [applyRouteCamera, persistState]);

  useEffect(() => {
    if (restorationStartedRef.current) return undefined;
    restorationStartedRef.current = true;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(CAVE_STATE_KEY)); } catch { saved = null; }
    requestAnimationFrame(() => {
      if (Number.isFinite(saved?.scrollY)) window.scrollTo(0, saved.scrollY);
      const scene = sceneRef.current;
      const range = scene ? Math.max(1, scene.offsetHeight - window.innerHeight) : 1;
      const progress = scene ? Math.min(1, Math.max(0, -scene.getBoundingClientRect().top / range)) : 0;
      applyRouteCamera(progress, true);
      if (saved?.focusedId && works.some((work) => work.id === saved.focusedId)) {
        focusWork(saved.focusedId, Boolean(saved.drawerOpen));
      }
    });
    return () => { window.history.scrollRestoration = previousRestoration; };
  }, [applyRouteCamera, focusWork, works]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scene = sceneRef.current;
      if (!scene) return;
      const range = Math.max(1, scene.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -scene.getBoundingClientRect().top / range));
      progressRef.current = progress;
      if (!focusedId) applyRouteCamera(progress);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pagehide', persistState);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pagehide', persistState);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [applyRouteCamera, focusedId, persistState]);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape' && focusedId) closeFocus(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeFocus, focusedId]);

  const travelTo = (progress, seriesId = null) => {
    closeFocus();
    setActiveSeries(seriesId);
    const scene = sceneRef.current;
    if (!scene) return;
    const range = Math.max(1, scene.offsetHeight - window.innerHeight);
    window.scrollTo({ top: scene.offsetTop + (range * progress), behavior: 'smooth' });
  };
  const moveFocus = (direction) => {
    if (!works.length) return;
    focusWork(works[(focusedIndex + direction + works.length) % works.length].id, true);
  };
  const openFieldNote = () => {
    if (!focusedId) return;
    setDrawerOpen(true);
    persistState(focusedId, true);
  };

  return (
    <main id="main-content" className={`cave-home${focusedId ? ' has-focus' : ''}`}>
      <section ref={sceneRef} className="cave-scroll-scene" aria-label="Vishnu Lal cave encounter">
        <div className="cave-viewport">
          <div ref={worldRef} className="cave-world">
            <img className="cave-environment" src="/home-cave/cave-environment-v2.webp" alt="A deep limestone chamber with broad illuminated stone slabs" width="1536" height="1024" fetchPriority="high" />
            <div className="cave-artwork-field" aria-label="Selected Vishnu Lal works presented as artifact plates">
              {works.map((work, index) => (
                <button key={work.id} type="button" className={`cave-mark${focusedId === work.id ? ' is-focused' : ''}`}
                  style={{ '--mark-x': `${work.x}%`, '--mark-y': `${work.y}%`, '--mark-size': `${work.size}vw`, '--mark-rotate': `${work.rotate}deg`, '--mark-delay': `${index * 70}ms` }}
                  onClick={() => (focusedId === work.id ? openFieldNote() : focusWork(work.id))} aria-label={`Approach artwork ${work.id}`} aria-pressed={focusedId === work.id}>
                  <img src={`/artworks/${work.id}/900.webp`} srcSet={`/artworks/${work.id}/480.webp 480w, /artworks/${work.id}/900.webp 900w`} sizes="(max-width: 700px) 34vw, 12vw" width={work.artwork.width} height={work.artwork.height} alt="" loading="eager" decoding="sync" />
                  <span className="cave-mark-id">{work.id}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="cave-edge-darkness" aria-hidden="true" />

          <nav className="cave-index" aria-label="Cave index">
            <div className="cave-identity"><span className="cave-name">VISHNU LAL</span><span>THE ARCHIVE</span></div>
            <button type="button" className="cave-index-enter" onClick={() => travelTo(0)}><span aria-hidden="true">●</span> ENTER</button>
            <button type="button" className={activeSeries === 'series-i' ? 'is-active' : ''} onClick={() => travelTo(0.28, 'series-i')}>
              <span>SERIES I</span><strong lang="ml">അനാമം</strong><em>ANAMAM</em>
            </button>
            <button type="button" className={activeSeries === 'series-ii' ? 'is-active' : ''} onClick={() => travelTo(0.7, 'series-ii')}>
              <span>SERIES II</span><strong lang="ml">അന്തരാളം</strong><em>ANTHARALAM</em>
            </button>
            <Link className="cave-archive-link" to="/archive" onClick={() => persistState()}><span>THE ARCHIVE</span><em>28 WORKS</em></Link>
            <div className="cave-index-placeholders" aria-label="Future archive sections">
              <span>ABOUT THE PRACTICE</span>
              <span>NOTES / VOICE</span>
              <span>CONTACT / ACCESS</span>
            </div>
            {activeSeries && <Link className="cave-enter-series" to={`/archive/${activeSeries}`} onClick={() => persistState()}>ENTER FULL {activeSeries === 'series-i' ? 'SERIES I' : 'SERIES II'} <span aria-hidden="true">→</span></Link>}
          </nav>

          <div className="cave-position" aria-hidden="true"><span>SCROLL TO EXPLORE</span><i /></div>

          {focusedWork && !drawerOpen && <button type="button" className="cave-field-note-trigger" onClick={openFieldNote}>
            FIELD NOTE <strong>{focusedWork.id}</strong> <span aria-hidden="true">→</span>
          </button>}

          <aside className={`cave-field-note${drawerOpen && focusedWork ? ' is-open' : ''}`} aria-hidden={!drawerOpen}>
            {focusedWork && <div className="field-note-inner">
              <button type="button" className="field-note-close" onClick={closeFocus} aria-label="Close field note">CLOSE</button>
              <p className="field-note-kicker">FIELD NOTE</p>
              <h1>{focusedWork.id}</h1>
              <div className="field-note-series">
                <span>{focusedWork.artwork.seriesId === 'series-i' ? 'SERIES I' : 'SERIES II'}</span>
                <strong lang="ml">{focusedWork.artwork.seriesId === 'series-i' ? 'അനാമം' : 'അന്തരാളം'}</strong>
                <em>{focusedWork.artwork.seriesId === 'series-i' ? 'ANAMAM' : 'ANTHARALAM'}</em>
              </div>
              {VERIFIED_OBSERVATIONS[focusedWork.id] && <p className="field-note-observation">{VERIFIED_OBSERVATIONS[focusedWork.id]}</p>}
              <div className="field-note-actions">
                <Link to={`/archive/${focusedWork.id}`} state={{ fromCave: true }} onClick={() => persistState(focusedWork.id, true)}>VIEW ARCHIVE RECORD <span aria-hidden="true">→</span></Link>
                <Link to={`/archive/${focusedWork.artwork.seriesId}`} onClick={() => persistState(focusedWork.id, true)}>ENTER {focusedWork.artwork.seriesId === 'series-i' ? 'SERIES I' : 'SERIES II'} <span aria-hidden="true">→</span></Link>
              </div>
              <div className="field-note-pagination">
                <button type="button" onClick={() => moveFocus(-1)}>PREVIOUS</button><span>{String(focusedIndex + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}</span><button type="button" onClick={() => moveFocus(1)}>NEXT</button>
              </div>
            </div>}
          </aside>
        </div>
      </section>
    </main>
  );
}
