# Shared collection bays — first proof

Root: E:/Vishn uLl/Lal Website - Cave V1. Branch: mobile-marble-carousel-v1. Existing dirty worktree preserved. No commit or push performed.

## Files changed in this refinement

- src/components/landscape/reliefLayout.js (new): families, Series configuration, proof selection, orientation classification, assignment and variation.
- src/components/landscape/ReliefBay.jsx (new): one reusable component for architecture and artwork slots.
- src/components/landscape/DesktopMarblePassage.jsx: shared scroll renderer, bay composition, actual image dimension measurement.
- src/components/landscape/DesktopMarblePassage.css: shared planes and ledges, paper seating, responsive field.
- src/pages/MarbleArchive.jsx: both desktop Series use the shared renderer; mobile branch preserved verbatim; Archive Record and acquisition code preserved.
- scripts/test-relief-layout.mjs (new): assignment, orientation, uniqueness and growth checks.
- Review-Screenshots/relief-collection-bays-report.md (this report).

## Architecture

MarbleSeriesPage selects the approved MobileMarbleHomepage at widths up to 800px. Above that, both Series use DesktopMarblePassage → ReliefBay. reliefLayout.js supplies the geometry and assignments. Proof selection is a separate boundary from the general renderer, so removing the proof cap later does not change layout logic.

Four families: levels (one shared recess, staggered ledges), cut (portrait anchor with adjacent shallow plane), broad (two works sharing a recess/ledge plus one projecting ledge), open (quiet plane and long low ledge). Series I sequence is levels/cut/broad/open; Series II is open/broad/cut/levels. Only three I bays and one II bay are populated now.

Architecture is CSS planes with the existing subtle SVG grain. Geometry configuration contains x position, baseline, span, height and depth. Slot configuration contains x position, baseline, preferred orientation and paper scale. Shared baselines seat paper directly on ledges. Deterministic per-group vertical shifts and edge notches introduce controlled variation; families also vary depth, incomplete edges, spans and spacing. No panorama, artwork-specific CSS selectors or per-artwork React components are used.

Paper padding is reduced to 2px with a tiny edge, tight contact shadow and restrained warm wall shadow. Hover alters brightness/shadow without enlarging or lifting paper. Click opens the existing Archive Record.

## Orientation and assignment

Width/height ratios below .87 classify portrait, above 1.15 landscape, otherwise near-square. When dimensions are absent, orientation is used as fallback. Exact compatible slots are claimed first; remaining works use flexible slots. Paper width is capped by both orientation and maximum height, preserving natural image ratios. Optional presentationSize small/medium/large affects the paper scale.

Browser inspection revealed some Series II summary dimensions disagree with the actual canonical images. The desktop renderer measures natural image dimensions on load and locally recalculates layout; no metadata is rewritten. Accurate future CMS dimensions avoid this settling adjustment. No images are cropped or stretched.

I proof IDs: VL-A-001, 002, 003, 004, 005, 006, 007, 016, 009. The actual landscape VL-A-016 exercises broad-bay assignment. II proof IDs: VL-B-001, 002, 003. Canonical catalogue order and data are untouched; spatial slot order can differ within a group.

## Continuous field and responsiveness

Bay widths clamp between 1000 and 1320px, normally viewport width minus 260px. The field is the sum of bays plus 320px outer space. At 1440 the three-bay field is 3860px, with about 2435px travel after the scrollbar. At 1920/2560 bay width caps at 1320px, revealing neighboring content without enlarging paper. Top positioning caps at 185px so tall screens do not push the artwork field down. Short screens use an .88 composition scale.

Vertical scrolling moves one continuous field; horizontal trackpad delta is mapped to the same movement. No snapping or artwork zoom. Material is continuous across bay boundaries and ledges extend into adjacent visual space. Reduced-motion disables travel easing.

Future CMS records can provide id, series, width/height or orientation, optional presentationSize, plus the existing artwork asset mapping. Automatic grouping handles partial final groups. Algorithm checks covered 12, 17, 30, 100 and 103 records with no duplicates and deterministic output. Large-set browser performance/virtualization is not certified by this proof.

## Verification

Inline browser screenshots: Series I opening/levels, transition to cut, cut, broad with landscape artwork, 1920x1080, 2560x1440, 1366x768, Series II open, and mobile Series I and II at 390x844. All nine desktop I images loaded, with nine unique controls and natural image ratios. II actual-image classification settled correctly to portrait. Existing Archive Record navigation passed. No runtime console errors were recorded.

Mobile components, state machine and styles were not edited. The original mobile branch still receives all 17/12 works. The mobile Next action was checked and settled from VL-B-001 to VL-B-002. Physical trackpad inertia was not hardware-tested.

Lint, Vite production bundling, whitespace checks, and layout checks passed. Current artwork validation and the full npm build wrapper remain blocked by the pre-existing absent archive-masters/Series 1 directory. No validation bypass or data change was made.

Stopped at proof scope. Visual approval pending before full Series population.
