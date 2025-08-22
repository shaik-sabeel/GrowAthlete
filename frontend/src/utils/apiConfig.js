// src/utils/apiConfig.js

// Centralized configuration for external APIs used by the app.
// Runtime should prefer Vite env vars (import.meta.env) where available.

export const API_CONFIG = {
  NEWSDATA: {
    API_KEY: import.meta.env.VITE_NEWSDATA_API_KEY || "", // fallback empty
    BASE_URL: "https://newsdata.io/api/1/news",
  },
  SPORTSDB: {
    BASE_URL: "https://www.thesportsdb.com/api/v1/json/3", // demo key
  },
};

// Optional demo placeholders (safe for offline/dev use)
export const DEMO_NEWS = [
  {
    id: 1,
    title: "Demo: Rising Star Scores Big",
    description: "A young athlete made history in today’s game!",
  },
];

export const DEMO_LIVE_SCORES = [
  {
    id: 1,
    match: "Demo Match A vs B",
    score: "120/5 - 118/8",
    status: "Match completed",
  },
];

// Optional feature descriptions
export const FEATURES = [
  {
    id: "profiles",
    title: "Comprehensive Profiles",
    description: "Showcase achievements and skills.",
  },
  {
    id: "search",
    title: "Advanced Talent Search",
    description: "Discover promising talents.",
  },
  {
    id: "growth",
    title: "Guided Career Growth",
    description: "Access guidance and resources.",
  },
];
