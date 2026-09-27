import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import ArchiveMapArtwork from '../components/archive-map/ArchiveMapArtwork';
import ArchiveMapIndex from '../components/archive-map/ArchiveMapIndex';
import ArchiveMapPanel from '../components/archive-map/ArchiveMapPanel';
import { getArtworkSummary, getSeriesData } from '../lib/artwork';
import './ArchiveMapLab.css';

const DESKTOP_WORLD = { width: 3600, height: 2400 };
const MOBILE_WORLD = { width: 1080, height: 3900 };
const STATE_KEY = 'vishnu-lal-archive:archive-map-lab';
const WORK_IDS = [
  'VL-A-001', 'VL-A-004', 'VL-A-007', 'VL-A-010', 'VL-A-014', 'VL-A-016',
  'VL-B-002', 'VL-B-003', 'VL-B-006', 'VL-B-008', 'VL-B-010', 'VL-B-012',
];

const PLACEMENTS = {
  'VL-A-001': { x: 520, y: 520, width: 250, mobileX: 280, mobileY: 610, mobileWidth: 220, rotate: -0.45, priority: true },
  'VL-A-004': { x: 1020, y: 360, width: 205, mobileX: 760, mobileY: 430, mobileWidth: 180, rotate: 0.4, priority: true },
  'VL-A-007': { x: 1380, y: 690, width: 320, mobileX: 570, mobileY: 1040, mobileWidth: 270, rotate: -0.25, priority: true },
  'VL-A-010': { x: 640, y: 1120, width: 190, mobileX: 260, mobileY: 1420, mobileWidth: 175, rotate: 0.6 },
  'VL-A-014': { x: 1110, y: 1260, width: 220, mobileX: 780, mobileY: 1510, mobileWidth: 190, rotate: -0.55 },
  'VL-A-016': { x: 1530, y: 1050, width: 360, mobileX: 520, mobileY: 1810, mobileWidth: 310, rotate: 0.25 },
  'VL-B-003': { x: 2390, y: 1260, width: 225, mobileX: 260, mobileY: 2470, mobileWidth: 205, rotate: -0.45 },
  'VL-B-002': { x: 2780, y: 940, width: 360, mobileX: 760, mobileY: 2360, mobileWidth: 285, rotate: 0.35 },
  'VL-B-006': { x: 3190, y: 1320, width: 370, mobileX: 530, mobileY: 2790, mobileWidth: 295, rotate: -0.3 },
  'VL-B-008': { x: 2440, y: 1780, width: 230, mobileX: 250, mobileY: 3190, mobileWidth: 195, rotate: 0.5 },
  'VL-B-010': { x: 2920, y: 1940, width: 380, mobileX: 750, mobileY: 3320, mobileWidth: 305, rotate: -0.25 },
  'VL-B-012': { x: 3440, y: 1870, width: 310, mobileX: 480, mobileY: 3700, mobileWidth: 250, rotate: 0.35 },
};

const GUIDED_CAMERAS = {
  desktop: {
    all: { x: 1800, y: 1200, scale: 0.36 },
    'series-i': { x: 1030, y: 790, scale: 0.58 },
    'series-ii': { x: 2860, y: 1460, scale: 0.58 },
  },
  mobile: {
    all: { x: 540, y: 760, scale: 0.7 },
    'series-i': { x: 540, y: 1050, scale: 0.76 },
    'series-ii': { x: 540, y: 2950, scale: 0.76 },
  },
};

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const isMobileViewport = () => window.matchMedia('(max-width: 800px)').matches;

function readSavedState() {
  try {
    return JSON.parse(window.sessionStorage.getItem(STATE_KEY));
  } catch {
    return null;
  }
}

export default function ArchiveMapLab() {
  const frameRef = useRef(null);
  const worldRef = useRef(null);
  const cameraRef = useRef(GUIDED_CAMERAS.desktop.all);
  const dragRef = useRef(null);
  const guidedTimerRef = useRef(0);
  const location = useLocation();
  const navigationType = useNavigationType();
  const shouldRestore = navigationType === 'POP' || location.state?.restoreArchiveMap;
  const savedState = useMemo(() => (shouldRestore ? readSavedState() : null), [shouldRestore]);
  const selectedIdRef = useRef(savedState?.selectedId || null);
  const [selectedId, setSelectedId] = useState(savedState?.selectedId || null);
  const [indexOpen, setIndexOpen] = useState(savedState?.indexOpen || false);
  const [activeRegion, setActiveRegion] = useState(savedState?.activeRegion || 'all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [mobileMode, setMobileMode] = useState(() => isMobileViewport());
  selectedIdRef.current = selectedId;

  const artworks = useMemo(() => WORK_IDS.map((id) => getArtworkSummary(id)).filter(Boolean), []);
  const selectedIndex = artworks.findIndex((artwork) => artwork.id === selectedId);
  const selectedArtwork = selectedIndex >= 0 ? artworks[selectedIndex] : null;
  const seriesI = getSeriesData('series-i');
  const seriesII = getSeriesData('series-ii');
  const worldSize = mobileMode ? MOBILE_WORLD : DESKTOP_WORLD;

  const persistState = useCallback((nextSelectedId = selectedId) => {
    try {
      window.sessionStorage.setItem(STATE_KEY, JSON.stringify({
        camera: cameraRef.current,
        selectedId: nextSelectedId,
        indexOpen,
        activeRegion,
      }));
    } catch {
      // Session restoration is progressive enhancement; the map remains fully usable without it.
    }
  }, [activeRegion, indexOpen, selectedId]);

  const applyCamera = useCallback((nextCamera, options = {}) => {
    const world = worldRef.current;
    if (!world) return;

    const mobile = isMobileViewport();
    const dimensions = mobile ? MOBILE_WORLD : DESKTOP_WORLD;
    const panelOpen = options.panelOpen ?? Boolean(selectedIdRef.current);
    const scale = clamp(nextCamera.scale, mobile ? 0.62 : 0.36, mobile ? 0.86 : 0.68);
    const panelWidth = panelOpen && !mobile ? Math.min(340, window.innerWidth * 0.27) : 0;
    const sheetHeight = panelOpen && mobile ? Math.min(355, window.innerHeight * 0.48) : 0;
    const availableWidth = window.innerWidth - panelWidth;
    const availableHeight = window.innerHeight - sheetHeight;
    const visibleWidth = availableWidth / scale;
    const visibleHeight = availableHeight / scale;
    const minimumX = visibleWidth >= dimensions.width ? dimensions.width / 2 : visibleWidth / 2;
    const maximumX = visibleWidth >= dimensions.width ? dimensions.width / 2 : dimensions.width - (visibleWidth / 2);
    const minimumY = visibleHeight >= dimensions.height ? dimensions.height / 2 : visibleHeight / 2;
    const maximumY = visibleHeight >= dimensions.height ? dimensions.height / 2 : dimensions.height - (visibleHeight / 2);
    const camera = {
      x: clamp(nextCamera.x, minimumX, maximumX),
      y: clamp(nextCamera.y, minimumY, maximumY),
      scale,
    };
    const translateX = (availableWidth / 2) - (camera.x * scale);
    const translateY = (availableHeight / 2) - (camera.y * scale);

    if (options.guided) {
      world.classList.add('is-guided');
      window.clearTimeout(guidedTimerRef.current);
      guidedTimerRef.current = window.setTimeout(() => world.classList.remove('is-guided'), 760);
    }
    world.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
    cameraRef.current = camera;
  }, []);

  const guidedCamera = useCallback((region) => {
    const mode = isMobileViewport() ? 'mobile' : 'desktop';
    return GUIDED_CAMERAS[mode][region];
  }, []);

  const travelTo = useCallback((region) => {
    setSelectedId(null);
    setSelectedRecord(null);
    setActiveRegion(region);
    setIndexOpen(false);
    applyCamera(guidedCamera(region), { guided: true, panelOpen: false });
  }, [applyCamera, guidedCamera]);

  const selectArtwork = useCallback((id) => {
    const placement = PLACEMENTS[id];
    if (!placement) return;
    const mobile = isMobileViewport();
    const target = {
      x: mobile ? placement.mobileX : placement.x,
      y: mobile ? placement.mobileY : placement.y,
      scale: mobile ? 0.8 : 0.62,
    };
    setSelectedId(id);
    setIndexOpen(false);
    window.requestAnimationFrame(() => applyCamera(target, { guided: true, panelOpen: true }));
  }, [applyCamera]);

  const closeInspection = useCallback(() => {
    setSelectedId(null);
    setSelectedRecord(null);
    applyCamera(cameraRef.current, { guided: true, panelOpen: false });
  }, [applyCamera]);

  const moveSelection = useCallback((direction) => {
    if (!selectedArtwork) return;
    const sameSeries = artworks.filter((artwork) => artwork.seriesId === selectedArtwork.seriesId);
    const currentIndex = sameSeries.findIndex((artwork) => artwork.id === selectedArtwork.id);
    const nextIndex = (currentIndex + direction + sameSeries.length) % sameSeries.length;
    selectArtwork(sameSeries[nextIndex].id);
  }, [artworks, selectArtwork, selectedArtwork]);

  const handleWheel = useCallback((event) => {
    const camera = cameraRef.current;
    const horizontalDelta = event.shiftKey && Math.abs(event.deltaX) < 1 ? event.deltaY : event.deltaX;
    const verticalDelta = event.shiftKey ? 0 : event.deltaY;
    applyCamera({
      x: camera.x + (horizontalDelta / camera.scale),
      y: camera.y + (verticalDelta / camera.scale),
      scale: camera.scale,
    });
  }, [applyCamera]);

  const handlePointerDown = useCallback((event) => {
    if (event.button !== 0 || event.target.closest('button, a')) return;
    frameRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    frameRef.current?.classList.add('is-dragging');
  }, []);

  const handlePointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const camera = cameraRef.current;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
    applyCamera({
      x: camera.x - (deltaX / camera.scale),
      y: camera.y - (deltaY / camera.scale),
      scale: camera.scale,
    });
  }, [applyCamera]);

  const endDrag = useCallback((event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    frameRef.current?.classList.remove('is-dragging');
  }, []);

  useLayoutEffect(() => {
    const initialCamera = savedState?.camera || guidedCamera('all');
    cameraRef.current = initialCamera;
    applyCamera(initialCamera, { panelOpen: Boolean(savedState?.selectedId) });
  }, [applyCamera, guidedCamera, savedState]);

  useEffect(() => {
    const handleResize = () => {
      const nextMobileMode = isMobileViewport();
      setMobileMode(nextMobileMode);
      const camera = selectedId ? (() => {
        const placement = PLACEMENTS[selectedId];
        return {
          x: nextMobileMode ? placement.mobileX : placement.x,
          y: nextMobileMode ? placement.mobileY : placement.y,
          scale: nextMobileMode ? 0.8 : 0.62,
        };
      })() : guidedCamera(activeRegion);
      window.requestAnimationFrame(() => applyCamera(camera, { panelOpen: Boolean(selectedId) }));
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('pagehide', persistState);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pagehide', persistState);
      window.clearTimeout(guidedTimerRef.current);
    };
  }, [activeRegion, applyCamera, guidedCamera, persistState, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedRecord(null);
      return undefined;
    }
    let cancelled = false;
    import(`../data/artworks/${selectedId}.json`)
      .then((module) => {
        if (!cancelled) setSelectedRecord(module.default);
      })
      .catch(() => {
        if (!cancelled) setSelectedRecord(null);
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (selectedId) closeInspection();
      else if (indexOpen) setIndexOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeInspection, indexOpen, selectedId]);

  return (
    <main id="main-content" className={`archive-map-lab${selectedId ? ' has-selection' : ''}`}>
      <section
        ref={frameRef}
        className="archive-map-frame"
        aria-label="Experimental flat Archive map"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={worldRef}
          className="archive-map-world"
          style={{ '--world-width': `${worldSize.width}px`, '--world-height': `${worldSize.height}px` }}
        >
          <div className="archive-map-territory archive-map-territory--one">
            <span>SERIES I</span>
            <strong lang="ml">അനാമം</strong>
            <em>ANAMAM</em>
            <small>{seriesI?.workCount ?? 17} WORKS</small>
          </div>
          <div className="archive-map-territory archive-map-territory--two">
            <span>SERIES II</span>
            <strong lang="ml">അന്തരാളം</strong>
            <em>ANTHARALAM</em>
            <small>{seriesII?.workCount ?? 12} WORKS</small>
          </div>
          <p className="archive-map-transition-label" aria-hidden="true">TRANSITION FIELD</p>

          {artworks.map((artwork) => (
            <ArchiveMapArtwork
              key={artwork.id}
              artwork={artwork}
              placement={PLACEMENTS[artwork.id]}
              selected={selectedId === artwork.id}
              onSelect={selectArtwork}
            />
          ))}
        </div>

        <ArchiveMapIndex
          open={indexOpen}
          counts={{ all: (seriesI?.workCount ?? 17) + (seriesII?.workCount ?? 12), seriesI: seriesI?.workCount ?? 17, seriesII: seriesII?.workCount ?? 12 }}
          activeRegion={activeRegion}
          onToggle={() => setIndexOpen((value) => !value)}
          onTravel={travelTo}
        />

        <p className="archive-map-instruction">DRAG TO MOVE · WHEEL OR TRACKPAD TO PAN</p>

        <ArchiveMapPanel
          artwork={selectedArtwork}
          record={selectedRecord}
          position={selectedIndex + 1}
          total={artworks.length}
          onClose={closeInspection}
          onMove={moveSelection}
          onOpenRecord={() => persistState(selectedId)}
        />
      </section>
    </main>
  );
}
