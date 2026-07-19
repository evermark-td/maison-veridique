/**
 * Routes that open with a full-bleed hero. On these, the navbar overlays the
 * media (transparent until scrolled) and the main region drops its top offset.
 */
export const OVERLAY_ROUTES = ['/'] as const;

export function isOverlayRoute(pathname: string): boolean {
  return (OVERLAY_ROUTES as readonly string[]).includes(pathname);
}
