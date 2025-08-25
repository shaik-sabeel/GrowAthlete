// src/pages/CommunityPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import PostCreator from '../components/PostCreator';
import CommunityFeed from '../components/CommunityFeed';
import ImageCarousel from '../components/ImageCarousel';
import AnnouncementsDisplay from '../components/AnnouncementsDisplay';
import '../pages_css/CommunityPage.css';
import sohamImg from '../assets/soham.jpg';
import anikaImg from '../assets/anika.jpg';
import vikramImg from '../assets/vikram.jpg';

import Navbar from '../components/Navbar';

import api from '../utils/api';
import { getCurrentUserId } from '../utils/auth';


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
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [communityGuidelines, setCommunityGuidelines] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshFeed, setRefreshFeed] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => setContribIndex((i) => (i + 1) % topContributors.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [topContributors.length]);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await api.get('/admin/public/trending-topics');
        setTrendingTopics(response.data);
      } catch (error) {
        console.error('Failed to fetch trending topics:', error);
      }
    };

    const fetchCommunityGuidelines = async () => {
      try {
        const response = await api.get('/admin/public/community-guidelines');
        setCommunityGuidelines(response.data);
      } catch (error) {
        console.error('Failed to fetch community guidelines:', error);
      }
    };

    // Get current user ID from auth utility
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    fetchTrendingTopics();
    fetchCommunityGuidelines();
  }, []);

  return (
    <>
    <Navbar />
    <div className="community">
      <section className="community__main">
        <div className="community__card community__section">
          <h2 style={{ marginTop: 0 }}>Create a post</h2>
          <PostCreator 
            currentUserId={currentUserId}
            onPostCreated={(newPost) => {
              // Add the new post to the feed immediately
              setRefreshFeed(prev => prev + 1);
            }} 
          />
        </div>

        <div className="community__card community__section">
          <CommunityFeed key={refreshFeed} currentUserId={currentUserId} />
        </div>

        <div className="community__card community__section">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Platform Announcements</h3>
          <AnnouncementsDisplay audience="all" />
        </div>
      </section>

      <aside className="community__sidebar">
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
            {trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <span key={topic._id} className="topic">
                  #{topic.topic}
                  <span className="topic-posts">({topic.posts})</span>
                </span>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Loading trending topics...</div>
            )}
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
            {communityGuidelines.length > 0 ? (
              communityGuidelines.map((guideline) => (
                <div key={guideline._id} className="guideline">
                  <div className="guideline-title">{guideline.title}</div>
                  <div className="guideline-content">{guideline.content}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">Loading community guidelines...</div>
            )}
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
    </>
  );
};

export default CommunityPage;