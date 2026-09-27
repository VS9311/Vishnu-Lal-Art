import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import LandscapeArtworkNode from '../components/landscape/LandscapeArtworkNode';
import { calculateDesktopFocusTransform, DESKTOP_FOCUS } from '../components/landscape/desktopFocusCamera';
import LandscapeIndex from '../components/landscape/LandscapeIndex';
import LandscapeRecordPanel from '../components/landscape/LandscapeRecordPanel';
import MobileMarbleHomepage from '../components/landscape/MobileMarbleHomepage';
import { getArtworkSummary } from '../lib/artwork';
import './LandscapeHomepage.css';

const WORLD = { width: 3344, height: 1882 };
const STATE_KEY = 'vishnu-lal-archive:homepage-2';
const SELECTED_IDS = ['VL-A-007', 'VL-A-018', 'VL-B-002', 'VL-B-006', 'VL-B-011', 'VL-B-010'];
const FOCUS_PHASE = Object.freeze({
  overview: 'OVERVIEW',
  focusing: 'FOCUSING',
  focused: 'FOCUSED',
  returning: 'RETURNING',
});

const PLACEMENTS = {
  // y is the contact edge on the stone, in the 3344 × 1882 background space.
  // Bottom anchoring keeps the contact point fixed across image ratios and hover.
  'VL-A-007': { x: 1040, y: 844, width: 370, rotate: -0.35, presentation: 'upright', mobileBase: 860, mobileLeft: 52, mobileWidth: 210, priority: true },
  'VL-A-018': { x: 2570, y: 744, width: 330, rotate: 0.35, presentation: 'upright', mobileBase: 1440, mobileLeft: 58, mobileWidth: 210, priority: true },
  'VL-B-002': { x: 1800, y: 914, width: 320, rotate: -0.3, presentation: 'upright', mobileBase: 2020, mobileLeft: 48, mobileWidth: 210 },
  'VL-B-006': { x: 1140, y: 1470, width: 360, rotate: 0.35, presentation: 'leaning', mobileBase: 2600, mobileLeft: 55, mobileWidth: 225 },
  'VL-B-011': { x: 1840, y: 1580, width: 490, rotate: -0.35, presentation: 'upright', mobileBase: 3180, mobileLeft: 47, mobileWidth: 255 },
  'VL-B-010': { x: 2680, y: 1590, width: 410, rotate: 0.3, presentation: 'upright', mobileBase: 3760, mobileLeft: 55, mobileWidth: 255 },
};

const CAMERA_ROUTE = [
  { x: 1672, y: 941, scale: 0.48 },
  { x: 1040, y: 820, scale: 0.66 },
  { x: 1780, y: 980, scale: 0.64 },
  { x: 2600, y: 830, scale: 0.66 },
  { x: 2440, y: 1300, scale: 0.66 },
];

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

function interpolateCamera(progress) {
  const scaled = clamp(progress) * (CAMERA_ROUTE.length - 1);
  const index = Math.min(Math.floor(scaled), CAMERA_ROUTE.length - 2);
  const local = scaled - index;
  const start = CAMERA_ROUTE[index];
  const end = CAMERA_ROUTE[index + 1];
  const ease = local * local * (3 - (2 * local));
  return {
    x: start.x + ((end.x - start.x) * ease),
    y: start.y + ((end.y - start.y) * ease),
    scale: start.scale + ((end.scale - start.scale) * ease),
  };
}

function openingScale() {
  const usableWidth = Math.max(window.innerWidth - 184, 1);
  const widthScale = (usableWidth * 0.83) / WORLD.width;
  const heightScale = (window.innerHeight * 0.82) / WORLD.height;
  return clamp(Math.min(widthScale, heightScale), 0.48, 0.65);
}

function readSavedState() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STATE_KEY));
  } catch {
    return null;
  }
}

const subscribeMobile = (callback) => {
  const query = window.matchMedia('(max-width: 800px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};

export default function LandscapeHomepage() {
  const isMobile = useSyncExternalStore(subscribeMobile, () => window.matchMedia('(max-width: 800px)').matches, () => false);
  return isMobile
    ? <MobileMarbleHomepage artworkIds={SELECTED_IDS} />
    : <DesktopLandscapeHomepage />;
}

function DesktopLandscapeHomepage() {
  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const artworkRefs = useRef(new Map());
  const progressRef = useRef(0);
  const location = useLocation();
  const navigationType = useNavigationType();
  const shouldRestore = navigationType === 'POP' || location.state?.restoreLandscape;
  const initialState = useMemo(() => (shouldRestore ? readSavedState() : null), [shouldRestore]);
  const [selectedId, setSelectedId] = useState(SELECTED_IDS.includes(initialState?.selectedId) ? initialState.selectedId : null);
  const [lastSelectedId, setLastSelectedId] = useState(SELECTED_IDS.includes(initialState?.selectedId) ? initialState.selectedId : null);
  const [activeArtworkId, setActiveArtworkId] = useState(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const [focusPhase, setFocusPhase] = useState(
    SELECTED_IDS.includes(initialState?.selectedId) ? FOCUS_PHASE.focusing : FOCUS_PHASE.overview,
  );

  const artworks = useMemo(
    () => SELECTED_IDS.map((id) => getArtworkSummary(id)).filter(Boolean),
    [],
  );
  const selectedIndex = artworks.findIndex((artwork) => artwork.id === selectedId);
  const selectedArtwork = selectedIndex >= 0 ? artworks[selectedIndex] : null;
  const panelArtwork = selectedArtwork || artworks.find((artwork) => artwork.id === lastSelectedId) || null;
  const panelPosition = artworks.findIndex((artwork) => artwork.id === panelArtwork?.id) + 1;

  const registerNode = useCallback((id, node) => {
    if (node) artworkRefs.current.set(id, node);
    else artworkRefs.current.delete(id);
  }, []);

  const saveState = useCallback((nextSelectedId = selectedId) => {
    try {
      window.sessionStorage.setItem(STATE_KEY, JSON.stringify({
        scrollY: window.scrollY,
        selectedId: nextSelectedId,
        progress: progressRef.current,
      }));
    } catch {
      // The landscape remains fully usable without session restoration.
    }
  }, [selectedId]);

  const applyCamera = useCallback((camera) => {
    const world = worldRef.current;
    if (!world) return;
    const translateX = (window.innerWidth / 2) - (camera.x * camera.scale);
    const translateY = (window.innerHeight / 2) - (camera.y * camera.scale);
    world.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${camera.scale})`;
  }, []);

  const applyFocusTransform = useCallback((transform) => {
    const world = worldRef.current;
    if (!world) return;
    world.style.transform = `translate3d(${transform.translateX}px, ${transform.translateY}px, 0) scale(${transform.scale})`;
  }, []);

  const renderRouteCamera = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia('(max-width: 800px)').matches) return;
    const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-scene.getBoundingClientRect().top / travel);
    progressRef.current = progress;
    setActiveRegion(progress < 0.12 ? 'all' : progress < 0.54 ? 'series-i' : 'series-ii');

    if (selectedId) {
      const placement = PLACEMENTS[selectedId];
      const nodeHeight = artworkRefs.current.get(selectedId)?.offsetHeight || placement.width;
      const viewportWidth = scene.clientWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = Math.min(390, viewportWidth * 0.31);
      applyFocusTransform(calculateDesktopFocusTransform({
        viewportWidth,
        viewportHeight,
        worldWidth: WORLD.width,
        worldHeight: WORLD.height,
        artworkX: placement.x,
        artworkY: placement.y,
        artworkHeight: nodeHeight,
        panelWidth,
      }));
    } else {
      const camera = interpolateCamera(progress);
      // The opening view grows with the usable viewport; the authored travel path stays intact.
      if (progress < 0.25) camera.scale += (openingScale() - CAMERA_ROUTE[0].scale) * (1 - progress / 0.25);
      applyCamera(camera);
    }
  }, [applyCamera, applyFocusTransform, selectedId]);

  useLayoutEffect(() => {
    if (!initialState) {
      window.scrollTo({ top: 0, left: 0 });
      return undefined;
    }
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: initialState.scrollY || 0, left: 0, behavior: 'auto' });
        renderRouteCamera();
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [initialState, renderRouteCamera]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      renderRouteCamera();
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    const saveOnPageHide = () => saveState();
    window.addEventListener('pagehide', saveOnPageHide);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('pagehide', saveOnPageHide);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [renderRouteCamera, saveState]);

  const selectArtwork = useCallback((id) => {
    if (focusPhase === FOCUS_PHASE.focusing || focusPhase === FOCUS_PHASE.returning || selectedId === id) return;
    setFocusPhase(FOCUS_PHASE.focusing);
    setSelectedId(id);
    setLastSelectedId(id);
    setActiveArtworkId(id);
  }, [focusPhase, selectedId]);

  const closeFocus = useCallback((restoreFocus = false) => {
    if (!selectedId || focusPhase !== FOCUS_PHASE.focused) return;
    if (restoreFocus && selectedId) artworkRefs.current.get(selectedId)?.querySelector('button')?.focus();
    setFocusPhase(FOCUS_PHASE.returning);
    setSelectedId(null);
    setActiveArtworkId(null);
  }, [focusPhase, selectedId]);

  const settleFocusPhase = useCallback(() => {
    setFocusPhase((currentPhase) => {
      if (currentPhase === FOCUS_PHASE.focusing) return FOCUS_PHASE.focused;
      if (currentPhase === FOCUS_PHASE.returning) return FOCUS_PHASE.overview;
      return currentPhase;
    });
  }, []);

  const handleWorldTransitionEnd = useCallback((event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    settleFocusPhase();
  }, [settleFocusPhase]);

  useEffect(() => {
    if (focusPhase !== FOCUS_PHASE.focusing && focusPhase !== FOCUS_PHASE.returning) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(settleFocusPhase, reducedMotion ? 0 : DESKTOP_FOCUS.durationMs + 120);
    return () => window.clearTimeout(timeout);
  }, [focusPhase, settleFocusPhase]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && selectedId) closeFocus(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, closeFocus]);

  useEffect(() => {
    if (!selectedId) return undefined;
    const closeOnOutsidePointer = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.landscape-record-panel, .landscape-artwork')) return;
      closeFocus();
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [selectedId, closeFocus]);

  const moveSelection = useCallback((direction) => {
    if (!artworks.length) return;
    const nextIndex = (selectedIndex + direction + artworks.length) % artworks.length;
    selectArtwork(artworks[nextIndex].id);
  }, [artworks, selectedIndex, selectArtwork]);

  const travelTo = useCallback((progress) => {
    closeFocus();
    const scene = sceneRef.current;
    if (!scene) return;
    const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
    window.scrollTo({
      top: scene.offsetTop + (travel * progress),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [closeFocus]);

  return (
    <main
      id="main-content"
      className={`landscape-homepage${selectedId ? ' has-selection' : ''}`}
      data-focus-state={focusPhase}
      aria-busy={focusPhase === FOCUS_PHASE.focusing || focusPhase === FOCUS_PHASE.returning}
    >
      <section ref={sceneRef} className="landscape-scene" aria-label="Pale Archive landscape exploration">
        <div className="landscape-frame">
          <div
            ref={worldRef}
            className="landscape-world"
            style={{ '--world-width': `${WORLD.width}px`, '--world-height': `${WORLD.height}px` }}
            onTransitionEnd={handleWorldTransitionEnd}
          >
            <img className="landscape-world-image" src="/homepage-2/pale-archive-podium-landscape-v2.png" alt="" width="1672" height="941" fetchPriority="high" />
            <div className="landscape-region-label landscape-region-label--one" aria-hidden="true">SERIES I / ANAMAM</div>
            <div className="landscape-region-label landscape-region-label--two" aria-hidden="true">SERIES II / ANTHARALAM</div>
            {artworks.map((artwork) => (
              <LandscapeArtworkNode
                key={artwork.id}
                artwork={artwork}
                placement={PLACEMENTS[artwork.id]}
                selected={selectedId === artwork.id}
                registerNode={registerNode}
                onSelect={selectArtwork}
              />
            ))}
          </div>

          <LandscapeIndex activeRegion={activeRegion} activeArtworkId={activeArtworkId} onTravel={travelTo} />
          <div className="landscape-travel-note" aria-hidden="true"><span>SCROLL TO MOVE THROUGH THE ARCHIVE</span><i /></div>
          <LandscapeRecordPanel
            artwork={panelArtwork}
            isOpen={Boolean(selectedArtwork)}
            position={panelPosition}
            total={artworks.length}
            onClose={() => closeFocus(true)}
            onMove={moveSelection}
            onOpenRecord={() => saveState(selectedId)}
          />
        </div>
      </section>
    </main>
  );
}
