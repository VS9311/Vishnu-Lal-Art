import { MotionLink } from '../../motion/RouteMotion';
import { getAllSeries, getSeriesArtworks } from '../../lib/artwork';

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

      {getAllSeries().map((series) => <MotionLink key={series.id} to={`/${series.id}`} kind="portal">
        <span>{series.label.toUpperCase()}</span>
        <strong lang="ml">{series.malayalamName}</strong>
        <em>{series.romanizedName.toUpperCase()}</em>
        <small>{getSeriesArtworks(series.id).length} WORKS</small>
      </MotionLink>)}

      <MotionLink className="landscape-index-artist" to="/artist" kind="portal">
        <span>THE ARTIST</span>
        <em>OUTSIDE THE SYSTEM</em>
      </MotionLink>

      <div className="landscape-index-status" aria-live="polite">
        <span>{activeArtworkId ? 'ACTIVE OBJECT' : 'MOVE THROUGH THE FIELD'}</span>
        {activeArtworkId && <strong>{activeArtworkId}</strong>}
      </div>
    </nav>
  );
}
