// src/pages/CommunityPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import PostCreator from '../components/PostCreator';
import Post from '../components/Post';
import ImageCarousel from '../components/ImageCarousel';
import '../pages_css/CommunityPage.css';
import sohamImg from '../assets/soham.jpg';
import anikaImg from '../assets/anika.jpg';
import vikramImg from '../assets/vikram.jpg';

const AUTOPLAY_MS = 3500;

const CommunityPage = () => {
  const topContributors = useMemo(
    () => [
      { name: 'Soham', sport: 'Football', avatar: sohamImg, posts: 214, kudos: 1280, streak: 12, verified: true },
      { name: 'Anika', sport: 'Badminton', avatar: anikaImg, posts: 188, kudos: 990, streak: 9, verified: true },
      { name: 'Vikram', sport: 'Cricket', avatar: vikramImg, posts: 165, kudos: 860, streak: 6, verified: false },
    ],
    []
  );

  const [contribIndex, setContribIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setContribIndex((i) => (i + 1) % topContributors.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [topContributors.length]);

  return (
    <div className="community">
      <section className="community__main">
        <div className="community__card community__section">
          <h2 style={{ marginTop: 0 }}>Create a post</h2>
          <PostCreator />
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Community Feed</h3>
          <Post />
        </div>
      </section>

      <aside className="community__sidebar py-14">
        <div className="community__card community__section">
          <h3 style={{ marginTop: 0 }}>Highlights</h3>
          <div className="community__stats">
            <div className="stat"><h4>Members</h4><p>12.4k</p></div>
            <div className="stat"><h4>Active Today</h4><p>1,034</p></div>
            <div className="stat"><h4>Posts</h4><p>48.2k</p></div>
          </div>
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0 }}>Trending Topics</h3>
          <div className="topics">
            {['#NextGenAthletes', '#TrainSmart', '#Recovery', '#Sponsorship', '#TechInSports', '#Nutrition'].map((t) => (
              <span key={t} className="topic">{t}</span>
            ))}
          </div>
        </div>

        <div className="community__card community__section">
          <ImageCarousel />
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0 }}>Upcoming Events</h3>
          <div className="events">
            {[{ n: 'Talent Scouting Webinar', d: 'Fri, 5 PM', t: 'Online' }, { n: 'Athlete Showcase', d: 'Nov 30', t: 'Mumbai' }].map((e, i) => (
              <div key={i} className="event">
                <div>
                  <div style={{ fontWeight: 600 }}>{e.n}</div>
                  <div className="meta">{e.d} • {e.t}</div>
                </div>
                <button className="btn-remind">Remind me</button>
              </div>
            ))}
          </div>
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0 }}>Community Guidelines</h3>
          <div className="guidelines">
            {[
              'Be respectful. Celebrate athletes and constructive feedback.',
              'No spam or promotions without context.',
              'Credit sources for stats, images, and news.',
            ].map((g, i) => (
              <div key={i} className="guideline">{g}</div>
            ))}
          </div>
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0 }}>Top Contributors</h3>
          <div className="contrib-carousel">
            <div className="contrib-track" style={{ transform: `translateX(-${contribIndex * 100}%)` }}>
              {topContributors.map((c) => (
                <div key={c.name} className="contrib-slide">
                  <div className="contrib contrib--card">
                    <img className="contrib__avatar-lg" src={c.avatar} alt={c.name} />
                    <div className="contrib__header">
                      <div className="name">
                        {c.name}
                        {c.verified && <span className="badge badge--verified" aria-label="verified">✔</span>}
                      </div>
                      <div className="role">{c.sport}</div>
                    </div>
                    <div className="contrib__stats-row">
                      <div className="stat-pair"><span className="stat-label">posts:</span><span className="stat-value">{c.posts}</span></div>
                      <div className="stat-pair"><span className="stat-label">kudos:</span><span className="stat-value">{c.kudos}</span></div>
                      <div className="stat-pair"><span className="stat-label">streak:</span><span className="stat-value">{c.streak}d</span></div>
                    </div>
                    <button className="btn-follow btn-follow--corner">Follow</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="contrib-dots">
              {topContributors.map((_, i) => (
                <span key={i} onClick={() => setContribIndex(i)} className={`dot ${contribIndex === i ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;