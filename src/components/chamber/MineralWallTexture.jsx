import React from 'react';

/**
 * MineralWallTexture provides inline SVG filters and procedural grain overlays
 * that give the chamber wall a tactile chalk / limestone / mineral excavation feel.
 */
export default function MineralWallTexture() {
  return (
    <div className="mineral-wall-texture-overlay" aria-hidden="true">
      <svg className="mineral-svg-defs" width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <filter id="mineral-grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045 0.045"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0.33 0.33 0.33 0 0
                      0    0    0    0.055 0"
            />
          </filter>
        </defs>
      </svg>
      <div className="mineral-grain-layer" />
      <div className="mineral-vignette-layer" />
      <div className="mineral-seams-layer" />
    </div>
  );
}
