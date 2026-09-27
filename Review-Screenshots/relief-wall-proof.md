# Desktop relief wall proof

Replaces the rejected panoramic Series I experiment. Only VL-A-001–006 are rendered in this proof. Mobile and Series II routes are unchanged.

## Construction

DesktopMarblePassage builds three-work groups automatically. A sequence selects one of four CSS bay templates (cut, stepped, offset, broad). The proof uses cut and stepped. Each work is a normal-flow child of a recessed niche with an attached ledge, so paper height determines its architectural enclosure. No artwork coordinates or panorama are used. Series-specific sequences are supported by the same renderer; Series II rollout awaits approval.

The small repeating 240 × 240 SVG supplies faint mineral grain. CSS border planes, inset lighting shadows, and protruding ledges form the architecture. Layered 1–2px paper edges, a tight bottom contact shadow, and softer wall shadows keep the paper seated. Hover changes brightness/shadow and reveals the record prompt without lifting the paper off the ledge.

## Field and growth

Each bay is max(1080px, viewport width minus 260px). Field width is 320px of outer space plus bay count times bay width. At 1440 × 900 the proof field is 2680px, giving 1255px of horizontal travel against the 1425px content viewport. Vertical scroll maps to the horizontal transform with a 240ms settling transition. Horizontal trackpad delta is also mapped to travel. Reduced-motion disables the transition.

12, 17, 30, and 100 input works produce 4, 6, 10, and 34 bays respectively; the final group may be incomplete. No new image or placement list is needed. These larger sets were not rolled out or performance-tested in this six-work visual proof. Natural image ratios are preserved. Explicit CMS presentation-weight fields remain future work.

## Review

Browser screenshots were shown inline for 1440 first bay, transition, second bay, local hover response, 1920 opening, and the unchanged 390 × 844 mobile carousel. Three complete artworks fit the opening. The transition contains neighboring bay content with no background reset. Labels were moved below the ledge after inspection. Click to VL-A-002 Archive Record and browser Back passed. Browser console reported no errors. Physical trackpad inertia was not tested.

Lint and Vite production build pass. The full npm build command still stops in the existing archive validator because archive-masters/Series 1 is absent in this checkout. No archive data was changed.

Files changed for this proof: src/components/landscape/DesktopMarblePassage.jsx, src/components/landscape/DesktopMarblePassage.css, public/homepage-2/relief-mineral-grain.svg, and this report. The previous panorama file remains on disk but is no longer referenced by this renderer.

Visual approval pending. Stop at the two-bay proof.
