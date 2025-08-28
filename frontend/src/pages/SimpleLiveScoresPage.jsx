// Simple working Live Scores page
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SimpleLiveScoresPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Navbar />
      
      <div style={{ 
        padding: '2rem', 
        marginTop: '80px',
        maxWidth: '1200px',
        margin: '80px auto 0',
        fontFamily: 'Inter, sans-serif'
      }}>
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '16px',
          border: '1px solid #E5E7EB'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 1rem 0'
          }}>
            Live Scores
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6B7280', margin: '0 0 1rem 0' }}>
            Real-time Sports Scores & Match Updates
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              animation: 'pulse 2s infinite'
            }}></div>
            Live Updates
          </div>
        </header>

        {/* Live Scores Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: '#FEE2E2',
              color: '#EF4444',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#EF4444'
              }}></div>
              LIVE
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Mumbai Indians</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>185</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', margin: '0.5rem 0' }}>vs</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Chennai Super Kings</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>178</span>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.875rem', 
              color: '#6B7280',
              paddingTop: '1rem',
              borderTop: '1px solid #F3F4F6'
            }}>
              <div>
                <span style={{ fontWeight: '500', color: '#6366F1' }}>Cricket</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span>IPL</span>
              </div>
              <div>🕐 Today</div>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: '#D1FAE5',
              color: '#10B981',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              78'
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Manchester City</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>2</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', margin: '0.5rem 0' }}>vs</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Liverpool</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>1</span>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.875rem', 
              color: '#6B7280',
              paddingTop: '1rem',
              borderTop: '1px solid #F3F4F6'
            }}>
              <div>
                <span style={{ fontWeight: '500', color: '#6366F1' }}>Football</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span>Premier League</span>
              </div>
              <div>🕐 Today</div>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: '#F3F4F6',
              color: '#6B7280',
              padding: '0.25rem 0.75rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              FT
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Lakers</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>108</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280', margin: '0.5rem 0' }}>vs</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <span style={{ fontSize: '1rem', fontWeight: '500', color: '#1F2937' }}>Warriors</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366F1' }}>95</span>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '0.875rem', 
              color: '#6B7280',
              paddingTop: '1rem',
              borderTop: '1px solid #F3F4F6'
            }}>
              <div>
                <span style={{ fontWeight: '500', color: '#6366F1' }}>Basketball</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span>NBA</span>
              </div>
              <div>🕐 Yesterday</div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          padding: '1.5rem', 
          background: 'rgba(99, 102, 241, 0.05)', 
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <p style={{ color: '#6366F1', margin: '0', fontSize: '1rem' }}>
            ⚽ Live Scores - Real-time match updates and scores from around the world
          </p>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default SimpleLiveScoresPage;
