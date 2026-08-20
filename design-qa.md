# Approved Cave Homepage — Refinement QA

## Comparison target

- Source visual truth: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-before-opening-1440x900.png`
- Refined implementation: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-after-opening-1440x900.png`
- Local implementation: `http://127.0.0.1:5173/`
- Viewport: 1440 × 900 CSS px at device scale factor 1.
- Source pixels: 1440 × 900.
- Implementation pixels: 1440 × 900.
- State: opening overview. Additional checks cover mid-travel, focused artwork, the field-note drawer, 1920 × 1080, and 1366 × 768.

## Evidence

- Full-view before/after comparison: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-before-after-1440x900.png`
- Focused index-and-wall comparison: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-before-after-detail.png`
- 1366 × 768 opening: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-after-opening-1366x768.png`
- 1920 × 1080 opening: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-after-opening-1920x1080.png`
- Mid-travel: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-after-midtravel-1440x900.png`
- Focused work: `E:\Vishn uLl\Lal Website - Cave V1\Review-Screenshots\refinement-after-focus-VL-A-016-1440x900.png`

## Required fidelity surfaces

- Fonts and typography: the approved serif identity, Malayalam labels, and monospaced index are unchanged. Index contrast increased subtly without changing size or placement.
- Spacing and layout rhythm: the approved cave crop and asymmetrical wall remain intact. Two primary anchors, three secondary works, and two quieter works now create a clearer scan without forming a grid.
- Colors and visual tokens: the cave asset and overall exposure are unchanged. Presentation-only paper brightness, warmth, shadow, and local-light values vary by position and hierarchy.
- Image quality and asset fidelity: the same seven canonical WebP derivatives are used. Source artwork files remain untouched; paper remains opaque and readable in every state.
- Copy and content: identity, verified series labels, Archive count, field-note structure, and approved observation are unchanged. No routes or curatorial copy were added.

## Findings

- No actionable P0, P1, or P2 issues remain.
- P3: the field-note drawer is intentionally not included in the final screenshot set because this pass did not change its visual design; its width, height, CTA, and pagination were exercised in the browser.
- P3: the travel route remains deliberately restrained, so mid-travel changes geography and scale subtly rather than creating a visibly different artwork waypoint.

## Comparison history

1. P2 — the first reduced focus scale exposed black viewport edges when approaching works near the top, right, or bottom of the wall. Focus offsets are now clamped to the scaled cave bounds. All seven focus targets were measured and cover the full 1440 × 900 viewport.
2. P2 — dimming non-focused works with opacity made their paper partially transparent and visually too close to the rejected wall-blend treatment. Non-focused sheets now remain fully opaque and recede through presentation-only brightness and saturation instead.

## Interaction and runtime checks

- Continuous wheel movement changed scroll position by the exact wheel delta and did not snap to an artwork.
- Mid-travel camera position was captured at 52% of the 5580 px route range.
- All seven click-to-focus states were checked for viewport coverage.
- VL-A-016 focus, Field Note open/close, Archive Record href, drawer dimensions, and Escape behavior were exercised.
- Field-note drawer remained 360 × 900 at the 1440 × 900 viewport.
- Browser console and page-error checks returned no warnings or errors.
- `npm run lint` passed.
- Production build and Archive validation passed.

final result: passed
