import { MotionLink } from '../../motion/RouteMotion';
import { getSeriesData } from '../../lib/artwork';
import { formatArtworkDisplayId } from '../../lib/artworkDisplay';

export default function LandscapeRecordPanel({ artwork, isOpen, position, total, onClose, onMove, onOpenRecord }) {
  const series = artwork ? getSeriesData(artwork.seriesId) : null;
  const seriesPath = series ? `/${series.id}` : '/';

  return (
    <aside className={`landscape-record-panel${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen} aria-label={artwork ? `Artwork preview for ${formatArtworkDisplayId(artwork.id)}` : 'Artwork preview'} onPointerDown={(event) => event.stopPropagation()}>
      {artwork && <>
      <button className="landscape-record-close" type="button" onClick={onClose} aria-label="Close artwork preview">
        CLOSE
      </button>
      <p>ARTWORK</p>
      <h1 className="landscape-record-series-title">
        <span lang="ml">{series?.malayalamName}</span>
        <small>{series?.romanizedName}</small>
      </h1>
      <div className="landscape-record-fragment">
        <span>{series?.label}</span>
        <strong lang={artwork.id.toUpperCase().startsWith('THUNDU-') ? 'ml' : undefined}>{formatArtworkDisplayId(artwork.id)}</strong>
      </div>
      <p className="landscape-record-position">SELECTED OBJECT {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
      <div className="landscape-record-actions">
        <MotionLink to={`/artwork/${artwork.id}`} kind="focus" state={{ fromLandscape: true }} onClick={onOpenRecord}>
          OPEN ARTWORK RECORD <span aria-hidden="true">→</span>
        </MotionLink>
        <MotionLink to={seriesPath} kind="portal" onClick={onOpenRecord}>
          ENTER {series?.label?.toUpperCase()} <span aria-hidden="true">→</span>
        </MotionLink>
      </div>
      <div className="landscape-record-pagination">
        <button type="button" onClick={() => onMove(-1)}>PREVIOUS</button>
        <button type="button" onClick={() => onMove(1)}>NEXT</button>
      </div>
      </>}
    </aside>
  );
}
