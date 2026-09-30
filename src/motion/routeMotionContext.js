import { createContext, useContext } from 'react';

export const RouteMotionContext = createContext(null);

export function useRouteMotion() {
  const context = useContext(RouteMotionContext);
  if (!context) throw new Error('useRouteMotion must be used inside RouteMotionProvider');
  return context;
}

