import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track page views in Google Analytics 4
 * Automatically fires page_view event whenever the route changes
 * 
 * @param {string} measurementId - GA4 Measurement ID (default: 'G-FPCM7YR90D')
 */
const usePageTracking = (measurementId = 'G-FPCM7YR90D') => {
  const location = useLocation();

  useEffect(() => {
    // Only track if gtag is available (GA4 script loaded)
    if (typeof window !== 'undefined' && window.gtag) {
      // Track page view on route change
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, measurementId]);
};

export default usePageTracking;
