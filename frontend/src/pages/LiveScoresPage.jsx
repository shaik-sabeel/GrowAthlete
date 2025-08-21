// src/pages/LiveScoresPage.jsx
import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar'; // Navbar is global in App.jsx
// import Footer from '../components/Footer'; // Footer is global in App.jsx
import { fetchLiveScores } from '../utils/sportsAPI';

const LiveScoresPage = () => {
  const [liveScores, setLiveScores] = useState([]);
  const [filterSport, setFilterSport] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ document.documentElement.setAttribute('data-theme','dark'); },[]);

  const loadScores = async ()=>{
    setLoading(true);
    try { setLiveScores(await fetchLiveScores()); } finally { setLoading(false); }
  };

  useEffect(()=>{ loadScores(); const id=setInterval(loadScores,30000); return ()=>clearInterval(id); },[]);

  const sports = ['all','cricket','football','basketball','hockey','tennis'];
  const filtered = liveScores.filter(m=> filterSport==='all' || (m.sport||'').toLowerCase().includes(filterSport));

  const styles = {
    page:{ minHeight:'100vh', background:'#0F172A', color:'#F8FAFC', fontFamily:'Inter, sans-serif' },
    header:{ background:'rgba(30,41,59,0.95)', backdropFilter:'blur(10px)', borderBottom:'1px solid #334155', padding:'2rem', marginTop:80, textAlign:'center' },
    title:{ fontSize:'3rem', fontWeight:700, background:'linear-gradient(135deg,#6366F1,#EC4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 },
    main:{ maxWidth:1200, margin:'0 auto', padding:'2rem' },
    filters:{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center', margin:'1rem 0' },
    pill:(active)=>({ background: active?'#6366F1':'#1E293B', border:`1px solid ${active?'#6366F1':'#334155'}`, color:'#E5E7EB', padding:'0.5rem 1rem', borderRadius:50, cursor:'pointer', fontSize:14 }),
    grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(400px,1fr))', gap:'1.25rem' },
    card:{ background:'#1E293B', border:'1px solid #334155', borderRadius:16, padding:'1rem' }
  };

  return (
    <div style={styles.page}>
      {/* Navbar is global */}
      <header style={styles.header}>
        <h1 style={styles.title}>Live Scores</h1>
      </header>
      <main style={styles.main}>
        <div style={styles.filters}>
          {sports.map(s=>{
            const a = filterSport===s;
            return <div key={s} style={styles.pill(a)} onClick={()=>setFilterSport(s)}>{s==='all'?'All Sports':s}</div>;
          })}
        </div>

        {loading && <div style={{textAlign:'center', color:'#CBD5E1', padding:'1rem'}}>Loading…</div>}

        <div style={styles.grid}>
          {filtered.map(m=> (
            <div key={m.id} style={styles.card}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ color:'#A5B4FC', fontWeight:600 }}>{m.sport || 'Match'}</div>
                <div style={{ color:'#10B981', fontWeight:700 }}>{m.status || '—'}</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <span>{m.homeTeam || 'TBD'}</span>
                <strong style={{ color:'#E5E7EB' }}>{m.homeScore ?? '-'}</strong>
              </div>
              <div style={{ textAlign:'center', color:'#94A3B8', fontSize:12, margin:'2px 0' }}>vs</div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
                <strong style={{ color:'#E5E7EB' }}>{m.awayScore ?? '-'}</strong>
                <span>{m.awayTeam || 'TBD'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', color:'#94A3B8', fontSize:12, marginTop:8 }}>
                <div>{m.league || ''}</div>
                <div>{m.date || ''} {m.time || ''}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Footer is global */}
    </div>
  );
};

export default LiveScoresPage;
