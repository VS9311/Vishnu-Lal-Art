import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';

export default function LandscapeArtworkNode({ artwork, placement, selected, registerNode, onSelect }) {
  const seriesLabel = artwork.seriesId === 'series-i' ? 'SERIES I' : 'SERIES II';

  return (
    <article
      ref={(node) => registerNode(artwork.id, node)}
      className={`landscape-artwork is-${placement.presentation}${selected ? ' is-selected' : ''}`}
      data-artwork-id={artwork.id}
      style={{
        '--node-x': `${placement.x}px`,
        '--node-y': `${placement.y}px`,
        '--node-width': `${placement.width}px`,
        '--node-rotate': `${placement.rotate}deg`,
        '--mobile-base': `${placement.mobileBase}px`,
        '--mobile-left': `${placement.mobileLeft}%`,
        '--mobile-width': `${placement.mobileWidth}px`,
      }}
    >
      <button type="button" onClick={() => onSelect(artwork.id)} aria-pressed={selected}>
        <span className="landscape-artwork-sheet">
          <ResponsiveArtworkImage
            artwork={artwork}
            className="landscape-artwork-image"
            sizes="(max-width: 800px) 56vw, 24vw"
            priority={placement.priority}
          />
        </span>
        <span className="landscape-hover-note">
          <strong>{artwork.id}</strong>
          <span>{seriesLabel}</span>
          <em>VIEW FIELD NOTE</em>
        </span>
      </button>
    </article>
  );
}
