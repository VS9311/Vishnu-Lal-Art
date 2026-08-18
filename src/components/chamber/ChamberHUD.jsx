import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ChamberHUD provides minimal, elegant floating status and navigation
 * in both Overview and Focused chamber modes.
 */
export default function ChamberHUD({
  currentWork,
  currentIndex,
  totalWorks,
  isFocused,
  onToggleOverview,
  onPrev,
  onNext,
}) {
  return (
    <aside className="chamber-hud" aria-label="Chamber Navigation Controls">
      <div className="chamber-hud-inner">
        {/* Left segment: Mode & Coordinates */}
        <div className="chamber-hud-meta">
          <span className="chamber-hud-badge">
            {isFocused ? 'FOCUSED OBSERVATION' : 'CHAMBER OVERVIEW'}
          </span>
          <span className="chamber-hud-sep" aria-hidden="true">·</span>
          <span className="chamber-hud-stratum">
            {isFocused && currentWork
              ? `STRATUM · ${String(currentIndex + 1).padStart(2, '0')} / ${String(totalWorks).padStart(2, '0')}`
              : `${totalWorks} WORKS EMBEDDED`}
          </span>
        </div>

        {/* Center segment: Active Artwork Info & Study Link */}
        {isFocused && currentWork && (
          <div className="chamber-hud-work-info">
            <span className="chamber-hud-work-id">{currentWork.id}</span>
            <Link
              to={`/archive/${currentWork.id}`}
              className="chamber-hud-study-btn"
              aria-label={`Open Paper Study Record for ${currentWork.id}`}
            >
              OPEN ARCHIVE RECORD <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Right segment: Navigation Controls */}
        <div className="chamber-hud-actions">
          {isFocused ? (
            <>
              <button
                type="button"
                className="chamber-btn nav-btn"
                onClick={onPrev}
                disabled={currentIndex <= 0}
                aria-label="Previous artwork along wall"
                title="Previous (Left Arrow)"
              >
                ← PREV
              </button>
              <button
                type="button"
                className="chamber-btn overview-toggle-btn active"
                onClick={onToggleOverview}
                aria-label="Return to Chamber Overview"
                title="Overview (Escape)"
              >
                <span className="icon" aria-hidden="true">⤢</span> OVERVIEW
              </button>
              <button
                type="button"
                className="chamber-btn nav-btn"
                onClick={onNext}
                disabled={currentIndex >= totalWorks - 1}
                aria-label="Next artwork along wall"
                title="Next (Right Arrow)"
              >
                NEXT →
              </button>
            </>
          ) : (
            <span className="chamber-hud-hint">
              CLICK ANY WORK TO FOCUS · SCROLL TO GLIDE
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
