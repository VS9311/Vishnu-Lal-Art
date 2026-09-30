import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { adjacentKeyframes, initialNavigation, MARBLE_DURATION, MARBLE_EASING, movementTargets, planNavigation, populateOffstage, wrap, sceneSlots, SCENE_TRAVEL, DIRECT_EXIT, DIRECT_ENTER } from './marbleNavigation';
import { decodeMarbleArtwork, decodeMarblePresentation, warmMarbleNeighbors } from './marbleImageReadiness';

const painted = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export default function useMarbleNavigation(initialIndex, artworks) {
  const [state, setState] = useState(() => initialNavigation(initialIndex, artworks.length));
  const live = useRef(state);
  const nodes = useRef({});
  const scenes = useRef({});
  const animations = useRef([]);
  const generation = useRef(0);
  const locked = useRef(true);
  const [error, setError] = useState('');
  const publish = next => { live.current = next; setState(next); };
  const decodeSlots = useCallback(async (slots, scene = live.current.scene) => {
    // Wait for the actual persistent presentation images as well as preloaders.
    await Promise.all(slots.flatMap(s => [
      decodeMarbleArtwork(artworks[s.index]),
      decodeMarblePresentation(nodes.current[`${scene}:${s.key}`].querySelector('img')),
    ]));
  }, [artworks]);
  useEffect(() => {
    const token = ++generation.current;
    void decodeSlots(live.current.slots).then(() => {
      if (token !== generation.current) return;
      publish({ ...live.current, phase: 'IDLE' });
      locked.current = false;
      warmMarbleNeighbors(artworks, live.current.index);
    }).catch(() => {
      if (token !== generation.current) return;
      setError('An artwork could not load. Retry to continue.');
      publish({ ...live.current, phase: 'ERROR' });
    });
    // These refs deliberately point to the latest operation, not mount-time nodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { generation.current++; animations.current.forEach(a => a.cancel()); };
  }, [artworks, decodeSlots]);

  const request = async selection => {
    if (locked.current) return;
    const before = live.current;
    const plan = planNavigation(before, selection);
    if (!plan) return;
    locked.current = true;
    setError('');
    const token = generation.current;
    const guard = () => { if (token !== generation.current) throw new Error('Unmounted'); };
    const update = async next => { guard(); publish(next); await painted(); guard(); };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const populate = (slots, key, index, anchor) => {
      const node = nodes.current[`${live.current.scene}:${key}`];
      const rect = node.getBoundingClientRect();
      const stage = node.parentElement.getBoundingClientRect();
      // Check actual presentation geometry too, not only the logical anchor.
      if (rect.right > stage.left && rect.left < stage.right) throw new Error('Slot still visible');
      return populateOffstage(slots, key, index, anchor);
    };
    let committed = false;
    const animateAdjacent = async (targets) => {
      const snapshot = live.current;
      // One geometry read before movement; all four persistent nodes share a clock.
      const { width, height } = scenes.current[snapshot.scene].getBoundingClientRect();
      const startTime = document.timeline.currentTime;
      const running = snapshot.slots.filter(s => targets[s.key] && targets[s.key] !== s.anchor).map(s =>
        nodes.current[`${snapshot.scene}:${s.key}`].animate(adjacentKeyframes(s.anchor, targets[s.key], width, height), {
          duration: reduced ? 0 : MARBLE_DURATION, easing: MARBLE_EASING, fill: 'forwards',
        }));
      if (startTime !== null) running.forEach(a => { a.startTime = startTime; });
      animations.current = running;
      // Real completion only. Cancellation rejects and cannot commit a new record.
      await Promise.all(running.map(a => a.finished));
      guard();
      let slots = snapshot.slots.map(s => ({ ...s, anchor: targets[s.key] || s.anchor }));
      // Recycle only the now fully offscreen object, ready for the next step.
      const spare = slots.find(s => s.anchor.startsWith('off-'));
      slots = populateOffstage(slots, spare.key, wrap(plan.target + 2 * plan.direction, artworks.length), `off-${plan.side}`);
      flushSync(() => publish({ ...live.current, slots, index: plan.target, phase: 'IDLE' }));
      running.forEach(a => a.cancel());
      animations.current = [];
      committed = true;
      locked.current = false;
      // Decode ahead during idle, never in the visible movement. A failed preload
      // is retried (and reported if still unavailable) by the next request.
      void decodeSlots(slots).catch(() => {});
      warmMarbleNeighbors(artworks, plan.target);
    };
    try {
      if (!plan.adjacent) {
        await update({ ...before, phase: 'PREPARE' });
        await Promise.all([plan.target, wrap(plan.target - 1, artworks.length), wrap(plan.target + 1, artworks.length)].map(i => decodeMarbleArtwork(artworks[i])));
        guard();
        const outgoing = before.scene;
        const incoming = outgoing === 'a' ? 'b' : 'a';
        const distance = SCENE_TRAVEL * plan.direction;
        // The unused fourth node stays hidden during a whole-trio translation.
        // Move the dormant group entirely offscreen before replacing its content.
        await update({ ...live.current, direct: true, offsets: { ...live.current.offsets, [incoming]: distance } });
        const stageRect = scenes.current[outgoing].parentElement.getBoundingClientRect();
        for (const slot of live.current.standbySlots.filter(s => !s.anchor.startsWith('off-'))) {
          const rect = nodes.current[`${incoming}:${slot.key}`].getBoundingClientRect();
          if (rect.right > stageRect.left && rect.left < stageRect.right) throw new Error('Incoming scene still visible');
        }
        const destination = sceneSlots(plan.target, artworks.length);
        await update({ ...live.current, standbySlots: destination });
        await decodeSlots(destination.filter(s => !s.anchor.startsWith('off-')), incoming);
        guard();
        await update({ ...live.current, phase: 'DIRECT_MOVE' });
        const exiting = scenes.current[outgoing].animate([
          { transform: 'translateX(0%)' }, { transform: `translateX(${-distance}%)` },
        ], { ...DIRECT_EXIT, duration: reduced ? 0 : DIRECT_EXIT.duration });
        const entering = scenes.current[incoming].animate([
          { transform: `translateX(${distance}%)` }, { transform: 'translateX(0%)' },
        ], { ...DIRECT_ENTER, duration: reduced ? 0 : DIRECT_ENTER.duration, delay: reduced ? 0 : DIRECT_ENTER.delay });
        animations.current = [exiting, entering];
        // Entry begins before exit finishes, avoiding a blank scene or intermediate works.
        await Promise.all([exiting.finished, entering.finished]);
        guard();
        await update({ ...live.current, offsets: { [outgoing]: -distance, [incoming]: 0 } });
        exiting.cancel(); entering.cancel(); animations.current = [];
        await update({ ...live.current, scene: incoming, slots: destination, standbySlots: before.slots, index: plan.target, phase: 'COMMIT' });
        committed = true;
        await update({ ...live.current, phase: 'RESTAGE', direct: false });
        await update({ ...live.current, phase: 'IDLE' });
        locked.current = false;
        warmMarbleNeighbors(artworks, plan.target);
        return;
      }
      const prepared = populate(live.current.slots, plan.spare, plan.future, `off-${plan.side}`);
      // Commit the offscreen source once; no extra paint barriers are needed for
      // explicit WAAPI keyframes. Already decoded persistent images stay ready.
      const spare = before.slots.find(s => s.key === plan.spare);
      if (spare.index !== plan.future || spare.anchor !== `off-${plan.side}`) {
        flushSync(() => publish({ ...before, slots: prepared, phase: 'PREPARE' }));
      }
      await decodeSlots(prepared);
      guard();
      publish({ ...live.current, phase: 'MOVE' });
      await animateAdjacent(movementTargets(live.current.slots, plan));
    } catch {
      if (token !== generation.current) return;
      animations.current.forEach(a => a.cancel());
      animations.current = [];
      publish({ ...live.current, phase: 'ERROR', recoveryIndex: committed ? plan.target : before.index });
      setError('An artwork could not load or movement was interrupted. Retry to continue.');
    }
  };
  const retry = async () => {
    const token = generation.current;
    const index = live.current.recoveryIndex ?? live.current.index;
    publish(initialNavigation(index, artworks.length));
    setError('');
    await painted();
    try {
      await decodeSlots(live.current.slots);
      if (token !== generation.current) return;
      publish({ ...live.current, phase: 'IDLE' });
      locked.current = false;
    } catch {
      if (token !== generation.current) return;
      publish({ ...live.current, phase: 'ERROR' });
      setError('Artwork unavailable. Please retry.');
    }
  };
  return { state, index: state.index, busy: state.phase !== 'IDLE', error, retry,
    bindSlot: (key, node) => { if (node) nodes.current[key] = node; },
    bindScene: (key, node) => { if (node) scenes.current[key] = node; },
    move: direction => void request({ direction }), select: target => void request({ target }) };
}
