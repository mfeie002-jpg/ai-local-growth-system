import { useUTMTracking } from '@/hooks/useUTMTracking';

/**
 * Component that captures and persists UTM parameters.
 * Should be rendered once inside BrowserRouter.
 */
export function UTMTracker() {
  useUTMTracking();
  return null;
}
