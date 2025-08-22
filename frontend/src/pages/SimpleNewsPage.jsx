// Simple working News page
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SimpleNewsPage = () => {
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
            Sports News
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6B7280', margin: '0' }}>
            Latest Sports News from Around the World
          </p>
        </header>

        {/* Simple Demo News Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              background: '#10B981', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '50px', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              CRICKET
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#1F2937' }}>
              India Wins Cricket World Cup Final
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              Sports India • 2 hours ago • Indian
            </p>
            <p style={{ color: '#4B5563', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              In a nail-biting finish, India secured victory in the Cricket World Cup final with a spectacular performance.
            </p>
            <button style={{ 
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Read More
            </button>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              background: '#F59E0B', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '50px', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              FOOTBALL
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#1F2937' }}>
              Premier League: Manchester United Defeats Arsenal
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              Football Weekly • 4 hours ago • European
            </p>
            <p style={{ color: '#4B5563', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              Manchester United showcased brilliant teamwork in their latest Premier League match against Arsenal.
            </p>
            <button style={{ 
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Read More
            </button>
          </div>

          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ 
              background: '#EF4444', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '50px', 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              display: 'inline-block',
              marginBottom: '1rem'
            }}>
              BASKETBALL
            </div>
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#1F2937' }}>
              NBA Finals: Lakers vs Celtics Epic Showdown
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              NBA Central • 6 hours ago • American
            </p>
            <p style={{ color: '#4B5563', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              The NBA Finals heat up as Lakers face Celtics in what promises to be an exciting championship series.
            </p>
            <button style={{ 
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Read More
            </button>
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
            📰 Sports News - Demo articles showing latest updates from around the world
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SimpleNewsPage;
