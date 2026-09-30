import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anchors, adjacentKeyframes, initialNavigation, planNavigation, populateOffstage, movementTargets, isOffstage, wrap, sceneSlots, SCENE_TRAVEL, DIRECT_ENTER, DIRECT_EXIT } from './marbleNavigation.js';

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
  assert.equal(slots.filter(s => targets[s.key] !== s.anchor).length, 4);
  assert.equal(targets[plan.spare], plan.side, 'Prepared neighbor participates in the main transition');
  assert.equal(state.index, originalIndex);
  slots = slots.map(s => ({ ...s, anchor: targets[s.key] }));
  assert.equal(slots.find(s => s.anchor === 'center').index, plan.target);
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
  test(`${count} works: direction reversals and direct/adjacent handoffs keep both neighbors`, () => {
    let state = { ...initialNavigation(0, count), phase: 'IDLE' };
    for (const selection of [{ direction: 1 }, { direction: -1 }, { direction: -1 }, { direction: 1 }, { target: count - 2 }, { direction: 1 }, { target: 1 }, { direction: -1 }]) {
      state = simulate(state, selection);
      const visible = state.slots.filter(s => !isOffstage(s.anchor));
      assert.equal(new Set(visible.map(s => s.index)).size, 3);
      assert.equal(state.slots.length, 4, 'Only one spare per scene is needed');
    }
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

test('adjacent transforms reproduce the approved anchor path without layout properties', () => {
  for (const [width, height] of [[390, 497.96], [320, 448.4], [480, 612.87]]) {
    for (const direction of [-1, 1]) {
      const state = { ...initialNavigation(0, 6), phase: 'IDLE' };
      const plan = planNavigation(state, { direction });
      const slots = populateOffstage(state.slots, plan.spare, plan.future, `off-${plan.side}`);
      const targets = movementTargets(slots, plan);
      for (const slot of slots) {
        const frames = adjacentKeyframes(slot.anchor, targets[slot.key], width, height);
        frames.forEach(frame => assert.deepEqual(Object.keys(frame), ['transform']));
        const end = frames[1].transform.match(/translate\(calc\(-50% \+ ([-\d.e]+)px\), ([-\d.e]+)px\) scale\(([\d.]+)\)/);
        assert.ok(end);
        const from = anchors[slot.anchor];
        const to = anchors[targets[slot.key]];
        for (const progress of [0, .25, .5, .75, 1]) {
          assert.ok(Math.abs(parseFloat(from.left) * width / 100 + Number(end[1]) * progress
            - (parseFloat(from.left) + (parseFloat(to.left) - parseFloat(from.left)) * progress) * width / 100) < .0001);
          assert.ok(Math.abs(-parseFloat(from.bottom) * height / 100 + Number(end[2]) * progress
            + (parseFloat(from.bottom) + (parseFloat(to.bottom) - parseFloat(from.bottom)) * progress) * height / 100) < .0001);
        }
        assert.equal(Number(end[3]), targets[slot.key] === 'center' ? 1 : .8);
      }
    }
  }
});
