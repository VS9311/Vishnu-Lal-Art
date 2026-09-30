import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { getArtworkImage } from '../../lib/artwork';

export default function ResponsiveArtworkImage({ artwork, className, sizes, priority = false, eager = priority }) {
  const image = getArtworkImage(artwork.id, artwork.width, artwork.height);
  const elementRef = useRef(null);
  const [readiness, setReadiness] = useState({ artworkId: artwork.id, orientation: null });
  const orientation = readiness.artworkId === artwork.id ? readiness.orientation : null;

  const markReady = useCallback((element) => {
    if (!element?.naturalWidth || !element?.naturalHeight) return;
    const nextOrientation = element.naturalWidth > element.naturalHeight ? 'landscape' : 'portrait';
    setReadiness((current) => current.artworkId === artwork.id && current.orientation === nextOrientation
      ? current
      : { artworkId: artwork.id, orientation: nextOrientation });
  }, [artwork.id]);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (element?.complete) markReady(element);
  }, [artwork.id, image.src, markReady]);

  return (
    <img
      ref={elementRef}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={[className, orientation ? `is-${orientation}-image is-image-loaded` : 'is-image-loading'].filter(Boolean).join(' ')}
      onLoad={(event) => markReady(event.currentTarget)}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
