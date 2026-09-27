export default function ArchiveMapIndex({ open, counts, activeRegion, onToggle, onTravel }) {
  return (
    <div className={`archive-map-index-wrap${open ? ' is-open' : ''}`}>
      <div className="archive-map-identity" aria-label="The Vishnu Lal Archive">
        <strong>VISHNU LAL</strong>
        <span>THE ARCHIVE</span>
      </div>

      <button className="archive-map-index-toggle" type="button" onClick={onToggle} aria-expanded={open}>
        {open ? 'CLOSE INDEX' : 'ARCHIVE INDEX'}
      </button>

      {open && (
        <nav className="archive-map-index" aria-label="Archive map index">
          <button className={activeRegion === 'all' ? 'is-active' : ''} type="button" onClick={() => onTravel('all')}>
            <span>ALL WORKS</span>
            <small>{counts.all}</small>
          </button>
          <button className={activeRegion === 'series-i' ? 'is-active' : ''} type="button" onClick={() => onTravel('series-i')}>
            <span>SERIES I</span>
            <small>{counts.seriesI}</small>
            <strong lang="ml">അനാമം</strong>
            <em>ANAMAM</em>
          </button>
          <button className={activeRegion === 'series-ii' ? 'is-active' : ''} type="button" onClick={() => onTravel('series-ii')}>
            <span>SERIES II</span>
            <small>{counts.seriesII}</small>
            <strong lang="ml">അന്തരാളം</strong>
            <em>ANTHARALAM</em>
          </button>
          <a href="/">RETURN TO ENTRANCE</a>
        </nav>
      )}
    </div>
  );
}
