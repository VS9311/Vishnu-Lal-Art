import React from 'react';
import './MalayalamMarker.css';

/**
 * MalayalamMarker
 * Renders an archival Malayalam display word with charcoal/graphite materiality.
 * 
 * @param {string} text - The Malayalam approved text (e.g. 'അനാമം', 'അന്തരാളം', 'കാലത്തിന്റെ വിരുതം', 'കാലത്തിന്റെ മറവ്', 'കാലത്തിന്റെ സ്വപ്നം')
 * @param {string} label - Optional quiet English mono annotation
 * @param {string} align - 'left' | 'center' | 'right' | 'asymmetric'
 * @param {string} className - Additional CSS class for layout placement
 */
export default function MalayalamMarker({ text, label, align = 'left', className = '' }) {
  if (!text) return null;

  return (
    <div className={`malayalam-marker-wrapper align-${align} ${className}`} aria-label={label ? `${text} — ${label}` : text}>
      {/* Hidden SVG Filter Definition for Graphite/Charcoal Tooth */}
      <svg className="malayalam-filter-def" aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="graphite-grain" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="textured" />
            <feGaussianBlur in="textured" stdDeviation="0.12" result="smoothed" />
            <feMerge>
              <feMergeNode in="textured" />
              <feMergeNode in="smoothed" opacity="0.35" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="malayalam-marker-inner">
        {label && <span className="malayalam-marker-label">{label}</span>}
        <span className="malayalam-marker-text" lang="ml">
          {text}
        </span>
      </div>
    </div>
  );
}

