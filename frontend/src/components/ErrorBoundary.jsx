import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for now; could be sent to a logging service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Best-effort reload to a safe route
    try {
      window.location.href = '/news';
    } catch (_) {
      // no-op
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F9FAFB',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: 560,
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: 0,
              marginBottom: '0.5rem',
              fontSize: '1.5rem',
              color: '#1F2937'
            }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
              The page failed to load. You can try again or go to the News page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={this.handleRetry} style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}>Go to News</button>
              <Link to="/" style={{
                border: '1px solid #E5E7EB',
                padding: '0.75rem 1.25rem',
                borderRadius: 8,
                color: '#1F2937',
                textDecoration: 'none'
              }}>Back Home</Link>
            </div>
            <details style={{ marginTop: '1rem', color: '#9CA3AF', whiteSpace: 'pre-wrap' }}>
              {String(this.state.error || '')}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
