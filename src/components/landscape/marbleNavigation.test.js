import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialNavigation, planNavigation, populateOffstage, movementTargets, isOffstage, wrap, sceneSlots, SCENE_TRAVEL, DIRECT_ENTER, DIRECT_EXIT } from './marbleNavigation.js';

function simulate(state, selection) {
  const plan = planNavigation(state, selection);
  assert.ok(plan);
  if (!plan.adjacent) {
    const frozen = JSON.stringify(state.slots);
    const destination = sceneSlots(plan.target, state.count);
    assert.deepEqual(destination.slice(0, 3).map(s => s.index), [wrap(plan.target - 1, state.count), plan.target, wrap(plan.target + 1, state.count)]);
    assert.equal(JSON.stringify(state.slots), frozen);
    return { ...state, index: plan.target, scene: state.scene === 'a' ? 'b' : 'a', slots: destination, standbySlots: state.slots };
  }
  const originalIndex = state.index;
  let slots = populateOffstage(state.slots, plan.spare, plan.adjacent ? plan.future : plan.target, `off-${plan.side}`);
  for (const slot of state.slots.filter(s => !isOffstage(s.anchor))) {
    assert.equal(slots.find(s => s.key === slot.key).index, slot.index);
  }
  if (!plan.adjacent) slots = slots.map(s => ['left', 'right'].includes(s.anchor) ? { ...s, anchor: `off-${s.anchor}` } : s);
  const targets = movementTargets(slots, plan);
  assert.equal(slots.filter(s => targets[s.key] !== s.anchor).length, plan.adjacent ? 3 : 2);
  assert.equal(state.index, originalIndex);
  slots = slots.map(s => ({ ...s, anchor: targets[s.key] }));
  assert.equal(slots.find(s => s.anchor === 'center').index, plan.target);
  if (plan.adjacent) slots = slots.map(s => s.key === plan.spare ? { ...s, anchor: plan.side } : s);
  else {
    const available = slots.filter(s => s.key !== plan.incoming);
    for (const [offset, side, node] of [[-1, 'left', available[0]], [1, 'right', available[1]]]) {
      slots = populateOffstage(slots, node.key, wrap(plan.target + offset, state.count), `off-${side}`);
      slots = slots.map(s => s.key === node.key ? { ...s, anchor: side } : s);
    }
  }
  assert.deepEqual(slots.map(s => s.key), ['left', 'center', 'right', 'staging']);
  assert.equal(slots.filter(s => isOffstage(s.anchor)).length, 1);
  for (const [offset, anchor] of [[-1, 'left'], [0, 'center'], [1, 'right']]) {
    assert.equal(slots.find(s => s.anchor === anchor).index, wrap(plan.target + offset, state.count));
  }
  return { ...state, slots, index: plan.target };
}
for (const count of [6, 17, 12]) {
  test(`${count} works: every direct pair with frozen visible identities`, () => {
    for (let from = 0; from < count; from++) for (let to = 0; to < count; to++) {
      if (from !== to) simulate({ ...initialNavigation(from, count), phase: 'IDLE' }, { target: to });
    }
  });
  test(`${count} works: persistent slot rotation and mirrored wraps`, () => {
    let state = { ...initialNavigation(0, count), phase: 'IDLE' };
    for (const direction of [1, -1]) for (let i = 0; i < count * 3; i++) state = simulate(state, { direction });
    assert.equal(state.index, 0);
  });
}
test('visible content mutation is rejected and all non-idle phases lock requests', () => {
  const state = initialNavigation(0, 6);
  assert.throws(() => populateOffstage(state.slots, 'center', 5, 'off-right'));
  for (const phase of ['BOOT', 'PREPARE', 'MOVE', 'DIRECT_MOVE', 'COMMIT', 'RESTAGE', 'ERROR']) {
    assert.equal(planNavigation({ ...state, phase }, { direction: 1 }), null);
  }
});
test('whole trios stage beyond the outer edge with overlapping exit/entry timing', () => {
  // Side anchors +/-58% from center and maximum side half-width <23% of viewport.
  assert.ok(108 + 23 - SCENE_TRAVEL < 0);
  assert.ok(-8 - 23 + SCENE_TRAVEL > 100);
  assert.ok(DIRECT_ENTER.delay < DIRECT_EXIT.duration);
  assert.ok(DIRECT_ENTER.delay + DIRECT_ENTER.duration >= 850);
  assert.ok(DIRECT_ENTER.delay + DIRECT_ENTER.duration <= 1200);
  assert.equal(DIRECT_EXIT.easing, 'cubic-bezier(.42,0,1,1)');
  assert.equal(DIRECT_ENTER.easing, 'cubic-bezier(0,0,.2,1)');
});
