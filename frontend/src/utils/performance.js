// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // Measure page load performance
  measurePageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const metrics = {
        // Core Web Vitals
        fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
        lcp: this.getLCP(),
        fid: this.getFID(),
        cls: this.getCLS(),
        
        // Additional metrics
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        
        // Resource metrics
        totalResources: performance.getEntriesByType('resource').length,
        totalSize: this.calculateTotalSize(),
        
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      this.metrics.push(metrics);
      
      if (this.isProduction) {
        console.log('Performance Metrics:', metrics);
        // In production, send to analytics service
      }
    });
  }

  // Get Largest Contentful Paint
  getLCP() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    });
  }

  // Get First Input Delay
  getFID() {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        resolve(firstEntry.processingStart - firstEntry.startTime);
      });
      observer.observe({ entryTypes: ['first-input'] });
    });
  }

  // Get Cumulative Layout Shift
  getCLS() {
    return new Promise((resolve) => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        resolve(clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    });
  }

  // Calculate total resource size
  calculateTotalSize() {
    const resources = performance.getEntriesByType('resource');
    return resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
  }

  // Measure custom performance
  measureCustom(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const metric = {
      name,
      duration: end - start,
      timestamp: new Date().toISOString(),
    };
    
    this.metrics.push(metric);
    return result;
  }

  // Get all metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
performanceMonitor.measurePageLoad();

export default performanceMonitor;
