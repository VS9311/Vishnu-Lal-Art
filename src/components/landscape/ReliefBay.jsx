import { Link } from 'react-router-dom';
import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';

export default function ReliefBay({ bay, index, seriesId, artworkRefs, saveSelection }) {
  return <section className={`collection-bay collection-bay--${bay.family}`} style={{ '--bay-shift': `${bay.shift}px`, '--edge-inset': `${bay.inset}px` }} aria-label={`Collection bay ${index + 1}`}>
    <div className="collection-bay-composition">
      <div className="collection-bay-architecture" aria-hidden="true">
        {bay.planes.map((plane, planeIndex) => <span key={planeIndex} className={`collection-plane collection-plane--${plane.kind}`} style={{ left: `${plane.x}%`, width: `${plane.w}%`, bottom: `${plane.base}px`, height: `${plane.h}px`, '--plane-depth': `${plane.depth || 0}px` }} />)}
      </div>
      {bay.slots.map(({ artwork, orientation, x, base, width }) => <Link
        key={artwork.id} id={`marble-${artwork.id}`} className={`marble-passage-work collection-paper collection-paper--${orientation}`}
        style={{ left: `${x}%`, bottom: `${base}px`, '--paper-width': `${width}px` }}
        ref={node => { if (node) artworkRefs.current.set(artwork.id, node); else artworkRefs.current.delete(artwork.id); }}
        to={`/homepage-2/artwork/${artwork.id}`} state={{ fromCollection: seriesId }}
        onClick={() => saveSelection(artwork.id)} aria-label={`View archive record for ${artwork.id}`}>
        <span className="landscape-artwork-sheet"><ResponsiveArtworkImage artwork={artwork} className="landscape-artwork-image" sizes="(min-width:801px) 300px, 60vw" priority={index === 0} /></span>
        <span className="marble-passage-work-label"><strong>{artwork.id}</strong><em>VIEW ARCHIVE RECORD ↗</em></span>
      </Link>)}
    </div>
  </section>;
}
