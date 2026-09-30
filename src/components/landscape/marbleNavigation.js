export const MARBLE_DURATION = 880;
export const MARBLE_EASING = 'cubic-bezier(0,0,.2,1)';
export const DIRECT_EXIT = { duration: 550, easing: 'cubic-bezier(.42,0,1,1)', fill: 'forwards' };
export const DIRECT_ENTER = { duration: 750, delay: 300, easing: 'cubic-bezier(0,0,.2,1)', fill: 'both' };
export const SCENE_TRAVEL = 145;
export const wrap = (index, count) => (index + count) % count;
export const isOffstage = anchor => anchor.startsWith('off-');
export const anchors = {
  left: { left: '-8%', bottom: '38.3%', transform: 'translateX(-50%) scale(.8)' },
  center: { left: '50%', bottom: '28.1%', transform: 'translateX(-50%) scale(1)' },
  right: { left: '108%', bottom: '38.3%', transform: 'translateX(-50%) scale(.8)' },
  'off-left': { left: '-40%', bottom: '38.3%', transform: 'translateX(-50%) scale(.8)' },
  'off-right': { left: '140%', bottom: '38.3%', transform: 'translateX(-50%) scale(.8)' },
};
export function sceneSlots(index, count) {
  return [
    { key: 'left', index: wrap(index - 1, count), anchor: 'left' },
    { key: 'center', index, anchor: 'center' },
    { key: 'right', index: wrap(index + 1, count), anchor: 'right' },
    { key: 'staging', index: wrap(index + 2, count), anchor: 'off-right' },
  ];
}
export function initialNavigation(index, count) {
  return { index, count, phase: 'BOOT', direct: false, scene: 'a', offsets: { a: 0, b: SCENE_TRAVEL }, slots: sceneSlots(index, count), standbySlots: sceneSlots(index, count) };
}
export function planNavigation(state, selection) {
  if (state.phase !== 'IDLE') return null;
  const target = selection.direction ? wrap(state.index + selection.direction, state.count) : selection.target;
  if (!Number.isInteger(target) || target < 0 || target >= state.count || target === state.index) return null;
  const direction = selection.direction || (target > state.index ? 1 : -1);
  const adjacent = target === wrap(state.index + direction, state.count);
  const side = direction > 0 ? 'right' : 'left';
  const exit = direction > 0 ? 'left' : 'right';
  return { target, direction, adjacent, side, exit,
    center: state.slots.find(s => s.anchor === 'center').key,
    incoming: state.slots.find(s => adjacent ? s.anchor === side : isOffstage(s.anchor)).key,
    spare: state.slots.find(s => isOffstage(s.anchor)).key,
    future: wrap(target + direction, state.count),
  };
}
// Keys identify persistent physical objects; spatial roles rotate, never keys.
export function populateOffstage(slots, key, index, anchor) {
  const slot = slots.find(s => s.key === key);
  if (!slot || !isOffstage(slot.anchor) || !isOffstage(anchor)) throw new Error('Cannot populate a visible marble slot');
  return slots.map(s => s.key === key ? { ...s, index, anchor } : s);
}
export function movementTargets(slots, plan) {
  return Object.fromEntries(slots.map(slot => {
    // The decoded spare joins the same movement, replenishing the exposed side
    // before commit rather than waiting for a second animation after settling.
    if (plan.adjacent && slot.key === plan.spare) return [slot.key, plan.side];
    if (slot.key === plan.center) return [slot.key, plan.adjacent ? plan.exit : `off-${plan.exit}`];
    if (slot.key === plan.incoming) return [slot.key, 'center'];
    if (plan.adjacent && slot.anchor === plan.exit) return [slot.key, `off-${plan.exit}`];
    return [slot.key, slot.anchor];
  }));
}
