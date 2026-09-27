export const DESKTOP_FOCUS = Object.freeze({
  baseScale: 0.68,
  maximumScale: 0.78,
  navigationWidth: 184,
  breathingRoom: 36,
  durationMs: 1120,
});

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

/**
 * Place an artwork in the visual centre of the stage that remains between the
 * persistent index and the open record panel. Translation is bounded so the
 * marble world continues to cover that visible stage.
 */
export function calculateDesktopFocusTransform({
  viewportWidth,
  viewportHeight,
  worldWidth,
  worldHeight,
  artworkX,
  artworkY,
  artworkHeight,
  panelWidth,
}) {
  const { baseScale, maximumScale, navigationWidth, breathingRoom } = DESKTOP_FOCUS;
  const scale = clamp(viewportHeight / worldHeight, baseScale, maximumScale);
  const panelLeft = viewportWidth - panelWidth;
  const usableLeft = navigationWidth + breathingRoom;
  const usableRight = Math.max(usableLeft, panelLeft - breathingRoom);
  const targetX = (usableLeft + usableRight) / 2;
  const targetY = viewportHeight / 2;
  const artworkCenterY = artworkY - (artworkHeight / 2);

  const requestedX = targetX - (artworkX * scale);
  const requestedY = targetY - (artworkCenterY * scale);
  const minimumX = panelLeft - (worldWidth * scale);
  const maximumX = navigationWidth;
  const minimumY = viewportHeight - (worldHeight * scale);
  const maximumY = 0;

  return {
    scale,
    translateX: clamp(requestedX, minimumX, maximumX),
    translateY: clamp(requestedY, minimumY, maximumY),
    targetX,
    targetY,
  };
}
