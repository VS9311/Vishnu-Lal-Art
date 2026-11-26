import { MotionLink } from '../../motion/RouteMotion';
import { getAllSeries } from '../../lib/artwork';

export default function LandscapeIndex({ activeArtworkId }) {
  return (
    <nav className="landscape-index" aria-label="Archive landscape index">
      <div className="landscape-index-identity">
        <strong>VISHNU LAL</strong>

      </div>

      {getAllSeries().map((series) => <MotionLink key={series.id} to={`/${series.id}`} kind="portal">
        <span>{series.romanizedName.toUpperCase()}</span>
        <strong>{series.label.toUpperCase()}</strong>
        <em lang="ml">{series.malayalamName}</em>
      </MotionLink>)}

      <MotionLink className="landscape-index-artist" to="/artist" kind="portal">
        <span>THE ARTIST</span>
      </MotionLink>

      <div className="landscape-index-status" aria-live="polite">
        <span>{activeArtworkId ? 'ACTIVE OBJECT' : 'MOVE THROUGH THE FIELD'}</span>
        {activeArtworkId && <strong>{activeArtworkId}</strong>}
      </div>
    </nav>
  );
}
