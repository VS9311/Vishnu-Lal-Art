import { MotionLink } from '../../motion/RouteMotion';

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

      <MotionLink to="/series-i" kind="portal">
        <span>SERIES I</span>
        <strong lang="ml">അനാമം</strong>
        <em>ANAMAM</em>
        <small>17 WORKS</small>
      </MotionLink>

      <MotionLink to="/series-ii" kind="portal">
        <span>SERIES II</span>
        <strong lang="ml">അന്തരാളം</strong>
        <em>ANTHARALAM</em>
        <small>12 WORKS</small>
      </MotionLink>

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
