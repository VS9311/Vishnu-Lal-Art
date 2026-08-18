import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import './SpatialSeriesPrototype.css';

const WALL = { width: 6200, height: 3800 };
const PROOF_IDS = ['VL-B-001', 'VL-B-002', 'VL-B-003'];

const ARTWORK_PLACEMENTS = {
  'VL-B-001': { x: 1500, y: 1000, width: 800, depth: 42 },
  'VL-B-002': { x: 4200, y: 980, width: 650, depth: 20 },
  'VL-B-003': { x: 4300, y: 2200, width: 500, depth: 50 },
};

// A geographic route through the chamber. These points deliberately describe
// wall bands and turns rather than artwork locations.
const CAMERA_ROUTE = [
  { x: 2750, y: 1500, scale: 0.36 },
  { x: 1400, y: 950, scale: 0.68 },
  { x: 2250, y: 880, scale: 0.7 },
  { x: 3200, y: 900, scale: 0.71 },
  { x: 4150, y: 930, scale: 0.7 },
  { x: 5100, y: 1050, scale: 0.7 },
  { x: 5250, y: 1550, scale: 0.69 },
  { x: 5050, y: 2150, scale: 0.7 },
  { x: 4100, y: 2200, scale: 0.7 },
  { x: 3100, y: 2150, scale: 0.71 },
  { x: 2050, y: 2200, scale: 0.7 },
  { x: 1050, y: 2350, scale: 0.69 },
  { x: 950, y: 2850, scale: 0.69 },
  { x: 1450, y: 3150, scale: 0.7 },
  { x: 2550, y: 3100, scale: 0.71 },
  { x: 3750, y: 3050, scale: 0.7 },
  { x: 5100, y: 3100, scale: 0.69 },
];

const positionKey = (seriesId) => `vishnu-lal-archive:${seriesId}:position`;
const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

function catmullRom(a, b, c, d, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * b)
    + ((-a + c) * t)
    + (((2 * a) - (5 * b) + (4 * c) - d) * t2)
    + ((-a + (3 * b) - (3 * c) + d) * t3)
  );
}

function interpolateRoute(progress) {
  const scaled = clamp(progress) * (CAMERA_ROUTE.length - 1);
  const index = Math.min(Math.floor(scaled), CAMERA_ROUTE.length - 2);
  const local = scaled - index;
  const p0 = CAMERA_ROUTE[Math.max(0, index - 1)];
  const p1 = CAMERA_ROUTE[index];
  const p2 = CAMERA_ROUTE[Math.min(CAMERA_ROUTE.length - 1, index + 1)];
  const p3 = CAMERA_ROUTE[Math.min(CAMERA_ROUTE.length - 1, index + 2)];

  return {
    x: catmullRom(p0.x, p1.x, p2.x, p3.x, local),
    y: catmullRom(p0.y, p1.y, p2.y, p3.y, local),
    scale: catmullRom(p0.scale, p1.scale, p2.scale, p3.scale, local),
  };
}

function saveChamberContext(seriesId, selectedId, progress) {
  try {
    window.sessionStorage.setItem(positionKey(seriesId), JSON.stringify({
      selectedId,
      progress,
      scrollY: window.scrollY,
    }));
  } catch {
    // The canonical record remains available without position restoration.
  }
}

function readChamberContext(seriesId) {
  try {
    const saved = window.sessionStorage.getItem(positionKey(seriesId));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function SpatialArtwork({
  artwork,
  series,
  placement,
  priority,
  selected,
  registerArtwork,
  onSelect,
  currentProgress,
}) {
  const seriesUrl = `/archive/${series.slug || series.id}`;
  const content = (
    <>
      <ResponsiveArtworkImage
        artwork={artwork}
        className="spatial-artwork-image"
        sizes="(max-width: 1023px) 88vw, 52vw"
        priority={priority}
      />
      <span className="spatial-artwork-identity">
        <span className="spatial-artwork-id">{artwork.id}</span>
        {selected && <span className="spatial-artwork-cta">VIEW ARCHIVE RECORD →</span>}
      </span>
    </>
  );

  return (
    <article
      ref={(node) => registerArtwork(artwork.id, node)}
      className="spatial-artwork"
      data-artwork-id={artwork.id}
      data-selected={selected ? 'true' : 'false'}
      style={{
        '--art-x': `${placement.x}px`,
        '--art-y': `${placement.y}px`,
        '--art-width': `${placement.width}px`,
        '--art-depth': `${placement.depth}px`,
      }}
    >
      {selected ? (
        <Link
          to={`/archive/${artwork.id}`}
          state={{ fromSeries: seriesUrl, artworkId: artwork.id }}
          className="spatial-artwork-link"
          aria-label={`View archive record for ${artwork.id}`}
          onClick={() => saveChamberContext(series.id, artwork.id, currentProgress.current)}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className="spatial-artwork-link"
          aria-label={`Inspect ${artwork.id} within the chamber`}
          onClick={() => onSelect(artwork.id)}
        >
          {content}
        </button>
      )}
    </article>
  );
}

export default function SpatialSeriesPrototype({ series, artworks }) {
  const sceneRef = useRef(null);
  const wallRef = useRef(null);
  const artworkRefs = useRef(new Map());
  const currentProgress = useRef(0);
  const restorationHandled = useRef(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  const shouldRestore = location.state?.restoreSeriesPosition || navigationType === 'POP';
  const initialContext = useMemo(() => {
    if (!shouldRestore) return null;
    const saved = readChamberContext(series.id);
    return saved && (!saved.selectedId || PROOF_IDS.includes(saved.selectedId)) ? saved : null;
  }, [series.id, shouldRestore]);

  const [selectedId, setSelectedId] = useState(initialContext?.selectedId || null);

  const proofArtworks = useMemo(
    () => PROOF_IDS.map((id) => artworks.find((artwork) => artwork.id === id)).filter(Boolean),
    [artworks],
  );

  const registerArtwork = useCallback((id, node) => {
    if (node) artworkRefs.current.set(id, node);
    else artworkRefs.current.delete(id);
  }, []);

  const returnToWideChamber = useCallback(() => {
    setSelectedId(null);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  useLayoutEffect(() => {
    if (!initialContext || restorationHandled.current) {
      if (!initialContext) window.scrollTo({ top: 0, left: 0 });
      return undefined;
    }

    let secondFrame = 0;
    let lateRestore = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        restorationHandled.current = true;
        const scene = sceneRef.current;
        const savedProgress = Number.isFinite(initialContext.progress)
          ? clamp(initialContext.progress)
          : 0;
        const travel = Math.max((scene?.offsetHeight || window.innerHeight) - window.innerHeight, 1);
        const target = Number.isFinite(initialContext.scrollY)
          ? initialContext.scrollY
          : (scene?.offsetTop || 0) + (savedProgress * travel);

        currentProgress.current = savedProgress;
        window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        lateRestore = window.setTimeout(() => {
          window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        }, 180);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
      if (lateRestore) window.clearTimeout(lateRestore);
    };
  }, [initialContext]);

  useEffect(() => {
    const scene = sceneRef.current;
    const wall = wallRef.current;
    if (!scene || !wall) return undefined;

    const desktop = window.matchMedia('(min-width: 1024px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;

    const updateArtwork = (id, proximity) => {
      const node = artworkRefs.current.get(id);
      if (!node) return;
      const selected = selectedId === id;
      node.dataset.near = proximity > 0.48 ? 'true' : 'false';
      node.style.setProperty('--proximity', String(selected ? Math.max(proximity, 0.82) : proximity));
      node.style.setProperty('--art-opacity', String(clamp(0.66 + (proximity * 0.34))));
    };

    const renderStatic = () => {
      scene.dataset.cameraMode = 'static';
      wall.style.removeProperty('transform');
      const travel = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      currentProgress.current = clamp(window.scrollY / travel);

      artworkRefs.current.forEach((node, id) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs((rect.top + (rect.height / 2)) - (window.innerHeight / 2));
        updateArtwork(id, clamp(1 - (distance / window.innerHeight)));
      });
    };

    const renderCamera = () => {
      animationFrame = 0;
      if (!desktop.matches || reducedMotion.matches) {
        renderStatic();
        return;
      }

      scene.dataset.cameraMode = 'animated';
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / travel);
      const routeCamera = interpolateRoute(progress);
      const scale = routeCamera.scale;
      const halfWorldWidth = window.innerWidth / (2 * scale);
      const halfWorldHeight = window.innerHeight / (2 * scale);
      const camera = {
        x: clamp(routeCamera.x, halfWorldWidth + 80, WALL.width - halfWorldWidth - 80),
        y: clamp(routeCamera.y, halfWorldHeight + 80, WALL.height - halfWorldHeight - 80),
        scale,
      };
      const translateX = (window.innerWidth / 2) - (camera.x * camera.scale);
      const translateY = (window.innerHeight / 2) - (camera.y * camera.scale);

      currentProgress.current = progress;
      scene.style.setProperty('--route-progress', String(progress));
      scene.style.setProperty('--entry-opacity', String(clamp(1 - (progress / 0.065))));
      wall.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${camera.scale})`;

      PROOF_IDS.forEach((id) => {
        const placement = ARTWORK_PLACEMENTS[id];
        const distance = Math.hypot(placement.x - camera.x, placement.y - camera.y);
        updateArtwork(id, clamp(1 - (distance / 1450)));
      });
    };

    const requestRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderCamera);
    };

    renderCamera();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    desktop.addEventListener('change', requestRender);
    reducedMotion.addEventListener('change', requestRender);

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      desktop.removeEventListener('change', requestRender);
      reducedMotion.removeEventListener('change', requestRender);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [selectedId]);

  return (
    <main id="main-content" className="spatial-series-page">
      <section
        ref={sceneRef}
        className="spatial-series-scene"
        aria-label={`${series.label} continuous chamber route prototype`}
      >
        <div className="spatial-series-frame">
          <div
            ref={wallRef}
            className="spatial-wall"
            style={{ '--wall-width': `${WALL.width}px`, '--wall-height': `${WALL.height}px` }}
          >
            <div className="spatial-wall-surface" aria-hidden="true" />
            <div className="wall-plane wall-plane--one" aria-hidden="true" />
            <div className="wall-plane wall-plane--two" aria-hidden="true" />
            <div className="wall-plane wall-plane--three" aria-hidden="true" />
            <div className="wall-cavity wall-cavity--one" aria-hidden="true" />
            <div className="wall-cavity wall-cavity--two" aria-hidden="true" />
            <div className="wall-cavity wall-cavity--three" aria-hidden="true" />
            <div className="wall-fissure wall-fissure--one" aria-hidden="true" />
            <div className="wall-fissure wall-fissure--two" aria-hidden="true" />
            <div className="wall-ledge wall-ledge--one" aria-hidden="true" />
            <div className="wall-ledge wall-ledge--two" aria-hidden="true" />

            {proofArtworks.map((artwork, index) => (
              <SpatialArtwork
                key={artwork.id}
                artwork={artwork}
                series={series}
                placement={ARTWORK_PLACEMENTS[artwork.id]}
                priority={index < 2}
                selected={selectedId === artwork.id}
                registerArtwork={registerArtwork}
                onSelect={setSelectedId}
                currentProgress={currentProgress}
              />
            ))}
          </div>

          <div className="chamber-foreground chamber-foreground--left" aria-hidden="true" />
          <div className="chamber-foreground chamber-foreground--right" aria-hidden="true" />
          <div className="spatial-frame-vignette" aria-hidden="true" />

          <nav className="spatial-series-nav" aria-label="Chamber navigation">
            <Link to="/archive">← THE ARCHIVE</Link>
            <button type="button" onClick={returnToWideChamber}>WIDE CHAMBER</button>
            <span>SERIES II / CHAMBER ROUTE</span>
          </nav>

          <div className="spatial-entry-identity" aria-hidden="true">
            <span>{series.label}</span>
            <strong>{series.romanizedName}</strong>
            <span>03-WORK GEOGRAPHIC STUDY</span>
          </div>

          <div className="spatial-series-instruction" aria-hidden="true">
            <span>SCROLL TO MOVE THROUGH THE CHAMBER</span>
            <i />
          </div>

          <div className="spatial-route-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
