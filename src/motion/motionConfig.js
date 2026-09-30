export const MOTION_DURATIONS = Object.freeze({
  micro: 180,
  panel: 360,
  gallery: 620,
  portalExit: 390,
  portalEnter: 530,
  focusExit: 330,
  focusEnter: 450,
  recordExit: 320,
  recordEnter: 380,
});

export const ROUTE_MOTION = Object.freeze({
  portal: { exit: MOTION_DURATIONS.portalExit, enter: MOTION_DURATIONS.portalEnter },
  focus: { exit: MOTION_DURATIONS.focusExit, enter: MOTION_DURATIONS.focusEnter },
  record: { exit: MOTION_DURATIONS.recordExit, enter: MOTION_DURATIONS.recordEnter },
});

export function getRouteMotion(kind = 'portal') {
  return ROUTE_MOTION[kind] || ROUTE_MOTION.portal;
}

