import { Link } from 'react-router-dom';

export default function LandscapeIndex({ activeRegion, activeArtworkId, onTravel }) {
  return (
    <nav className="landscape-index" aria-label="Archive landscape index">
      <div className="landscape-index-identity">
        <strong>VISHNU LAL</strong>
        <span>THE ARCHIVE</span>
      </div>

      <button className={activeRegion === 'all' ? 'is-active' : ''} type="button" onClick={() => onTravel(0)}>
        ALL WORKS
      </button>

      <Link to="/homepage-2/series-i">
        <span>SERIES I</span>
        <strong lang="ml">അനാമം</strong>
        <em>ANAMAM</em>
        <small>17 WORKS</small>
      </Link>

      <Link to="/homepage-2/series-ii">
        <span>SERIES II</span>
        <strong lang="ml">അന്തരാളം</strong>
        <em>ANTHARALAM</em>
        <small>12 WORKS</small>
      </Link>

      <Link to="/">RETURN TO ENTRANCE</Link>

      <div className="landscape-index-status" aria-live="polite">
        <span>{activeArtworkId ? 'ACTIVE OBJECT' : 'MOVE THROUGH THE FIELD'}</span>
        {activeArtworkId && <strong>{activeArtworkId}</strong>}
      </div>
    </nav>
  );
}
