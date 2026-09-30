import { useEffect, useRef, useState } from 'react';
import MarbleArtworkPresentation from './MarbleArtworkPresentation';
import ResponsiveArtworkImage from './ResponsiveArtworkImage';
import { clampMediaIndex } from './artworkMedia';
import { MOTION_DURATIONS } from '../../motion/motionConfig';

function MediaFrame({ item, priority = false, mobile = false }) {
  if (item.kind === 'marble') {
    return <div className="artwork-media-frame artwork-media-frame--marble">
      <MarbleArtworkPresentation artwork={item.artwork} priority={priority} />
    </div>;
  }

  if (item.kind === 'canonical') {
    return <div className="artwork-media-frame artwork-media-frame--canonical">
      <div className={`artwork-media-canonical-sheet landscape-artwork-sheet${mobile ? ' is-mobile' : ' is-desktop'}`}>
        <ResponsiveArtworkImage artwork={item.artwork} className="artwork-media-canonical-image landscape-artwork-image" sizes={mobile ? '94vw' : '52vw'} priority={priority} />
      </div>
    </div>;
  }

  const template = item.template || {};
  const templateStyle = {
    '--interior-art-x': `${template.x ?? 50}%`,
    '--interior-art-y': `${template.y ?? 35}%`,
    '--a1-max-width': `${template.a1MaxWidthCqw ?? 31}cqw`,
    '--a1-max-height': `${template.a1MaxHeightCqh ?? 26}cqh`,
    '--interior-object-position': template.objectPosition || '50% 50%',
  };
  const frameTone = template.frameTone === 'dark-heavy'
    ? ' is-dark-frame is-heavy-frame'
    : template.frameTone === 'dark' ? ' is-dark-frame' : '';
  return <div className={`artwork-media-frame artwork-media-frame--presentation artwork-media-frame--${item.kind}`} style={templateStyle}>
    <img className="artwork-media-interior-scene" src={item.src} alt="" width={item.width} height={item.height} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    <div className="artwork-media-interior-mount" aria-label={item.alt}>
      <div className={`artwork-media-interior-sheet landscape-artwork-sheet${frameTone}`}>
        <div className="artwork-media-interior-mat">
          <ResponsiveArtworkImage artwork={item.artwork} className="landscape-artwork-image" sizes="(max-width:800px) 40vw, 30vw" priority={priority} />
        </div>
      </div>
    </div>
  </div>;
}

export default function ArtworkMediaGallery({ artwork, items, mobile }) {
  const [active, setActive] = useState(0);
  const [transition, setTransition] = useState(null);
  const track = useRef(null);
  const transitionTimer = useRef(0);
  const safeActive = clampMediaIndex(active, items.length);

  useEffect(() => {
    setActive(0);
    setTransition(null);
    window.clearTimeout(transitionTimer.current);
    track.current?.scrollTo({ left: 0, behavior: 'instant' });
    return () => window.clearTimeout(transitionTimer.current);
  }, [artwork.id, mobile, items.length]);

  useEffect(() => {
    if (mobile) return undefined;
    items.forEach((item) => {
      if (!item.src) return null;
      const image = new Image();
      image.decoding = 'async';
      image.src = item.src;
      return image;
    });
    return undefined;
  }, [items, mobile]);

  const select = (index, requestedDirection) => {
    const next = clampMediaIndex(index, items.length);
    if (next === safeActive || transition) return;
    if (mobile) {
      setActive(next);
      track.current?.scrollTo({ left: track.current.clientWidth * next, behavior: 'smooth' });
      return;
    }
    const direction = Math.sign(requestedDirection || next - safeActive) || 1;
    setTransition({ from: safeActive, to: next, direction });
    setActive(next);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : MOTION_DURATIONS.gallery;
    transitionTimer.current = window.setTimeout(() => setTransition(null), duration);
  };

  const move = (direction) => select((safeActive + direction + items.length) % items.length, direction);
  const count = `${String(safeActive + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;

  return <section className={`artwork-media-gallery${mobile ? ' is-mobile' : ' is-desktop'}`} aria-label={`Media for ${artwork.id}`}>
    {mobile ? <div ref={track} className="artwork-media-track" onScroll={(event) => {
      const width = event.currentTarget.clientWidth;
      if (width) setActive(Math.round(event.currentTarget.scrollLeft / width));
    }}>
      {items.map((item, index) => <article className="artwork-media-slide" key={item.id} aria-label={`${item.label}, ${index + 1} of ${items.length}`}>
        <MediaFrame item={item} priority={index === 0} mobile />
      </article>)}
    </div> : <div className="artwork-media-desktop-stage" data-direction={transition?.direction || 0} aria-live="polite">
      {transition ? <>
        <div className="artwork-media-layer is-outgoing" aria-hidden="true"><MediaFrame item={items[transition.from]} priority /></div>
        <div className="artwork-media-layer is-incoming"><MediaFrame item={items[transition.to]} priority /></div>
      </> : <div className="artwork-media-layer is-current"><MediaFrame item={items[safeActive]} priority /></div>}
    </div>}

    <div className="artwork-media-controls">
      <div className="artwork-media-caption"><strong>{items[safeActive].label}</strong><span>{count}</span></div>
      {items.length > 1 && <>
        <div className="artwork-media-tabs" aria-label="Choose media">
          {items.map((item, index) => <button type="button" key={item.id} disabled={Boolean(transition)} aria-current={safeActive === index ? 'true' : undefined} onClick={() => select(index)}>{item.label}</button>)}
        </div>
        {!mobile && <div className="artwork-media-arrows">
          <button type="button" disabled={Boolean(transition)} onClick={() => move(-1)} aria-label="Previous media">←</button>
          <button type="button" disabled={Boolean(transition)} onClick={() => move(1)} aria-label="Next media">→</button>
        </div>}
      </>}
    </div>
  </section>;
}

