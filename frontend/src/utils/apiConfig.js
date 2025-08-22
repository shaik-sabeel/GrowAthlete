// src/utils/apiConfig.js

feature/admin-page
export const API_CONFIG = {
  NEWSDATA: {

// Centralized configuration for external APIs used by the app.
// Values here act as safe defaults; runtime should prefer Vite env vars where available.

export const API_CONFIG = {
  NEWSDATA: {
    // Prefer Vite env var VITE_NEWSDATA_API_KEY in code; this is only a fallback.
 main
    API_KEY: '',
    BASE_URL: 'https://newsdata.io/api/1/news'
  },
  SPORTSDB: {
 feature/admin-page

    // Using TheSportsDB demo key (3) for public, non-authenticated requests
 main
    BASE_URL: 'https://www.thesportsdb.com/api/v1/json/3'
  }
};

 feature/admin-page
export const DEMO_NEWS = [];
export const DEMO_LIVE_SCORES = [];


// Optional demo placeholders (kept for compatibility with existing imports)
export const DEMO_NEWS = [];
export const DEMO_LIVE_SCORES = [];

// Optional features placeholder (actual UI copies live in constants if needed)
 main
export const FEATURES = [
  { id: 'profiles', title: 'Comprehensive Profiles', description: 'Showcase achievements and skills.' },
  { id: 'search', title: 'Advanced Talent Search', description: 'Discover promising talents.' },
  { id: 'growth', title: 'Guided Career Growth', description: 'Access guidance and resources.' }
];
 feature/admin-page



 main
