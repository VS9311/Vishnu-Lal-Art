import { getArtworkImage } from '../../lib/artwork';

export default function ResponsiveArtworkImage({ artwork, className, sizes, priority = false }) {
  const image = getArtworkImage(artwork.id, artwork.width, artwork.height);

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
