import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useAdminGA - Dynamically loads GA4 and tracks page views for admin-only contexts.
 *
 * - Injects GA script only when `enabled` is true and in production.
 * - Fires `config` (page_view) on initial load and on route changes under admin paths.
 * - Does not rely on index.html; loads script programmatically.
 *
 * @param {string} measurementId - GA4 Measurement ID (e.g., 'G-XXXXXXXXXX')
 * @param {{ enabled?: boolean, adminPathPrefixes?: string[] }} options
 */
const useAdminGA = (measurementId, options = {}) => {
  const location = useLocation();
  const {
    enabled = false,
    adminPathPrefixes = ['/admin', '/admin-dashboard'],
  } = options;

  // Helper: determine if current path is an admin route
  const isAdminRoute = adminPathPrefixes.some((p) => location.pathname.startsWith(p));

  // Determine production mode safely across bundlers (Vite, CRA, Next)
  // - Vite: import.meta.env.MODE
  // - CRA/Next (webpack): process.env.NODE_ENV
  const isProduction = (() => {
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.MODE === 'string') {
        return import.meta.env.MODE === 'production';
      }
    } catch {}
    return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';
  })();

  // Only track in production and when feature is enabled
  const canTrack = enabled && typeof window !== 'undefined' && isProduction;

  // Inject GA script tag if needed
  useEffect(() => {
    if (!canTrack) return;
    if (!measurementId) return;

    // Avoid duplicate script injection
    const scriptId = 'ga4-admin-script';
    if (!document.getElementById(scriptId)) {
      // Initialize dataLayer/gtag BEFORE the script loads
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());

      const gaScript = document.createElement('script');
      gaScript.id = scriptId;
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(gaScript);
    }
  }, [canTrack, measurementId]);

  // Fire page_view on admin routes
  useEffect(() => {
    if (!canTrack) return;
    if (!measurementId) return;
    if (!isAdminRoute) return; // Only send events for admin paths

    if (typeof window.gtag === 'function') {
      // Use gtag config to send a page_view for SPA route changes
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [canTrack, measurementId, isAdminRoute, location.pathname, location.search]);
};

export default useAdminGA;


