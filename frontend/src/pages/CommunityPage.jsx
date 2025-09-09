// src/pages/CommunityPage.jsx

import React, { useEffect, useMemo, useState } from 'react';
import PostCreator from '../components/PostCreator';
import CommunityFeed from '../components/CommunityFeed';
import ImageCarousel from '../components/ImageCarousel';
import '../pages_css/CommunityPage.css';
// Removed Top Contributors and Platform Announcements

import Navbar from '../components/Navbar';

import api from '../utils/api';
import { getCurrentUserId } from '../utils/auth';


// Removed autoplay for Top Contributors

const CommunityPage = () => {
  // Removed Top Contributors state and data
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [communityGuidelines, setCommunityGuidelines] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshFeed, setRefreshFeed] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);
  const [topContributors, setTopContributors] = useState([]);
  const [loadingContribs, setLoadingContribs] = useState(false);
  
  // Removed contributor carousel autoplay effect

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

    const fetchUpcomingEvents = async () => {
      try {
        setLoadingUpcoming(true);
        const resp = await api.get('/events');
        const now = new Date();
        const events = Array.isArray(resp.data) ? resp.data : [];
        const filtered = events
          .filter(e => new Date(e.date) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setUpcomingEvents(filtered);
      } catch (err) {
        console.error('Failed to fetch upcoming events:', err);
        setUpcomingEvents([]);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    const fetchTopContributors = async () => {
      try {
        setLoadingContribs(true);
        const resp = await api.get('/community/public', {
          params: { page: 1, limit: 50, sort: 'mostLiked' }
        });
        const posts = Array.isArray(resp.data?.posts) ? resp.data.posts : [];
        const byAuthor = new Map();
        posts.forEach(p => {
          const a = p.author;
          if (!a || !a._id) return;
          const key = a._id;
          const likes = Array.isArray(p.likes) ? p.likes.length : 0;
          const entry = byAuthor.get(key) || { author: a, posts: 0, likes: 0 };
          entry.posts += 1;
          entry.likes += likes;
          byAuthor.set(key, entry);
        });
        const ranked = Array.from(byAuthor.values())
          .sort((x, y) => y.likes - x.likes || y.posts - x.posts)
          .slice(0, 5);
        setTopContributors(ranked);
      } catch (e) {
        console.error('Failed to fetch top contributors:', e);
        setTopContributors([]);
      } finally {
        setLoadingContribs(false);
      }
    };

    // Get current user ID from auth utility
    const userId = getCurrentUserId();
    setCurrentUserId(userId);

    fetchTrendingTopics();
    fetchCommunityGuidelines();
    fetchUpcomingEvents();
    fetchTopContributors();
  }, []);

  return (
    <>
    <Navbar />
    <div className="community">
      <section className="community__main">
        <div className="community__card community__section">
          <h2 style={{ marginTop: 0 , fontSize: "40px"}}>Create a post</h2>
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

        {/* Removed Platform Announcements section */}
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
            {loadingUpcoming && (
              <div className="text-gray-500 text-sm">Loading events...</div>
            )}
            {!loadingUpcoming && upcomingEvents.length === 0 && (
              <div className="text-gray-500 text-sm">No upcoming events</div>
            )}
            {!loadingUpcoming && upcomingEvents.map((e) => (
              <a key={e._id} href={`/events/${e._id}`} className="event" style={{ textDecoration: 'none' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{e.title}</div>
                  <div className="meta">{new Date(e.date).toLocaleDateString()} • {e.location}</div>
                </div>
              </a>
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
          {loadingContribs && (
            <div className="text-gray-500 text-sm">Loading...</div>
          )}
          {!loadingContribs && topContributors.length === 0 && (
            <div className="text-gray-500 text-sm">No data available</div>
          )}
          {!loadingContribs && topContributors.length > 0 && (
            <div className="space-y-3">
              {topContributors.map(tc => (
                <div key={tc.author._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <img
                      src={tc.author.profilePicture || '/default-avatar.png'}
                      alt={tc.author.username}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{tc.author.username}</div>
                      <div className="text-xs text-gray-500">{tc.posts} posts • {tc.likes} likes</div>
                    </div>
                  </div>
                  <a href={`/profile?user=${tc.author._id}`} className="text-xs text-blue-600 hover:underline">View</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
    </>
  );
};

export default CommunityPage;