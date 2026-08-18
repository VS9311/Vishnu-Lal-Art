import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getSeriesData, getSeriesArtworks, getAllSeries } from '../lib/artwork';
import MalayalamMarker from '../components/MalayalamMarker';
import MineralWallTexture from '../components/chamber/MineralWallTexture';
import ChamberHUD from '../components/chamber/ChamberHUD';
import NotFound from './NotFound';
import './SeriesPage.css';

// Virtual canvas dimensions for spatial wall layout
const WALL_CONFIG = {
  'series-ii': {
    width: 3800,
    height: 2700,
    cols: 4,
    rows: 3,
    paddingX: 300,
    paddingY: 440,
    cardWidth: 620,
    strata: [
      { name: 'STRATUM α', depth: '0.00m', label: 'UPPER REGISTER' },
      { name: 'STRATUM β', depth: '-1.20m', label: 'MEDIAL REGISTER' },
      { name: 'STRATUM γ', depth: '-2.40m', label: 'LOWER REGISTER' },
    ],
  },
  'series-i': {
    width: 3800,
    height: 3500,
    cols: 4,
    rows: 4,
    paddingX: 300,
    paddingY: 420,
    cardWidth: 560,
    strata: [
      { name: 'STRATUM α', depth: '0.00m', label: 'UPPER REGISTER' },
      { name: 'STRATUM β', depth: '-1.10m', label: 'UPPER-MEDIAL REGISTER' },
      { name: 'STRATUM γ', depth: '-2.20m', label: 'LOWER-MEDIAL REGISTER' },
      { name: 'STRATUM δ', depth: '-3.30m', label: 'BASE REGISTER' },
    ],
  },
};

export default function SeriesPage({ seriesId: propSeriesId }) {
  const { seriesId: paramSeriesId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const seriesKey = propSeriesId || paramSeriesId;
  const series = getSeriesData(seriesKey);

  const containerRef = useRef(null);
  const wallCanvasRef = useRef(null);
  const wheelLockRef = useRef(false);

  // Read initial work from URL query param if present
  const queryWorkId = searchParams.get('work');
  const [focusedId, setFocusedId] = useState(queryWorkId || null);
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const artworks = useMemo(() => {
    return series ? getSeriesArtworks(series.id) : [];
  }, [series]);

  const allSeries = useMemo(() => getAllSeries(), []);
  const otherSeries = useMemo(() => {
    return series ? allSeries.find((s) => s.id !== series.id) : null;
  }, [series, allSeries]);

  const config = series && WALL_CONFIG[series.id] ? WALL_CONFIG[series.id] : WALL_CONFIG['series-ii'];

  // Calculate serpentine coordinates for each artwork
  const wallItems = useMemo(() => {
    if (!series || artworks.length === 0) return [];

    const totalCols = config.cols;
    const availableW = config.width - config.paddingX * 2;
    const availableH = config.height - config.paddingY * 2;
    const colStep = availableW / (totalCols - 1);
    const rowStep = availableH / Math.max(config.rows - 1, 1);

    // Natural subtle variations for archaeological excavation feel
    const naturalOffsets = [
      { dx: 0, dy: -12, rot: -0.3 },
      { dx: 18, dy: 14, rot: 0.4 },
      { dx: -12, dy: -8, rot: -0.2 },
      { dx: 6, dy: 10, rot: 0.3 },
      { dx: 14, dy: -15, rot: -0.4 },
      { dx: -8, dy: 12, rot: 0.2 },
      { dx: 10, dy: -6, rot: -0.3 },
      { dx: -16, dy: 15, rot: 0.5 },
      { dx: 8, dy: -10, rot: -0.2 },
      { dx: -12, dy: 8, rot: 0.4 },
      { dx: 15, dy: -12, rot: -0.3 },
      { dx: -6, dy: 14, rot: 0.2 },
    ];

    return artworks.map((work, index) => {
      const rowIndex = Math.floor(index / totalCols);
      const colInRow = index % totalCols;
      const isReversed = rowIndex % 2 === 1; // Reverse direction on alternating bands
      const actualCol = isReversed ? totalCols - 1 - colInRow : colInRow;

      const baseX = config.paddingX + actualCol * colStep;
      const baseY = config.paddingY + rowIndex * rowStep;

      const offset = naturalOffsets[index % naturalOffsets.length];
      const posX = baseX + offset.dx;
      const posY = baseY + offset.dy;

      // Aspect ratio calculation
      const aspectRatio = work.width && work.height ? work.width / work.height : 1.33;
      const itemW = config.cardWidth;
      const itemH = itemW / aspectRatio;

      return {
        work,
        index,
        rowIndex,
        colIndex: actualCol,
        isReversed,
        x: posX,
        y: posY,
        w: itemW,
        h: itemH,
        rot: offset.rot,
        stratum: config.strata[rowIndex] || config.strata[0],
      };
    });
  }, [series, artworks, config]);

  const currentIndex = useMemo(() => {
    if (!focusedId) return -1;
    return wallItems.findIndex((item) => item.work.id === focusedId);
  }, [focusedId, wallItems]);

  const currentItem = currentIndex >= 0 ? wallItems[currentIndex] : null;

  // Handle URL sync
  const setFocusedWork = useCallback((workId) => {
    setFocusedId(workId);
    if (workId) {
      setSearchParams({ work: workId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [setSearchParams]);

  // Serpentine navigation handlers
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevWork = wallItems[currentIndex - 1].work;
      setFocusedWork(prevWork.id);
    }
  }, [currentIndex, wallItems, setFocusedWork]);

  const handleNext = useCallback(() => {
    if (currentIndex < wallItems.length - 1) {
      const nextWork = wallItems[currentIndex + 1].work;
      setFocusedWork(nextWork.id);
    }
  }, [currentIndex, wallItems, setFocusedWork]);

  const handleToggleOverview = useCallback(() => {
    if (focusedId) {
      setFocusedWork(null);
    } else if (wallItems.length > 0) {
      setFocusedWork(wallItems[0].work.id);
    }
  }, [focusedId, wallItems, setFocusedWork]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (!focusedId && wallItems.length > 0) {
          setFocusedWork(wallItems[0].work.id);
        } else {
          handleNext();
        }
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (!focusedId && wallItems.length > 0) {
          setFocusedWork(wallItems[0].work.id);
        } else {
          handlePrev();
        }
        e.preventDefault();
      } else if (e.key === 'Escape') {
        if (focusedId) {
          setFocusedWork(null);
          e.preventDefault();
        }
      } else if (e.key === 'Enter') {
        if (currentItem) {
          navigate(`/archive/${currentItem.work.id}`);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedId, currentItem, handleNext, handlePrev, wallItems, setFocusedWork, navigate]);

  // Smooth wheel glide in focused mode (continuous serpentine travel)
  const handleWheel = useCallback((e) => {
    if (viewportSize.width < 768) return; // Allow native scroll on mobile

    if (wheelLockRef.current) return;

    if (Math.abs(e.deltaY) > 28 || Math.abs(e.deltaX) > 28) {
      const isForward = e.deltaY > 0 || e.deltaX > 0;

      if (focusedId) {
        // Glide smoothly along the wall
        if (isForward && currentIndex < wallItems.length - 1) {
          wheelLockRef.current = true;
          handleNext();
          setTimeout(() => { wheelLockRef.current = false; }, 420);
        } else if (!isForward && currentIndex > 0) {
          wheelLockRef.current = true;
          handlePrev();
          setTimeout(() => { wheelLockRef.current = false; }, 420);
        }
      } else {
        // In overview, small wheel down enters the first work
        if (isForward && wallItems.length > 0) {
          wheelLockRef.current = true;
          setFocusedWork(wallItems[0].work.id);
          setTimeout(() => { wheelLockRef.current = false; }, 450);
        }
      }
    }
  }, [viewportSize.width, focusedId, currentIndex, wallItems, handleNext, handlePrev, setFocusedWork]);

  // Compute camera transform matrix for Desktop Wall
  const cameraTransform = useMemo(() => {
    const { width: vw, height: vh } = viewportSize;
    const isDesktop = vw >= 768;

    if (!isDesktop) return { transform: 'none' };

    if (!focusedId || !currentItem) {
      // Overview Mode: scale wall canvas to fit comfortably in viewport with header clearance
      const scaleX = (vw * 0.90) / config.width;
      const scaleY = ((vh - 150) * 0.82) / config.height;
      const fitScale = Math.min(scaleX, scaleY, 0.35);

      const targetCenterX = config.width / 2;
      const targetCenterY = config.height / 2;

      const translateX = vw / 2 - targetCenterX * fitScale;
      const translateY = (vh + 80) / 2 - targetCenterY * fitScale;

      return {
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${fitScale})`,
        transition: 'transform 0.85s cubic-bezier(0.2, 0.9, 0.25, 1)',
      };
    }

    // Focused Mode: zoom and glide smoothly directly to the active artwork position
    const focusTargetW = Math.min(vw * 0.58, 880);
    const focusScale = focusTargetW / currentItem.w;

    const translateX = vw / 2 - currentItem.x * focusScale;
    const translateY = (vh + 20) / 2 - currentItem.y * focusScale;

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${focusScale})`,
      transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
    };
  }, [viewportSize, focusedId, currentItem, config]);

  if (!series) {
    return <NotFound />;
  }

  const isFocused = Boolean(focusedId && currentItem);

  return (
    <main
      id="main-content"
      className={`series-page mineral-cave-chamber ${isFocused ? 'is-focused-mode' : 'is-overview-mode'}`}
      ref={containerRef}
      onWheel={handleWheel}
    >
      {/* Procedural Mineral / Limestone Grain Overlay */}
      <MineralWallTexture />

      {/* Atmospheric Header & Series Identity */}
      <header className="chamber-header">
        <div className="chamber-header-left">
          <Link to="/archive" className="chamber-back-link" aria-label="Return to All Series">
            <span className="arrow" aria-hidden="true">←</span> THE ARCHIVE
          </Link>
          <div className="chamber-series-identity">
            <MalayalamMarker
              text={series.malayalamName}
              align="left"
              className="chamber-malayalam"
            />
            <div className="chamber-title-row">
              <h1 className="chamber-romanized-title">{series.romanizedName}</h1>
              <span className="chamber-series-badge">{series.label}</span>
            </div>
          </div>
        </div>

        <div className="chamber-header-right">
          <div className="chamber-view-indicator">
            <span className="indicator-dot" aria-hidden="true" />
            <span className="indicator-label">
              {isFocused ? `FOCUS · ${currentItem?.work.id}` : 'EXCAVATION WALL OVERVIEW'}
            </span>
          </div>
          <button
            type="button"
            className="chamber-overview-btn"
            onClick={handleToggleOverview}
            aria-label={isFocused ? 'Switch to Chamber Overview' : 'Focus First Artwork'}
          >
            {isFocused ? '⤢ OVERVIEW' : '🔍 FOCUS VIEW'}
          </button>
        </div>
      </header>

      {/* Desktop Spatial Archaeological Excavation Wall */}
      <section
        className="chamber-wall-viewport"
        aria-label={`Excavation wall for ${series.label}`}
      >
        <div
          className="chamber-wall-canvas"
          ref={wallCanvasRef}
          style={{
            width: `${config.width}px`,
            height: `${config.height}px`,
            ...cameraTransform,
          }}
        >
          {/* Stratum Horizontal Geological Guidelines & Depth Markers */}
          <div className="chamber-strata-container" aria-hidden="true">
            {config.strata.map((stratum, idx) => {
              const stratumY = config.paddingY + idx * ((config.height - config.paddingY * 2) / Math.max(config.rows - 1, 1));
              return (
                <div
                  key={stratum.name}
                  className="chamber-stratum-line"
                  style={{ top: `${stratumY}px` }}
                >
                  <div className="stratum-marker left">
                    <span className="stratum-name">{stratum.name}</span>
                    <span className="stratum-depth">{stratum.depth}</span>
                  </div>
                  <div className="stratum-rule" />
                  <div className="stratum-marker right">
                    <span className="stratum-label">{stratum.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Serpentine Travel Path Chalk Line on Wall */}
          <svg className="chamber-serpentine-trace" width={config.width} height={config.height} aria-hidden="true">
            <path
              d={wallItems.map((item, idx) => `${idx === 0 ? 'M' : 'L'} ${item.x} ${item.y}`).join(' ')}
              className="serpentine-path-line"
            />
          </svg>

          {/* Artworks embedded onto the mineral wall */}
          {wallItems.map((item) => {
            const { work, index, x, y, w, h, rot } = item;
            const isCurrent = focusedId === work.id;
            const isEager = index < 4;
            const loading = isEager ? 'eager' : 'lazy';
            const fetchPriority = isEager ? 'high' : 'auto';

            const imageWidths = [480, 900, 1440, 2400];
            const srcSet = imageWidths.map((imgW) => `/artworks/${work.id}/${imgW}.webp ${imgW}w`).join(', ');
            const src = `/artworks/${work.id}/900.webp`;

            return (
              <article
                key={work.id}
                id={`work-${work.id}`}
                className={`chamber-artwork-node ${isCurrent ? 'is-active-work' : ''}`}
                style={{
                  transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${rot}deg)`,
                  width: `${w}px`,
                  height: `${h}px`,
                }}
                onClick={() => {
                  if (isCurrent) {
                    navigate(`/archive/${work.id}`);
                  } else {
                    setFocusedWork(work.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Artwork ${work.id}, Stratum position ${index + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (isCurrent) {
                      navigate(`/archive/${work.id}`);
                    } else {
                      setFocusedWork(work.id);
                    }
                    e.preventDefault();
                  }
                }}
              >
                <div className="embedded-paper-mount">
                  {/* Subtle archaeological registration markings */}
                  <div className="registration-corner top-left" aria-hidden="true" />
                  <div className="registration-corner top-right" aria-hidden="true" />
                  <div className="registration-corner bottom-left" aria-hidden="true" />
                  <div className="registration-corner bottom-right" aria-hidden="true" />

                  <div className="artwork-image-container">
                    <img
                      src={src}
                      srcSet={srcSet}
                      sizes="(max-width: 767px) 100vw, 65vw"
                      alt={`Artwork ${work.id}`}
                      width={work.width}
                      height={work.height}
                      className="artwork-embedded-image"
                      loading={loading}
                      fetchPriority={fetchPriority}
                      draggable={false}
                    />
                  </div>

                  <div className="artwork-inscription-meta">
                    <span className="artwork-plate-id">{work.id}</span>
                    <span className="artwork-plate-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Mobile Chamber Flow (< 768px) */}
      <section className="mobile-chamber-flow" aria-label={`Mobile view of ${series.label}`}>
        <div className="mobile-flow-list">
          {wallItems.map((item) => {
            const { work, index } = item;
            const src = `/artworks/${work.id}/900.webp`;
            const imageWidths = [480, 900, 1440, 2400];
            const srcSet = imageWidths.map((imgW) => `/artworks/${work.id}/${imgW}.webp ${imgW}w`).join(', ');

            return (
              <article key={work.id} className="mobile-chamber-card">
                <Link to={`/archive/${work.id}`} className="mobile-card-link">
                  <div className="mobile-paper-mount">
                    <img
                      src={src}
                      srcSet={srcSet}
                      sizes="100vw"
                      alt={`Artwork ${work.id}`}
                      width={work.width}
                      height={work.height}
                      className="mobile-card-img"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="mobile-card-meta">
                    <span className="mobile-work-id">{work.id}</span>
                    <span className="mobile-view-link">STUDY RECORD →</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Floating Chamber Navigation HUD */}
      <ChamberHUD
        series={series}
        currentWork={currentItem?.work}
        currentIndex={currentIndex}
        totalWorks={artworks.length}
        isFocused={isFocused}
        onToggleOverview={handleToggleOverview}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Return & Next Series Footer Links */}
      <footer className="chamber-footer-nav">
        <Link to="/archive" className="footer-return-link">
          ← RETURN TO ALL SERIES
        </Link>
        {otherSeries && (
          <Link
            to={`/archive/${otherSeries.slug || otherSeries.id}`}
            className="footer-next-series-link"
          >
            EXPLORE {otherSeries.label.toUpperCase()} ({otherSeries.romanizedName.toUpperCase()}) →
          </Link>
        )}
      </footer>
    </main>
  );
}
