import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';

export default function ArchiveMapArtwork({ artwork, placement, selected, onSelect }) {
  const seriesLabel = artwork.seriesId === 'series-i' ? 'SERIES I' : 'SERIES II';

  return (
    <article
      className={`archive-map-artwork${selected ? ' is-selected' : ''}`}
      data-artwork-id={artwork.id}
      style={{
        '--map-x': `${placement.x}px`,
        '--map-y': `${placement.y}px`,
        '--map-width': `${placement.width}px`,
        '--mobile-x': `${placement.mobileX}px`,
        '--mobile-y': `${placement.mobileY}px`,
        '--mobile-width': `${placement.mobileWidth}px`,
        '--map-rotate': `${placement.rotate}deg`,
      }}
    >
      <button type="button" onClick={() => onSelect(artwork.id)} aria-pressed={selected}>
        <span className="archive-map-artwork-sheet">
          <ResponsiveArtworkImage
            artwork={artwork}
            className="archive-map-artwork-image"
            sizes="(max-width: 800px) 28vw, 18vw"
            priority={placement.priority}
          />
        </span>
        <span className="archive-map-artwork-label">
          <strong>{artwork.id}</strong>
          <span>{seriesLabel}</span>
          <em>INSPECT</em>
        </span>
      </button>
    </article>
  );
}
