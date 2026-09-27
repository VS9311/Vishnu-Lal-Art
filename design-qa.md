# Experimental Flat Archive Map — Design QA

## Comparison targets

- Idle-state visual truth: `C:\Users\Windows 10\.codex\generated_images\01a0135a-761f-7760-aec6-a7e651750542\exec-4667ceb2-59f3-412f-8412-4686d2005351.png` (displayed Option 1).
- Selected-state visual truth: `C:\Users\Windows 10\.codex\generated_images\01a0135a-761f-7760-aec6-a7e651750542\exec-27f93d9a-a4ab-48c1-acde-69fa68911515.png` (displayed Option 2).
- Browser-rendered idle implementation: `Review-Screenshots/archive-map-desktop-overview-1440x900.png`.
- Browser-rendered selected implementation: `Review-Screenshots/archive-map-desktop-selected-VL-B-006-1440x900.png`.
- Route: `/lab/archive-map`.
- CSS viewport: 1440 × 900; device scale factor: 1.
- Source pixels: 1488 × 1058 for both visual targets.
- Implementation pixels: 1440 × 900.
- Density normalization: each source was proportionally fitted to 1266 × 900 and horizontally centered on a 1440 × 900 bone-paper canvas before being placed beside the native 1440 × 900 implementation.

## Evidence

- Idle full-view comparison: `Review-Screenshots/archive-map-design-qa-overview-comparison.png`.
- Selected full-view comparison: `Review-Screenshots/archive-map-design-qa-selected-comparison.png`.
- Focused right-panel comparison: `Review-Screenshots/archive-map-design-qa-panel-detail.png`.
- Series I territory: `Review-Screenshots/archive-map-desktop-series-i-1440x900.png`.
- Series II territory: `Review-Screenshots/archive-map-desktop-series-ii-1440x900.png`.
- Hover state: `Review-Screenshots/archive-map-desktop-hover-VL-A-007-1440x900.png`.
- Previous/Next selection: `Review-Screenshots/archive-map-desktop-selected-next-1440x900.png`.
- Return to open map: `Review-Screenshots/archive-map-desktop-return-open-1440x900.png`.
- Compact Index open: `Review-Screenshots/archive-map-desktop-index-open-1440x900.png`.
- Mobile map: `Review-Screenshots/archive-map-mobile-overview-390x844.png`.
- Mobile selection sheet: `Review-Screenshots/archive-map-mobile-selected-VL-B-006-390x844.png`.

## Required fidelity surfaces

- Fonts and typography: the implementation preserves the Archive's serif identity, compact monospaced navigation and data labels, and Malayalam hierarchy. The selected-state panel closely follows Option 2's quiet editorial scale and optical weight. Restricted external font requests were unavailable during capture, so screenshots use declared local fallbacks; no layout failure resulted.
- Spacing and layout rhythm: Option 1's two irregular territories, large central transition field, varied node scale and sparse edge UI are preserved. Option 2's map/panel division and selected-work emphasis are preserved without importing Option 3's large left overlay.
- Colors and visual tokens: bone paper, warm ash, low-contrast graphite and charcoal-black artwork remain within the selected references' narrow palette. Selection attenuation is restrained and keeps every work visible.
- Image quality and asset fidelity: all twelve visible works use canonical responsive artwork derivatives. The generated concept drawings were not used. The environment is a dedicated low-contrast raster paper/graphite field rather than CSS-drawn decoration.
- Copy and content: IDs and public formal-observation excerpts come from canonical records. Unknown medium, support and dimensions are omitted. The live Index shows the current canonical counts (29 total, 17 Series I, 12 Series II) rather than the older 28/16/12 concept counts.

## Findings

- No actionable P0, P1 or P2 mismatch remains.
- [P3] Option 1 contains a few more micro-scale nodes than the proof. The implementation intentionally stops at twelve canonical works as requested.
- [P3] The canonical artwork proportions create slightly stronger visual contrast than the softer generated placeholders in the concept. This is intentional asset fidelity, not design drift.

## Comparison history

### Iteration 1

- [P2] Series territory titles collided with nearby works in the first browser overview.
  - Fix: moved both labels into dedicated negative-space zones.
  - Evidence: the final overview and both territory captures show readable titles without covering artwork.
- [P2] The first inspection panel occupied more width than Option 2 and reduced the visible map excessively.
  - Fix: reduced the desktop panel and camera reservation to 340px / 27vw.
  - Evidence: the focused panel comparison shows a closely matched editorial column while retaining more of the map.
- [P2] `VL-B-006` and `VL-B-012` overlapped too heavily in the Series II overview.
  - Fix: moved `VL-B-012` deeper into the lower-right territory.
  - Evidence: the final overview preserves readable separation and independent hit areas.

## Browser and interaction verification

- Twelve unique artwork nodes rendered.
- Drag movement changed the map transform.
- Wheel/trackpad movement changed the map transform.
- Series I, Series II and All Works Index actions moved the map without route reload.
- Hover identification was visible for `VL-A-007`.
- Selecting `VL-B-006` opened the right panel without remounting the field.
- Next selected `VL-B-008` within Series II.
- Closing returned to the open map without a reset.
- View Full Record opened `/archive/VL-B-006`.
- Browser Back restored `VL-B-006`, its open panel and the exact saved camera transform.
- Mobile selection opened the bottom sheet while retaining the selected work above it.
- No application console errors or non-font network failures were observed.

final result: passed

---

## Desktop Series I marble passage prototype — September 24, 2026

### Selected direction and implementation

- The approved visual target for this proof was generated option 2, the recessed-strata marble passage: `C:\Users\Windows 10\.codex\generated_images\01a0135a-761f-7760-aec6-a7e651750542\exec-37b67331-fba3-4a79-88b8-5cd9c5f305e2.png`.
- The production environment is `public/homepage-2/series-i-marble-passage-v1.png`, a 2172 × 724 (3:1) architecture-only panorama. It retains the selected target's pale limestone, long ledges, recessed bays, soft diffuse light, and asymmetric quarry-gallery character. No generated artwork or typography is baked into the scene.
- Series I uses six canonical live archive works: VL-A-001 through VL-A-006. The art remains responsive DOM content and links directly to its existing Archive Record route.
- A temporary source-versus-build comparison page was used to review the selected visual target and the implementation together at 1440 × 900. The temporary QA page and duplicated source image were removed after comparison.

### Findings and fixes

- [P1, fixed] The first motion version depended on a requestAnimationFrame loop. A hidden/background browser tab could retain the scroll position without painting the corresponding horizontal camera position. The passage now retargets the world transform directly from scroll state and uses a 240ms CSS transition for smooth continuous movement.
- [P2, fixed] The first artwork spacing left only two full works visible through part of the passage. The six placements were tightened across the two connected regions so the opening presents three full works, the middle presents two full works plus neighboring context, and the final region brings the last pair in without oversized gaps.
- The new desktop rules are isolated behind the existing 801px desktop breakpoint. The approved mobile Series experience remains the original `MobileMarbleHomepage` branch and the new passage component is not mounted on mobile.

### Visual and functional review

- At 1440 × 900, the opening, middle scroll position, next-region entry, and artwork focus/hover-equivalent state were visually reviewed. The artwork sheets meet ledges convincingly, remain restrained at roughly 170–240px wide, and keep their existing paper treatment rather than reading as baked-in decoration.
- At 1920 × 1080 and 2560 × 1440, the panorama fills the view through proportional cover cropping; the scene does not stretch and it avoids large empty beige margins. The opening continues to show approximately three full works with additional architectural breathing room.
- At 1366 × 768 there is no horizontal page overflow. At 390 × 844, the approved mobile carousel is unchanged and the desktop passage is absent.
- Vertical wheel/page scroll maps continuously to the horizontal passage with no snapping or zoom. The fixed Series label stays quiet and readable. Artwork hover/focus applies a small lift, restrained shadow, and record prompt; click opens the existing Archive Record. Browser Back restores the passage position for the selected work.
- Browser console: no runtime errors in a fresh Series I view.
- `npm run lint`, `npx vite build`, and `git diff --check`: passed. `npm run build` remains blocked by the pre-existing missing local `archive-masters/Series 1` directory during archive validation.

### Deliberate proof limits

- This milestone maps only the first six Series I works across two connected regions. Series II retains its existing desktop presentation and the canonical archive data is untouched.
- The architectural world is one generated 3:1 raster scaled and cropped responsively, not a procedural or tiled environment. Physical trackpad inertia was not available in browser automation; equivalent vertical scrolling, direct click, Back restoration, keyboard focus, and responsive layout were verified.

final result: passed

---

# Marble Homepage — Artwork Integration, 2026-09-17

## Scope and visual truth

- Route: `/homepage-2`; improve artwork scale, paper lighting and physical contact with existing stone platforms.
- Material reference: `C:/Users/Windows 10/Downloads/cb034e5c-f549-40a1-a54f-107d0b6a0fe1.png` (1672 × 941).
- Exact before state: `Review-Screenshots/marble-integration-before.png` (1213 × 901).
- Revised same overview state: `Review-Screenshots/marble-integration-after.png` (1213 × 901).
- Desktop browser reported 1228 × 912 CSS px; browser screenshot export is 1213 × 901. Before/after exports match exactly; no density change between them.
- Original reference has a wider aspect ratio and different concept drawings. It is used for material integration, not a claim of pixel-identical composition or matching artwork content.
- Full comparison: `Review-Screenshots/marble-integration-comparison.jpg`; all three images fitted proportionally into equal-width columns.
- Contact detail: `Review-Screenshots/marble-integration-contact-detail.jpg`; crops show paper tone and contact rather than measuring scale (crop enlargement differs).
- Desktop selected state: `Review-Screenshots/marble-integration-selected.png`.
- Phone selected state: `Review-Screenshots/marble-integration-mobile.png`; 390 × 844 CSS viewport, temporary viewport override reset after checking.

## Findings and comparison history

Initial comparison found:

- [P1, fixed] Bright blue-white paper and boosted contrast separated the artwork from the warm marble lighting. Applied a local grayscale/contrast adjustment and multiply compositing against warm paper within each isolated sheet. Original artwork files and Study View rendering are unchanged.
- [P2, fixed] Centre portrait dominated the platform, and lower-right work clipped the overview. Resized all six works according to their individual slab and retained their intrinsic aspect ratios.
- [P2, fixed] Centre-based positioning and enlarging hover effects made bottom edges drift. Positions now represent slab contact coordinates, with bottom anchoring and no hover enlargement.
- [P2, fixed] Broad floating shadows did not describe contact. Replaced them with short, directional contact shadows, restrained edge thickness, and slight bottom-origin perspective.
- [P2, fixed] Focus dimmed surrounding works unnaturally. Kept their scene lighting stable and positioned the selected artwork in the visible area beside the panel.
- [P2, fixed] Mobile placements were independent of repeating stone surfaces. Aligned their bottom anchors to the corresponding platform in each existing 580px background repeat.

Post-fix combined comparison confirms warmer paper consistent with the material reference, smaller centre work, fully visible right foreground work, and bottom edges on the platform surfaces. Close-up inspection confirms the contact treatment stays attached during selection. No actionable P0/P1/P2 finding remains within this adjustment scope.

## Required fidelity surfaces

- Typography: existing fonts, sizes, labels and panel hierarchy preserved.
- Spacing/layout: six unique works retain intrinsic ratios; individual widths and contact anchors corrected; navigation layout preserved.
- Colors: paper whites now inherit warm ambient tone; charcoal remains readable without the previous blue cast or boosted contrast.
- Image fidelity: canonical responsive images and the existing marble raster reused; no artwork regeneration, cropping or derivative changes.
- Copy/content: IDs, series names, counts and record links unchanged.

## Verification and limitations

- Browser overview, selection, Next, close and All Works checked. Selected work and platform remain together during camera movement.
- Phone selection and bottom sheet checked; all six images loaded. DOM measurements place artwork bottoms within 0.8px of their intended 860/1440/2020/2600/3180/3760px anchors (rotation accounts for the fractional difference).
- No browser error logs returned during checks.
- `npm run lint`: passed. `npx vite build`: passed. Canonical archive validator not rerun because no metadata or derivative file was changed.
- [P3, retained] Mobile still uses the existing repeating marble field; joins between repeats are visible. This pass adjusts artwork integration rather than rebuilding that environment.
- [P3, retained] This remains compositing on a photographic backdrop, with fixed-light shadows rather than a realtime 3D lighting model.

final result: passed

---

# Mobile Marble Podium — Selected First Direction, 2026-09-18

## Source and implementation

- Selected visual truth: `C:/Users/Windows 10/.codex/generated_images/01a0135a-761f-7760-aec6-a7e651750542/exec-9817ba23-55c0-4be3-8086-1c547d5c60ac.png` (853 × 1844), the first displayed mobile concept chosen by the user.
- Route: `/homepage-2`, mobile layout at widths up to 800px. Existing desktop composition retained.
- Implementation overview: `Review-Screenshots/mobile-podium-opening-final.png` (390 × 844).
- Implementation details: `Review-Screenshots/mobile-podium-details-final.png` (390 × 844).
- Combined comparison: `Review-Screenshots/mobile-podium-review.jpg` (1170 × 878). Source proportionally fitted into a 390 × 844 column beside the two native browser captures; no image distortion.
- Full-view comparison provides sufficient resolution for paper edges, podium contact and control labels; all columns use the target phone scale. A separate enlarged crop was not needed.
- Additional evidence: `mobile-podium-landscape-v1.png`, `mobile-podium-small-phone.png`, `mobile-podium-large-phone.png`, and `mobile-podium-desktop-regression.png` in `Review-Screenshots/`.

## Implementation

- `src/pages/LandscapeHomepage.jsx`: responsive component selection with a subscribed media query.
- `src/components/landscape/MobileMarbleHomepage.jsx`: swipe gesture, Previous/Next, six direct-selection thumbnails, compact series index, collapsible details, and full-record return state.
- `src/components/landscape/MobileMarbleHomepage.css`: portrait scene, bottom-anchored artwork presentation, accessible button hit areas, and details panel with its own browsing controls.
- `public/homepage-2/mobile-marble-podium-v1.png`: environment-only photographic backdrop generated with the built-in image tool. All visible artworks remain canonical responsive assets, without alteration.

## Asset generation

The selected concept was attached as the edit source. Prompt: "Edit this selected mobile website mockup into an EMPTY photographic background asset for implementing it. Preserve precisely the portrait composition, warm white marble material, camera, soft natural illumination, wall, floor and three podiums. REMOVE ALL artworks including their frames and shadows: remove central large artwork, both side artworks, and all six thumbnails at bottom. REMOVE ALL text, logos, labels, rules, buttons, arrows, UI, numbers, lines. Fill removed regions naturally with plain warm plaster wall or marble floor. Keep the large central marble podium exactly in the same position, from about 54% to 71% image height, with its flat upper contact surface at 55% height. Keep cropped side podiums at the left/right, their top surfaces at 49% height. Upper 50% is uninterrupted softly textured offwhite wall. Bottom 28% is continuous softly textured marble floor with very faint veins, uncluttered to hold live text later. Output same tall portrait aspect 390:844. Absolutely NO drawings, frames, text or UI anywhere. Photographic scene only, no replacements for removed art."

## Required fidelity surfaces

- Typography: retains serif Archive identity and mono controls. Real readable buttons replace raster labels. Previous/Next are text buttons rather than the concept's decorative arrow marks.
- Layout: hero artwork, central podium, peeking neighbours, caption and six thumbnails match the selected hierarchy. Intrinsic artwork ratios are preserved, so landscape works are shorter than portraits. Controls remain separate from the artwork.
- Colors: warm paper, off-white stone and charcoal remain consistent with the selected concept and approved desktop treatment.
- Image quality: no generated drawings are used in the build. Environment is a separate raster; canonical artwork is interactive and fully visible on the central podium.
- Content: current artwork ID and canonical series labels drive both views. No unverified dimensions, medium or provenance are introduced. The proof continues to use the existing six unique artworks.

## Comparison history

- [P1, fixed] Initial swipe pointer capture prevented a normal tap on the hero from opening details. Capture now stays on the pressed button; both taps and horizontal drags were retested.
- [P2, fixed] The first Details button had a 34px hit height. Increased to 44px and tightened the thumbnail gap to retain composition.
- [P2, fixed] At 320 × 568, the minimum-height scene clipped the final count. Increased the small scene's minimum height; natural vertical scrolling now reaches all thumbnails and the count without horizontal overflow.
- Post-fix comparison shows the intended first concept implemented with stable artwork contact and live controls. The details state leaves the hero artwork visible at the design viewport and keeps all six choices available.
- No actionable P0/P1/P2 issue remains within the first mobile proof.

## Verification

- Browser widths checked: 320 × 568, 390 × 844, 430 × 932; desktop viewport restored and visually checked afterward.
- Hero tap opens details. Thumbnail selection switches directly to another artwork while details remain open.
- Horizontal pointer swipe changed VL-B-011 to VL-B-010 with details still open.
- Series II index action selects its first displayed artwork and closes the index.
- View Full Record navigates to `/archive/VL-B-011`; browser Back restored VL-B-011 and the open details panel.
- Escape closes details and returns focus to its toggle.
- Small-screen thumbnails measured at least 44px wide and were reachable by scrolling; page had no horizontal overflow.
- No new browser errors during final checks or reload. Two retained Vite hot-reload errors from the initial file-creation sequence on September 17 were historical, not current runtime failures.
- `npm run lint`: passed. `npx vite build`: passed. `git diff --check`: no whitespace errors (existing line-ending warnings only).

## Limits and follow-up polish

- Tested in browser phone viewports and with pointer gestures; physical iOS/Android touch testing remains to be done.
- Short phones scroll to the controls instead of compressing artwork or touch targets. The details region can scroll independently when needed.
- Artwork changes currently use a short fade rather than tracking the finger continuously. Reduced-motion preferences disable the animation.
- The desktop sidebar/navigation redesign discussed previously is outside this selected mobile proof and has not been implemented.

final result: passed

## Marble collections and acquisition flow — September 23, 2026

Implemented scoped routes `/homepage-2/series-i`, `/homepage-2/series-ii`, and `/homepage-2/artwork/:id`. Existing cave, archive, and map routes remain intact. Homepage Series links and record previews now use this connected marble flow.

### Visual comparison

Compared `mobile-podium-desktop-regression.png` and `mobile-podium-opening-final.png` with `marble-series-ii-desktop.png` and `marble-series-ii-mobile.png` together. The collections reuse the approved stone backgrounds, warm paper treatment, serif identity, mono controls, and intrinsic artwork proportions. Desktop uses successive six-work platform scenes to include the entire collection; mobile extends the approved swipeable podium with a horizontally scrolling selection strip. Detail pages retain a podium image beside the catalogue, stacking on mobile.

- Fixed initial collection heading/artwork overlap by reducing presentation size and tightening the heading area. Tablet widths omit the secondary introduction.
- Fixed homepage reload failure caused by a pagehide event being saved as an artwork ID; saved selections are validated and pagehide now uses an explicit callback.
- Fixed dialog focus restoration and kept the selected mobile thumbnail visible when browsing longer collections.

### Verification

- Series I exposes 17 public works, including VL-A-018; Series II exposes all 12. No unpublished VL-A-017 is introduced.
- Browser-tested homepage Series link, collection-to-record navigation, Series II formal observation expansion, last-work boundary, mobile last-thumbnail selection, and return to the selected work.
- Screenshots: `marble-series-i-desktop.png`, `marble-series-ii-desktop.png`, `marble-record-desktop.png`, `marble-record-mobile.png`, `marble-series-ii-mobile.png`, `marble-purchase-desktop.png`, and `marble-inquiry-small-phone.png` in `Review-Screenshots`.
- Desktop and 390px mobile reviewed; 320×568 inquiry dialog checked for scrolling, horizontal overflow (none), Escape dismissal, and focus return to its trigger.
- Both email addresses and both +91 WhatsApp destinations produce artwork-specific inquiry/purchase drafts, including an optional note. Draft destinations and encoded contents were inspected without sending messages or making purchases.
- `npm run lint`, `npx vite build`, and `git diff --check` passed. This is a frontend build check, not the external-master archive validator.

### Boundaries

Purchase is a personal request, not a payment checkout. Availability and prices are not invented. Records without published descriptive data honestly offer further details on inquiry. Mail/WhatsApp app delivery and physical phone testing remain outside local browser verification. The original homepage stays visually unchanged apart from linking to the new destinations. No commit, push, or deployment performed.

Final result: passed for local preview review.

## Homepage 2 responsive and interaction polish — September 23, 2026

### Source and comparison

- Approved source captures: `Review-Screenshots/mobile-podium-desktop-regression.png` (1213 × 901, smaller desktop) and `Review-Screenshots/mobile-podium-opening-final.png` (390 × 844, mobile). The user's current Homepage 2 was also inspected in the browser before edits at a 1920 × 1080 CSS viewport.
- Implementation captures: `Review-Screenshots/homepage2-polish-1366x768.png`, `homepage2-polish-1440x900.png`, `homepage2-polish-1920x1080.png`, `homepage2-polish-2560x1440.png`, and `homepage2-polish-mobile-opening-a007.png`.
- Interaction captures: `homepage2-polish-panel-open.png`, `homepage2-polish-panel-switched.png`, `homepage2-polish-panel-outside-closed.png`, `homepage2-polish-mobile-current.png`, `homepage2-polish-mobile-mid-next.png`, and `homepage2-polish-mobile-next-settled.png`.
- The desktop browser was configured at 1366 × 768, 1440 × 900, 1920 × 1080, and 2560 × 1440 CSS pixels. The browser capture area excludes its scrollbar and some surrounding UI; saved PNGs measure 1351 × 760, 1425 × 891, 1905 × 1072, and 2545 × 1370 respectively. The mobile source and final opening capture are both exactly 390 × 844. No density rescaling was needed for the mobile comparison. For desktop, frame/crop were compared by scene landmarks because the older source was captured at a different viewport.

### Findings and fixes

- [P1, fixed] The opening camera used a fixed 0.48 scale at every desktop width. At 2560 × 1440 it occupied only 1605 × 903 CSS pixels. The opening scale now responds to usable width and viewport height, with a 0.48 floor for approved smaller desktops and a 0.65 ceiling. At 2560 × 1440 the rendered world is 1972 × 1110, roughly 83% of the width after the navigation rail and 77% of the viewport height. The 1366 and 1440 compositions remain at the former scale; 1920 remains at the former 1605 × 903 because the height constraint already fills 84% of that viewport.
- [P2, fixed] The desktop information panel existed only while an artwork was selected, causing remount/entry animation on every switch. The panel element stays mounted, slides in/out via class state, keeps its content while closing, ignores pointerdown inside itself, and closes on outside pointerdown. Artwork pointerdown is excluded so another artwork updates the open panel directly. Escape and the visible Close control return focus to the selected artwork.
- [P1, fixed] The mobile stage previously remounted three slot images and changed the caption immediately. Homepage 2 now keeps all six artwork buttons/images mounted; adjacent works animate between left, center, and right anchors, changing position and scale over 720 ms. The ID, series, thumbnail selection, and detail content update after the move completes. Distant thumbnail choices prepare the chosen work at the nearest side anchor and take one direct move. Reduced motion uses 120 ms movement and a 140 ms identity delay. The photographic environment, artwork set, typography, and metadata are unchanged. Mobile Series pages retain their original three-slot presentation.

### Visual and functional review

- Source and final mobile opening captures were compared together at the same 390 × 844 state. The center artwork, stone contact, text, strip, image quality, paper treatment, and warm palette remain aligned. The side images now use persistent artwork elements; their crops differ slightly as an expected result of continuous movement.
- Desktop captures show the same artwork set, navigation typography, color palette, background image, and platform placements. At 2560 the scene fills more of the width while retaining outer breathing room and keeping all six works visible. At 1366 and 1440 the approved hierarchy remains. No actionable typography, copy, color, or asset-fidelity drift was found.
- The mid-transition capture visibly shows the outgoing and incoming works moving across the fixed stone environment while the old record remains active. The settled capture shows the new ID and thumbnail state. All six artwork stage nodes and images remained mounted and loaded during the tested thumbnail transition. Swipe, adjacent Next, distant thumbnail selection, and details-open switching passed.
- The desktop panel stayed open when clicked inside, switched from VL-A-007 to VL-A-018 without leaving its accessibility node, closed via outside click, Escape, and Close, and restored focus after Escape/Close. The 320 × 568 phone check found no horizontal overflow; the Series II stage still used its original three slots. A fresh local browser tab produced no console errors.
- `npm run lint`, `npx vite build`, and `git diff --check` passed. `npm run build` remains blocked by its pre-existing archive validator because `archive-masters/Series 1` is missing from this local checkout; no archive data setup was changed in this polish pass.

Final result: passed

---

## Desktop Homepage 2 focus camera — September 24, 2026

### Visual truth and review

- Preserved source: `Review-Screenshots/homepage2-polish-1440x900.png`, the approved marble overview. The environment, navigation, six artwork placements, assets, typography, and panel design remain unchanged.
- Live implementation proof was captured in the in-app browser at a 1440 × 900 viewport for the overview, VL-A-007 (far-left), VL-B-002 (centre), VL-B-010 (far-right), and VL-B-011 (landscape with the record panel). The source overview and the implementation states were reviewed together at matching desktop scale.
- The 1440px browser viewport has a 1425px content width after its scrollbar. The visible focus stage runs from the 184px index edge to the panel's 1035px left edge, producing a 609.5px horizontal target.

### Findings and fixes

- [P1, fixed] The old focus formula used `window.innerWidth / 2` and subtracted only half the panel width. It ignored the 184px persistent index and the actual content width, so all works landed near x=524px instead of the usable-stage centre near x=610px.
- [P1, fixed] Focus translation had no scene bounds. VL-B-010 ended with the world at right=976px and bottom=755px while the panel began at 1035px in a 900px-high viewport, visibly exposing the frame beyond the marble environment.
- [P2, fixed] The world transition was 920ms with an ease-out curve and had no explicit desktop transition phase. Desktop now uses `OVERVIEW`, `FOCUSING`, `FOCUSED`, and `RETURNING`; competing selection commands are ignored until motion settles.
- The focus target is the midpoint between the persistent index plus 36px breathing room and the open panel minus 36px breathing room. The artwork's authored world-space centre is translated to that target.
- Horizontal translation is clamped between the navigation edge and the minimum position that keeps the world touching the panel edge. Vertical translation is clamped between the world's top and bottom coverage limits. This deliberately lets edge works remain slightly above/below centre when exact centring would expose the environment.
- Focus scale is 0.68 on ordinary desktops and may rise only enough to cover a tall desktop viewport, capped at 0.78. Every work at a given viewport uses the same scale.
- Enter and return both use 1120ms and `cubic-bezier(0.4, 0, 0.2, 1)`. A transition-end handler plus a reduced-motion-safe fallback settles the phase without remounting artworks.

### Six-work verification

At 1440 × 900, all six works completed overview → focus → panel → close → overview. Horizontal centre errors were: VL-A-007 −1.14px, VL-A-018 +0.98px, VL-B-002 −0.75px, VL-B-006 +0.99px, VL-B-011 −0.77px, and VL-B-010 +0.55px. Upper works retained world top=0; lower works retained world bottom=900; every world right edge reached or exceeded the panel edge. Rapid double-NEXT during focus advanced only once, confirming command locking.

- Additional edge checks passed at 1366 × 768, 1920 × 1080, and 2560 × 1440. Where a wide-screen edge work cannot reach exact stage centre without uncovering the world boundary, the clamp correctly prioritizes continuous marble coverage.
- The 390 × 844 mobile carousel was visually regression-checked after the desktop change. It retains the approved six persistent artwork controls and opening composition; no mobile component or CSS rule was changed.
- Browser console: no runtime errors.
- `npm run lint`: passed.
- `npx vite build`: passed.
- `git diff --check`: passed (existing line-ending warnings only).
- `npm run build`: the frontend portion is healthy, but the wrapper remains blocked by the pre-existing missing local `archive-masters/Series 1` directory during archive validation.

final result: passed
