# Homepage Artifact Cave — Design QA

## Comparison target

- Source visual truth: `C:\Users\Windows 10\Downloads\ChatGPT Image Aug 18, 2026, 02_23_07 PM.png`
- Implementation: `http://127.0.0.1:5173/`
- Primary implementation screenshot: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\homepage_artifact_overview_1280x720.png`
- Desktop review viewport: 1280 × 720 CSS px in the in-app browser.
- Mobile review artifact: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\homepage_artifact_mobile_390x844.png`.
- States reviewed: overview, focused artwork, open field-note drawer, and narrow responsive composition.

## Evidence

- Side-by-side source/implementation comparison: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\design-qa-artifact-overview-comparison.png`
- Focused artwork: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\homepage_artifact_focus_1280x720.png`
- Open field note: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\homepage_artifact_fieldnote_1280x720.png`
- Mobile: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\homepage_artifact_mobile_390x844.png`

## Required fidelity surfaces

- Spatial language: dark recess at left, low limestone ceiling, broad central slab, restrained warmth, and strong edge framing preserve the reference's cave-stage hierarchy.
- Artwork hierarchy: seven canonical Vishnu Lal sheets now render at full contrast on distinct pale paper grounds with quiet borders, shadows, and work IDs. No multiply blending or wall-dissolve treatment remains.
- Navigation: the left index contains Enter, both series names, Archive, About the Practice, Notes / Voice, and Contact / Access. Only existing routes are interactive.
- Interaction: scrolling moves a single continuous camera route; the first artwork click focuses; a second click or the Field Note control opens the drawer; Archive Record remains the main CTA.
- Responsive behavior: the narrow layout reduces paper sizes, distributes the plates vertically, collapses the index, and converts the side drawer to a bottom sheet.

## Findings

- No actionable P0, P1, or P2 issues remain.
- The first drawer capture revealed the panel drifting upward inside the long sticky scene. Changing it from an absolute child to a viewport-fixed panel corrected the full-height state.
- The first mobile capture made the plates too large and overlapping. The narrow layout now uses smaller differentiated widths and a more vertical distribution.
- Acceptable P3 deviation: the implementation deliberately replaces the reference's welcome/featured-work hero copy with the requested artwork-first artifact wall.
- Acceptable P3 deviation: the generated cave wall is a quieter broad-slab environment rather than an exact reconstruction of the reference photograph.

## Runtime checks

- In-app browser overview, focus, drawer, close, and keyboard escape states were exercised.
- Browser console contained no application warnings or errors.
- Archive validation passed for 28 works and four derivatives per work.
- `npm run lint` passed.
- `npm run build` passed.

final result: passed
