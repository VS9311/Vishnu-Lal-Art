import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import MalayalamMarker from '../MalayalamMarker';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import './ChamberSeries.css';

const positionKey = (seriesId) => `vishnu-lal-archive:${seriesId}:position`;

function saveSeriesPosition(seriesId, artworkId) {
  try {
    window.sessionStorage.setItem(
      positionKey(seriesId),
      JSON.stringify({ artworkId, scrollY: window.scrollY }),
    );
  } catch {
    // Session storage is an enhancement; navigation remains usable without it.
  }
}

function readSeriesPosition(seriesId) {
  try {
    const saved = window.sessionStorage.getItem(positionKey(seriesId));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function ChamberArtwork({ work, series, index, variant = 'left', priority = false, passage = false }) {
  const encounterRef = useRef(null);
  const [active, setActive] = useState(false);
  const seriesUrl = `/archive/${series.slug || series.id}`;

  useEffect(() => {
    const element = encounterRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '-18% 0px -24% 0px', threshold: [0.12, 0.45] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleOpen = () => saveSeriesPosition(series.id, work.id);

  return (
    <article
      ref={encounterRef}
      id={`encounter-${work.id}`}
      className={`chamber-encounter chamber-encounter--${variant}${active ? ' is-active' : ''}${passage ? ' is-passage-work' : ''}`}
      data-encounter-index={String(index + 1).padStart(2, '0')}
    >
      <div className="chamber-encounter-shadow" aria-hidden="true" />
      <div className="chamber-artwork-stage">
        <div className="chamber-artwork-light" aria-hidden="true" />
        <Link
          to={`/archive/${work.id}`}
          state={{ fromSeries: seriesUrl, artworkId: work.id }}
          className="chamber-artwork-link"
          aria-label={`Open Study View for ${work.id}`}
          onClick={handleOpen}
        >
          <ResponsiveArtworkImage
            artwork={work}
            className="chamber-artwork-image"
            sizes={passage
              ? '(max-width: 767px) calc(100vw - 40px), 48vw'
              : '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 72vw, 48vw'}
            priority={priority}
          />
          <span className="chamber-artwork-meta">
            <span className="chamber-artwork-id">{work.id}</span>
            <span className="chamber-study-cue">OPEN STUDY <span aria-hidden="true">↗</span></span>
          </span>
        </Link>
      </div>
    </article>
  );
}

function LateralPassage({ works, series, startIndex }) {
  const passageRef = useRef(null);

  useEffect(() => {
    const passage = passageRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1024px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!passage || reducedMotion.matches || !desktop.matches) {
        passage?.style.setProperty('--lateral-shift', '0vw');
        return;
      }

      const rect = passage.getBoundingClientRect();
      const distance = Math.max(passage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      passage.style.setProperty('--lateral-shift', `${progress * -72}vw`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    reducedMotion.addEventListener('change', requestUpdate);
    desktop.addEventListener('change', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      reducedMotion.removeEventListener('change', requestUpdate);
      desktop.removeEventListener('change', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!works.length) return null;

  return (
    <section ref={passageRef} className="chamber-passage" aria-label="Lateral chamber passage">
      <div className="chamber-passage-frame">
        <div className="chamber-passage-track">
          <div className="chamber-passage-marker" aria-hidden="true">
            <span>PASSAGE</span>
            <i />
          </div>
          {works.map((work, offset) => (
            <ChamberArtwork
              key={work.id}
              work={work}
              series={series}
              index={startIndex + offset}
              variant={offset % 2 === 0 ? 'passage-near' : 'passage-far'}
              passage
            />
          ))}
          <div className="chamber-witness-trace" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default function ChamberSeries({ series, artworks, otherSeries }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const openingWorks = artworks.slice(0, 2);
  const passageWorks = artworks.slice(2, 4);
  const remainingWorks = artworks.slice(4);

  useLayoutEffect(() => {
    const shouldRestore = location.state?.restoreSeriesPosition || navigationType === 'POP';
    const saved = shouldRestore ? readSeriesPosition(series.id) : null;

    if (!saved || !Number.isFinite(saved.scrollY)) {
      window.scrollTo({ top: 0, left: 0 });
      return undefined;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: saved.scrollY, left: 0 });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [location.key, location.state, navigationType, series.id]);

  return (
    <main id="main-content" className={`series-page chamber-series chamber-series--${series.id}`}>
      <div className="chamber-ambient" aria-hidden="true">
        <div className="chamber-ambient-strata" />
        <div className="chamber-ambient-depth" />
      </div>

      <div className="chamber-series-shell">
        <div className="series-nav-back chamber-nav-back">
          <Link to="/archive" className="back-link">
            <span className="arrow" aria-hidden="true">←</span> THE ARCHIVE
          </Link>
        </div>

        <header className="chamber-entry">
          <div className="chamber-entry-index metadata">
            <span>{series.label}</span>
            <span>{artworks.length} selected works</span>
          </div>
          <div className="chamber-entry-identity">
            <MalayalamMarker
              text={series.malayalamName}
              align="left"
              className="chamber-entry-malayalam"
            />
            <h1 className="chamber-entry-romanized">{series.romanizedName}</h1>
          </div>
          <p className="chamber-entry-note">A selected public corpus, encountered work by work.</p>
          <div className="chamber-entry-direction" aria-hidden="true">
            <span>SCROLL TO ENTER</span>
            <i />
          </div>
        </header>

        <section className="chamber-field" aria-label={`Artworks in ${series.label}`}>
          <div className="chamber-opening-sequence">
            {openingWorks.map((work, index) => (
              <ChamberArtwork
                key={work.id}
                work={work}
                series={series}
                index={index}
                variant={index === 0 ? 'first' : 'recess'}
                priority
              />
            ))}
          </div>

          <LateralPassage works={passageWorks} series={series} startIndex={openingWorks.length} />

          <div className="chamber-deep-field">
            {remainingWorks.map((work, offset) => (
              <ChamberArtwork
                key={work.id}
                work={work}
                series={series}
                index={offset + 4}
                variant={['left', 'right', 'recess', 'near'][offset % 4]}
              />
            ))}
          </div>
        </section>

        <footer className="chamber-series-footer">
          <div className="chamber-series-footer-nav">
            <Link to="/archive" className="chamber-footer-link">← RETURN TO ALL SERIES</Link>
            {otherSeries && (
              <Link to={`/archive/${otherSeries.slug || otherSeries.id}`} className="chamber-footer-link chamber-footer-link--next">
                ENTER {otherSeries.label.toUpperCase()} · {otherSeries.malayalamName} →
              </Link>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}
