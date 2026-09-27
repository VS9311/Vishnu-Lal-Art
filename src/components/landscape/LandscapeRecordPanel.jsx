import { Link } from 'react-router-dom';

export default function LandscapeRecordPanel({ artwork, isOpen, position, total, onClose, onMove, onOpenRecord }) {
  const isSeriesI = artwork?.seriesId === 'series-i';
  const seriesPath = isSeriesI ? '/homepage-2/series-i' : '/homepage-2/series-ii';

  return (
    <aside className={`landscape-record-panel${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen} inert={!isOpen} aria-label={artwork ? `Archive preview for ${artwork.id}` : 'Archive preview'} onPointerDown={(event) => event.stopPropagation()}>
      {artwork && <>
      <button className="landscape-record-close" type="button" onClick={onClose} aria-label="Close archive preview">
        CLOSE
      </button>
      <p>ARCHIVE OBJECT</p>
      <h1>{artwork.id}</h1>
      <div className="landscape-record-series">
        <span>{isSeriesI ? 'SERIES I' : 'SERIES II'}</span>
        <strong lang="ml">{isSeriesI ? 'അനാമം' : 'അന്തരാളം'}</strong>
        <em>{isSeriesI ? 'ANAMAM' : 'ANTHARALAM'}</em>
      </div>
      <p className="landscape-record-position">SELECTED OBJECT {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
      <div className="landscape-record-actions">
        <Link to={`/homepage-2/artwork/${artwork.id}`} state={{ fromLandscape: true }} onClick={onOpenRecord}>
          OPEN ARCHIVE RECORD <span aria-hidden="true">→</span>
        </Link>
        <Link to={seriesPath} onClick={onOpenRecord}>
          ENTER {isSeriesI ? 'SERIES I' : 'SERIES II'} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="landscape-record-pagination">
        <button type="button" onClick={() => onMove(-1)}>PREVIOUS</button>
        <button type="button" onClick={() => onMove(1)}>NEXT</button>
      </div>
      </>}
    </aside>
  );
}
