import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MOTION_DURATIONS, ROUTE_MOTION, getRouteMotion } from '../src/motion/motionConfig.js';

assert.equal(ROUTE_MOTION.portal.exit + ROUTE_MOTION.portal.enter, 920, 'Homepage/Series transition must stay in the 700–1100ms range');
assert.equal(ROUTE_MOTION.focus.exit + ROUTE_MOTION.focus.enter, 780, 'Series/Record transition must stay in the 700–1000ms range');
assert.equal(ROUTE_MOTION.record.exit + ROUTE_MOTION.record.enter, 700, 'Record navigation must stay in the 550–850ms range');
assert.ok(MOTION_DURATIONS.gallery >= 500 && MOTION_DURATIONS.gallery <= 700, 'Gallery transition must stay in the 500–700ms range');
assert.equal(getRouteMotion('unknown'), ROUTE_MOTION.portal, 'Unknown route motion falls back safely');

const motionCss = await readFile(new URL('../src/motion/motion.css', import.meta.url), 'utf8');
assert.match(motionCss, /@media \(prefers-reduced-motion: reduce\)/, 'Motion system must provide a reduced-motion mode');
assert.match(motionCss, /\.route-motion-stage \{ animation: none !important;/, 'Reduced motion must remove route animation');
assert.doesNotMatch(motionCss, /transition:\s*(?:top|left|right|bottom|width|height)/, 'Motion primitives should not animate layout properties');

console.log('Motion timing contract validated.');

