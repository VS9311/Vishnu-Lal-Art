import { Link } from 'react-router-dom';

function catalogueEntries(catalogue) {
  if (!catalogue) return [];
  const allowed = new Set(['medium', 'support', 'dimensions']);
  return Object.entries(catalogue).filter(([key, value]) => allowed.has(key.toLowerCase()) && value);
}

function formalExcerpt(record) {
  const composition = record?.formalObservation?.Composition;
  if (!composition) return null;
  return composition.split('\n\n')[0].trim();
}

export default function ArchiveMapPanel({ artwork, record, position, total, onClose, onMove, onOpenRecord }) {
  if (!artwork) return null;

  const isSeriesI = artwork.seriesId === 'series-i';
  const entries = catalogueEntries(record?.catalogue);
  const observation = formalExcerpt(record);

  return (
    <aside className="archive-map-panel" aria-label={`Inspect ${artwork.id}`}>
      <button className="archive-map-panel-close" type="button" onClick={onClose}>CLOSE</button>
      <p className="archive-map-panel-kicker">ARCHIVE OBJECT</p>
      <h1>{artwork.id}</h1>

      <div className="archive-map-panel-series">
        <span>{isSeriesI ? 'SERIES I' : 'SERIES II'}</span>
        <strong lang="ml">{isSeriesI ? 'അനാമം' : 'അന്തരാളം'}</strong>
        <em>{isSeriesI ? 'ANAMAM' : 'ANTHARALAM'}</em>
      </div>

      {entries.length > 0 && (
        <dl className="archive-map-panel-metadata">
          {entries.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>
      )}

      {observation && (
        <section className="archive-map-panel-observation">
          <h2>FORMAL OBSERVATION</h2>
          <p>{observation}</p>
        </section>
      )}

      <p className="archive-map-panel-position">SELECTED OBJECT {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>

      <div className="archive-map-panel-actions">
        <Link to={`/archive/${artwork.id}`} state={{ fromArchiveMap: true }} onClick={onOpenRecord}>VIEW FULL RECORD</Link>
        <Link to={`/archive/${isSeriesI ? 'series-i' : 'series-ii'}`}>ENTER {isSeriesI ? 'SERIES I' : 'SERIES II'}</Link>
      </div>

      <div className="archive-map-panel-pagination">
        <button type="button" onClick={() => onMove(-1)}>PREVIOUS</button>
        <button type="button" onClick={() => onMove(1)}>NEXT</button>
      </div>
    </aside>
  );
}
