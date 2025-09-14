// Error reporting utility for production monitoring
class ErrorReporter {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.errors = [];
  }

  // Report errors to console in development, external service in production
  report(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context,
    };

    if (this.isProduction) {
      // In production, you would send to an error monitoring service
      // like Sentry, LogRocket, or Bugsnag
      console.error('Error reported:', errorInfo);
      
      // Store locally for debugging
      this.errors.push(errorInfo);
      if (this.errors.length > 50) {
        this.errors.shift(); // Keep only last 50 errors
      }
    } else {
      console.error('Development Error:', errorInfo);
    }
  }

  // Get stored errors for debugging
  getErrors() {
    return this.errors;
  }

  // Clear stored errors
  clearErrors() {
    this.errors = [];
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  const errorReporter = new ErrorReporter();
  errorReporter.report(event.error, {
    type: 'javascript',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  const errorReporter = new ErrorReporter();
  errorReporter.report(new Error(event.reason), {
    type: 'promise',
    reason: event.reason,
  });
});

export default ErrorReporter;
