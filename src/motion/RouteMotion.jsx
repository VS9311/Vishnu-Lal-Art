import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useHref, useNavigate } from 'react-router-dom';
import { getRouteMotion } from './motionConfig';
import { RouteMotionContext, useRouteMotion } from './routeMotionContext';
import './motion.css';

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
const afterPaint = () => new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

export function RouteMotionProvider({ children }) {
  const navigate = useNavigate();
  const mounted = useRef(true);
  const locked = useRef(false);
  const [motion, setMotion] = useState({ phase: 'idle', kind: 'portal', direction: 0 });

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const moveTo = useCallback(async (to, options = {}) => {
    if (locked.current) return false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const kind = options.kind || 'portal';
    const direction = Math.sign(options.direction || 0);
    const duration = getRouteMotion(kind);
    locked.current = true;

    if (!reduced) {
      setMotion({ phase: 'leaving', kind, direction });
      await wait(duration.exit);
      if (!mounted.current) return false;
    }

    navigate(to, { state: options.state, replace: options.replace });

    if (!reduced) {
      setMotion({ phase: 'entering', kind, direction });
      await afterPaint();
      if (!mounted.current) return false;
      await wait(duration.enter);
    }

    if (mounted.current) setMotion({ phase: 'idle', kind, direction: 0 });
    locked.current = false;
    return true;
  }, [navigate]);

  return <RouteMotionContext.Provider value={{ ...motion, busy: motion.phase !== 'idle', moveTo }}>
    {children}
  </RouteMotionContext.Provider>;
}

export function RouteMotionStage({ children }) {
  const motion = useRouteMotion();
  return <div
    className="route-motion-stage"
    data-motion-phase={motion.phase}
    data-motion-kind={motion.kind}
    data-motion-direction={motion.direction}
    aria-busy={motion.busy}
  >{children}</div>;
}

export function MotionLink({ kind = 'portal', direction = 0, state, replace, onClick, preload, children, ...props }) {
  const { moveTo, busy } = useRouteMotion();
  const href = useHref(props.to);

  const warmDestination = () => {
    if (typeof preload === 'function') preload();
  };

  return <Link
    {...props}
    state={state}
    replace={replace}
    aria-disabled={busy || undefined}
    onPointerEnter={warmDestination}
    onFocus={warmDestination}
    onClick={(event) => {
      onClick?.(event);
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
      if (busy) { event.preventDefault(); return; }
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (href === current) return;
      event.preventDefault();
      moveTo(props.to, { kind, direction, state, replace });
    }}
  >{children}</Link>;
}

