import ResponsiveArtworkImage from '../artwork/ResponsiveArtworkImage';
import { getArtworkRecordPath } from './reliefLayout';
import { MotionLink } from '../../motion/RouteMotion';
import { formatArtworkDisplayId } from '../../lib/artworkDisplay';

export default function ReliefBay({ bay, index, seriesId, artworkRefs, saveSelection }) {
  return <section className={`collection-bay collection-bay--${bay.family}`} style={{ '--bay-shift': `${bay.shift}px`, '--edge-inset': `${bay.inset}px` }} aria-label={`Collection bay ${index + 1}`}>
    <div className="collection-bay-composition">
      <div className="collection-bay-architecture" aria-hidden="true">
        {bay.planes.map((plane, planeIndex) => <span key={planeIndex} className={`collection-plane collection-plane--${plane.kind}`} style={{ left: `${plane.x}%`, width: `${plane.w}%`, '--plane-base': `${plane.base}px`, height: `${plane.h}px`, '--plane-depth': `${plane.depth || 0}px` }} />)}
      </div>
      {bay.slots.map(({ artwork, orientation, x, base, width }) => <MotionLink
        key={artwork.id} id={`marble-${artwork.id}`} className={`marble-passage-work collection-paper collection-paper--${orientation}`}
        style={{ left: `${x}%`, '--slot-base': `${base}px`, '--paper-width': `${width}px` }}
        ref={node => { if (node) artworkRefs.current.set(artwork.id, node); else artworkRefs.current.delete(artwork.id); }}
        to={getArtworkRecordPath(artwork.id)} kind="focus" state={{ fromCollection: seriesId }}
        onClick={() => saveSelection(artwork.id)} aria-label={`View archive record for ${formatArtworkDisplayId(artwork.id)}`}>
        <span className="landscape-artwork-sheet"><ResponsiveArtworkImage artwork={artwork} className="landscape-artwork-image" sizes="(min-width:801px) 600px, 60vw" priority={index === 0} eager /></span>
        <span className="marble-passage-work-label"><strong>{formatArtworkDisplayId(artwork.id)}</strong><em>VIEW ARCHIVE RECORD ↗</em></span>
      </MotionLink>)}
    </div>
  </section>;
}
