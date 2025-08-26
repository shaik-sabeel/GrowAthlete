// src/pages/NewsPage_SportsPulse.jsx
import React, { useState, useEffect } from 'react';
import { getNews } from '../utils/sportsAPI';

const continents = [
  { key: 'indian', label: 'India', icon: '🇮🇳' },
  { key: 'asian', label: 'Asia', icon: '🌏' },
  { key: 'european', label: 'Europe', icon: '🇪🇺' },
  { key: 'australian', label: 'AU & NZ', icon: '🇦🇺' },
  { key: 'american', label: 'America', icon: '🌎' },
  { key: 'african', label: 'Africa', icon: '🌍' }
];

const sports = [
  { key: 'all', label: 'All Sports' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'football', label: 'Football' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'tennis', label: 'Tennis' }
];

const NewsPage_SportsPulse = () => {
  const [continent, setContinent] = useState('indian');
  const [sport, setSport] = useState('all');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async (c = continent, s = sport) => {
    setLoading(true);
    setError('');
    try {
      const items = await getNews(c, s);
      setNews(items);
      setLastUpdated(new Date());
    } catch (e) {
      setError('Could not load news, try again later');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { document.documentElement.setAttribute('data-theme','dark'); }, []);

  useEffect(() => { load(continent, sport); }, [continent, sport]);

  useEffect(() => {
    const id = setInterval(() => load(continent, sport), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [continent, sport]);

  const styles = {
    page: { minHeight:'100vh', background:'#0F172A', color:'#F8FAFC', fontFamily:'Inter, sans-serif' },
    header: { background:'rgba(30,41,59,0.65)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', borderBottom:'1px solid #334155', padding:'2.5rem 1rem', marginTop:80, textAlign:'center', position:'relative' },
    headingGlass: {
      maxWidth: 720, margin:'0 auto', padding:'1.25rem 1.5rem',
      background: 'linear-gradient(180deg, rgba(148,163,184,0.10), rgba(148,163,184,0.06))',
      border: '1px solid rgba(148,163,184,0.25)', borderRadius: 16,
      boxShadow: '0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
    },
    title:{ fontSize:'3rem', fontWeight:700, background:'linear-gradient(135deg,#6366F1,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 },
    titleAccent:{ height:6, width:140, margin:'10px auto 0', borderRadius:9999, background:'linear-gradient(90deg,#6366F1,#EC4899,#22D3EE)', filter:'blur(0.3px)' },
    updated:{ color:'#94A3B8', marginTop:8, fontSize:13 },
    main:{ maxWidth:1400, margin:'0 auto', padding:'2rem' },
    bar:{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center', margin:'1rem 0' },
    btn:(active)=>({ background: active?'#6366F1':'#1E293B', border:`1px solid ${active?'#6366F1':'#334155'}`, color:'#E5E7EB', padding:'0.6rem 1rem', borderRadius:50, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', gap:8 }),
    icon:{ fontSize:16 },
    grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' },
    card:{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, overflow:'hidden' }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headingGlass}>
          <h1 style={styles.title}>Sports News</h1>
          <div style={styles.titleAccent}></div>
          {lastUpdated && <div style={styles.updated}>Updated {lastUpdated.toLocaleTimeString()}</div>}
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.bar}>
          {continents.map(c => (
            <button key={c.key} style={styles.btn(continent===c.key)} onClick={()=>setContinent(c.key)}>
              <span style={styles.icon}>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        <div style={styles.bar}>
          {sports.map(s => (
            <button key={s.key} style={styles.btn(sport===s.key)} onClick={()=>setSport(s.key)}>{s.label}</button>
          ))}
        </div>

        {loading && <div style={{ textAlign:'center', padding:'1rem' }}>⏳ Loading news...</div>}
        {error && (
          <div style={{ textAlign:'center', padding:'1rem' }}>
            {error} <button onClick={()=>load(continent, sport)} style={{ marginLeft:8, border:'1px solid #334155', background:'#1E293B', color:'#E5E7EB', padding:'0.4rem 0.8rem', borderRadius:8 }}>Retry</button>
          </div>
        )}
        {!loading && !error && news.length === 0 && (
          <div style={{ textAlign:'center', padding:'1rem', color:'#CBD5E1' }}>No news found for your selection</div>
        )}

        <div style={styles.grid}>
          {news.map(a => (
            <article key={a.id} style={styles.card}>
              {a.image && (
                <div style={{ height:180, overflow:'hidden' }}>
                  <img src={a.image} alt={a.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={(e)=>{e.currentTarget.style.display='none';}} />
                </div>
              )}
              <div style={{ padding:'1rem' }}>
                <h3 style={{ margin:'0 0 0.5rem 0', fontSize:18, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.title}</h3>
                {a.description && <p style={{ margin:'0 0 1rem 0', color:'#CBD5E1', fontSize:14, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.description}</p>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', color:'#94A3B8', fontSize:12 }}>
                  <span>{a.source || ''}</span>
                  <span>{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}</span>
                </div>
                <div style={{ marginTop:10 }}>
                  <a href={a.url} target="_blank" rel="noreferrer" style={{ color:'#A5B4FC', textDecoration:'none', fontWeight:600 }}>Read More →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NewsPage_SportsPulse;
