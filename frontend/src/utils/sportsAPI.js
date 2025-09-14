// src/utils/sportsAPI.js
import { API_CONFIG, DEMO_NEWS, DEMO_LIVE_SCORES, FEATURES } from './apiConfig.js';

// Prefer Vite env, but also keep existing config fallback
const ENV_API_KEY = (import.meta?.env?.VITE_NEWSDATA_API_KEY) || (import.meta?.env?.REACT_APP_NEWSDATA_API_KEY);

// API Configuration
const NEWSDATA_API_KEY = ENV_API_KEY || API_CONFIG.NEWSDATA.API_KEY || "pub_8a903795015d4fb1bd83ff7bd2f94ee5";
const NEWSDATA_BASE_URL = API_CONFIG.NEWSDATA.BASE_URL;
const SPORTSDB_BASE_URL = API_CONFIG.SPORTSDB.BASE_URL;

// Debug logging
console.log('🔧 News API Configuration:');
console.log('Environment API Key:', ENV_API_KEY ? 'Found' : 'Not found');
console.log('Final API Key:', NEWSDATA_API_KEY ? `${NEWSDATA_API_KEY.substring(0, 10)}...` : 'Not set');
console.log('Base URL:', NEWSDATA_BASE_URL);

// Continent to country mapping
const CONTINENT_COUNTRIES = {
  indian: 'in',
  Indian: 'in',
  asian: 'cn,jp,kr,th,my,sg,id',
  Asian: 'cn,jp,kr,th,my,sg,id',
  european: 'gb,de,fr,it,es,nl',
  European: 'gb,de,fr,it,es,nl',
  australian: 'au,nz',
  Australian: 'au,nz',
  american: 'us,ca,br,ar,mx',
  American: 'us,ca,br,ar,mx',
  african: 'ng,za,eg,ke,ma',
  African: 'ng,za,eg,ke,ma'
};

// Sports categories
export const SPORTS_CATEGORIES = [
  'all', 'cricket', 'football', 'basketball', 'badminton', 
  'table tennis', 'tennis', 'golf', 'hockey', 'swimming', 
  'athletics', 'boxing', 'wrestling'
];

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const isCacheValid = (timestamp) => Date.now() - timestamp < CACHE_DURATION;
const getCacheKey = (type, params) => `${type}_${JSON.stringify(params)}`;

// Rate limiting
let requestCount = 0;
let lastResetTime = Date.now();
const RATE_LIMIT = 100; // requests per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastResetTime > RATE_LIMIT_WINDOW) { requestCount = 0; lastResetTime = now; }
  if (requestCount >= RATE_LIMIT) throw new Error('Rate limit exceeded. Please try again later.');
  requestCount++;
};

// Exponential backoff for retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const exponentialBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); } catch (error) { if (i === maxRetries - 1) throw error; const d = Math.min(1000 * Math.pow(2, i), 10000); await delay(d); }
  }
};

// Helper: detect sport from text/keywords
const detectSportCategory = (text, keywords = []) => {
  const lowerText = (text || '').toLowerCase();
  const all = Array.isArray(keywords) ? keywords.join(' ').toLowerCase() : '';
  const hay = `${lowerText} ${all}`;
  const map = {
    cricket: ['cricket', 'ipl', 'odi', 't20'],
    football: ['football', 'soccer', 'uefa', 'premier league', 'laliga', 'serie a'],
    basketball: ['basketball', 'nba'],
    tennis: ['tennis', 'wimbledon', 'us open', 'australian open'],
    badminton: ['badminton'],
    'table tennis': ['table tennis', 'ping pong'],
    golf: ['golf', 'pga', 'masters'],
    hockey: ['hockey'],
    swimming: ['swimming'],
    athletics: ['athletics', 'marathon', 'sprint'],
    boxing: ['boxing'],
    wrestling: ['wrestling']
  };
  for (const [sport, kws] of Object.entries(map)) if (kws.some(k => hay.includes(k))) return sport;
  return 'sports';
};

// Keyword maps for query construction
const SPORT_TERMS = {
  all: [],
  cricket: ['cricket', 'IPL', 'test match', 'ODI', 'T20'],
  football: ['football', 'soccer', 'FIFA', 'Premier League', 'Champions League'],
  basketball: ['basketball', 'NBA', 'playoffs'],
  tennis: ['tennis', 'Wimbledon', 'US Open', 'ATP', 'WTA'],
  badminton: ['badminton'],
  'table tennis': ['table tennis', 'ping pong'],
  golf: ['golf', 'PGA', 'Masters'],
  hockey: ['hockey'],
  swimming: ['swimming'],
  athletics: ['athletics', 'marathon', 'sprint', 'track and field'],
  boxing: ['boxing'],
  wrestling: ['wrestling']
};

const REGION_TERMS = {
  indian: ['India', 'Indian', 'IPL', 'Kabaddi', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'],
  Asian: ['Asia', 'Asian', 'Tokyo', 'Beijing', 'Seoul', 'Singapore'],
  asian: ['Asia', 'Asian', 'Tokyo', 'Beijing', 'Seoul', 'Singapore'],
  European: ['Europe', 'European', 'Premier League', 'Champions League', 'La Liga', 'Serie A', 'Bundesliga'],
  european: ['Europe', 'European', 'Premier League', 'Champions League', 'La Liga', 'Serie A', 'Bundesliga'],
  American: ['USA', 'American', 'NBA', 'NFL', 'MLB', 'NHL'],
  american: ['USA', 'American', 'NBA', 'NFL', 'MLB', 'NHL'],
  Australian: ['Australia', 'Aussie', 'New Zealand', 'Big Bash'],
  australian: ['Australia', 'Aussie', 'New Zealand', 'Big Bash'],
  African: ['Africa', 'African', 'Nigeria', 'South Africa', 'Kenya', 'Morocco', 'Egypt'],
  african: ['Africa', 'African', 'Nigeria', 'South Africa', 'Kenya', 'Morocco', 'Egypt']
};

const buildQuery = (continent, sport) => {
  const sportTerms = SPORT_TERMS[sport] || [];
  const regionTerms = REGION_TERMS[continent] || [];
  const sportPart = sportTerms.length ? `(${sportTerms.join(' OR ')})` : '';
  const regionPart = regionTerms.length ? `(${regionTerms.join(' OR ')})` : '';

  if (sportPart && regionPart) return `${sportPart} AND ${regionPart}`;
  if (sportPart) return sportPart;
  if (regionPart) return regionPart;
  return '';
};

// New: Fetch news by continent and sport using NewsData.io's results array
export const fetchNewsByContinent = async (continent = 'indian', sport = 'all', page = 1) => {
  try {
    if (!NEWSDATA_API_KEY) throw new Error('Missing NewsData.io API key');
    checkRateLimit();

    const countryCodes = CONTINENT_COUNTRIES[continent] || CONTINENT_COUNTRIES['Indian'];
    const cacheKey = getCacheKey('newsByContinent', { continent, sport, page });
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) return cached.data;

    const buildUrl = (countriesCsv, qOverride) => {
      const url = new URL(NEWSDATA_BASE_URL);
      url.searchParams.append('apikey', NEWSDATA_API_KEY);
      if (countriesCsv) url.searchParams.append('country', countriesCsv);
      url.searchParams.append('category', 'sports');
      url.searchParams.append('language', 'en');
      const q = qOverride ?? buildQuery(continent, sport);
      if (q && q.trim()) url.searchParams.append('q', q);
      url.searchParams.append('page', String(page));
      return url;
    };

    // 1) Try aggregated with compound query (sport AND region)
    let url = buildUrl(countryCodes);
    console.log('[fetchNewsByContinent] agg url:', url.toString());
    let res = await exponentialBackoff(async () => { const r = await fetch(url.toString()); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r; });
    let data = await res.json();
    let results = Array.isArray(data?.results) ? data.results : [];
    console.log('[fetchNewsByContinent] agg results:', results.length);

    // 2) If none, relax to sport-only query
    if ((!results || results.length === 0) && sport !== 'all') {
      url = buildUrl(countryCodes, `(${(SPORT_TERMS[sport] || []).join(' OR ')})`);
      console.log('[fetchNewsByContinent] agg sport-only url:', url.toString());
      res = await exponentialBackoff(async () => { const r = await fetch(url.toString()); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r; });
      data = await res.json();
      results = Array.isArray(data?.results) ? data.results : [];
      console.log('[fetchNewsByContinent] agg sport-only results:', results.length);
    }

    // 3) If still none, fan-out per-country with original compound query
    if ((!results || results.length === 0) && countryCodes) {
      const codes = countryCodes.split(',').slice(0, 6);
      const settled = await Promise.allSettled(codes.map(code => exponentialBackoff(async () => {
        const u = buildUrl(code);
        console.log('[fetchNewsByContinent] single url:', u.toString());
        const r = await fetch(u.toString());
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })));
      const merged = [];
      for (const s of settled) if (s.status === 'fulfilled') merged.push(...(Array.isArray(s.value?.results) ? s.value.results : []));
      results = merged;
      console.log('[fetchNewsByContinent] single merged results:', results.length);
    }

    const processed = (results || []).map((item) => ({
      id: item.article_id || item.link || Math.random().toString(36).slice(2),
      title: item.title,
      description: item.description || item.content,
      url: item.link,
      image: item.image_url,
      source: item.source_id || '',
      publishedAt: item.pubDate,
      category: detectSportCategory(`${item.title || ''} ${item.description || ''}`, item.keywords),
      continent,
      country: Array.isArray(item.country) ? item.country[0] : undefined,
    })).filter((a) => a.title);

    cache.set(cacheKey, { data: processed, timestamp: Date.now() });
    return processed;
  } catch (e) {
    console.error('[fetchNewsByContinent] error:', e);
    const cacheKey = getCacheKey('newsByContinent', { continent, sport, page });
    const cached = cache.get(cacheKey);
    if (cached) return cached.data;
    return [];
  }
};

// Legacy helpers kept for other callers (now route through fetchNewsByContinent)
export const fetchNews = async (continent, sports = ['all'], page = 1) => {
  const sport = Array.isArray(sports) ? (sports.includes('all') ? 'all' : sports[0]) : (sports || 'all');
  return fetchNewsByContinent(continent, sport, page);
};

export const fetchLiveScores = async () => {
  try {
    const cacheKey = getCacheKey('scores', {});
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached.timestamp)) return cached.data;

    const response = await exponentialBackoff(async () => {
      const res = await fetch(`${SPORTSDB_BASE_URL}/livescore.php`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res;
    });

    const data = await response.json();
    const processedScores = (data.events || []).map(event => ({
      id: event.idEvent,
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      homeScore: event.intHomeScore,
      awayScore: event.intAwayScore,
      status: event.strStatus,
      time: event.strTime,
      date: event.dateEvent,
      sport: event.strSport,
      league: event.strLeague,
      homeTeamBadge: event.strHomeTeamBadge,
      awayTeamBadge: event.strAwayTeamBadge,
      progress: event.strProgress
    })).filter(score => score.homeTeam && score.awayTeam);

    cache.set(cacheKey, { data: processedScores, timestamp: Date.now() });
    return processedScores;
  } catch (error) {
    console.error('Error fetching live scores:', error);
    const cacheKey = getCacheKey('scores', {});
    const cached = cache.get(cacheKey);
    if (cached) return cached.data;
    return [];
  }
};

export const searchNews = async (query, continent = null, sports = ['all']) => {
  const sport = Array.isArray(sports) ? (sports.includes('all') ? 'all' : sports[0]) : (sports || 'all');
  const allNews = await fetchNewsByContinent(continent || 'indian', sport, 1);
  if (!query?.trim()) return allNews;
  const term = query.toLowerCase();
  return allNews.filter(a => (a.title || '').toLowerCase().includes(term) || (a.description || '').toLowerCase().includes(term) || (a.source || '').toLowerCase().includes(term));
};

export const getTrendingNews = async () => {
  const allNews = await fetchNewsByContinent('indian', 'all', 1);
  const keys = ['championship', 'world cup', 'final', 'victory', 'record'];
  return allNews.filter(a => keys.some(k => (`${a.title} ${a.description}`).toLowerCase().includes(k))).slice(0, 10);
};

export const clearCache = () => { cache.clear(); };

// Simple continent map for basic fetching
const SIMPLE_COUNTRIES = {
  indian: 'in',
  asian: 'cn,jp,kr,th',
  european: 'gb,de,fr,it,es',
  australian: 'au,nz',
  american: 'us,ca,br,ar,mx',
  african: 'ng,za,eg,ke,ma'
};

// Mock data for when API key is not available
const MOCK_NEWS_DATA = {
  indian: {
    all: [
      {
        id: 'mock-1',
        title: 'Indian Cricket Team Prepares for World Cup',
        description: 'The Indian cricket team is gearing up for the upcoming World Cup with intensive training sessions and strategic planning.',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
        url: 'https://example.com/cricket-world-cup',
        publishedAt: new Date().toISOString(),
        source: 'Sports Today'
      },
      {
        id: 'mock-2',
        title: 'Neeraj Chopra Wins Gold at Asian Games',
        description: 'Olympic champion Neeraj Chopra continues his winning streak with another gold medal at the Asian Games.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        url: 'https://example.com/neeraj-chopra-gold',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Athletics Weekly'
      },
      {
        id: 'mock-3',
        title: 'Indian Football Team Qualifies for AFC Cup',
        description: 'The Indian football team has successfully qualified for the AFC Cup after a thrilling match against their rivals.',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
        url: 'https://example.com/indian-football-afc',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'Football India'
      }
    ],
    cricket: [
      {
        id: 'mock-cricket-1',
        title: 'Virat Kohli Returns to Form with Century',
        description: 'Former Indian captain Virat Kohli scored a brilliant century in the recent test match, silencing his critics.',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
        url: 'https://example.com/kohli-century',
        publishedAt: new Date().toISOString(),
        source: 'Cricket Today'
      }
    ],
    football: [
      {
        id: 'mock-football-1',
        title: 'ISL Season Kicks Off with Exciting Matches',
        description: 'The Indian Super League has started with some thrilling encounters and promising young talent.',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
        url: 'https://example.com/isl-season-start',
        publishedAt: new Date().toISOString(),
        source: 'ISL News'
      }
    ]
  },
  asian: {
    all: [
      {
        id: 'mock-asian-1',
        title: 'Asian Games 2024: Record Breaking Performances',
        description: 'Athletes from across Asia have delivered exceptional performances at the ongoing Asian Games.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        url: 'https://example.com/asian-games-2024',
        publishedAt: new Date().toISOString(),
        source: 'Asian Sports'
      }
    ]
  },
  european: {
    all: [
      {
        id: 'mock-european-1',
        title: 'Premier League: Manchester City Dominates',
        description: 'Manchester City continues their winning streak in the Premier League with another convincing victory.',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
        url: 'https://example.com/manchester-city-win',
        publishedAt: new Date().toISOString(),
        source: 'Premier League News'
      }
    ]
  }
};

// Simple fetch per user's spec
export const getNews = async (continent = 'indian', sport = 'all') => {
  try {
    console.log(`[getNews] Starting request for continent: ${continent}, sport: ${sport}`);
    
    if (!NEWSDATA_API_KEY) {
      console.warn('[getNews] No API key found, using mock data');
      return getMockNews(continent, sport);
    }
    
    const countries = SIMPLE_COUNTRIES[continent] || SIMPLE_COUNTRIES['indian'];
    const url = new URL(NEWSDATA_BASE_URL);
    url.searchParams.append('apikey', NEWSDATA_API_KEY);
    if (countries) url.searchParams.append('country', countries);
    url.searchParams.append('category', 'sports');
    url.searchParams.append('language', 'en');
    if (sport && sport !== 'all') url.searchParams.append('q', sport);

    console.log('[getNews] Request URL:', url.toString());
    console.log('[getNews] Making API request...');
    
    const res = await fetch(url.toString());
    console.log('[getNews] Response status:', res.status);
    console.log('[getNews] Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[getNews] HTTP Error ${res.status}:`, errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('[getNews] API Response:', data);
    
    const results = Array.isArray(data?.results) ? data.results : [];
    console.log(`[getNews] Found ${results.length} articles`);

    if (results.length === 0) {
      console.warn('[getNews] No articles returned from API, using mock data');
      return getMockNews(continent, sport);
    }

    const processedResults = results.map(item => ({
      id: item.article_id || item.link || Math.random().toString(36).slice(2),
      title: item.title,
      description: item.description,
      image: item.image_url,
      url: item.link,
      publishedAt: item.pubDate,
      source: item.source_id
    }));
    
    console.log(`[getNews] Returning ${processedResults.length} processed articles`);
    return processedResults;
    
  } catch (e) {
    console.error('[getNews] Error:', e);
    console.warn('[getNews] Falling back to mock data due to API error.');
    return getMockNews(continent, sport);
  }
};

// Fallback function to get mock news data
const getMockNews = (continent, sport) => {
  console.log(`[getMockNews] Generating mock data for continent: ${continent}, sport: ${sport}`);
  
  const continentData = MOCK_NEWS_DATA[continent] || MOCK_NEWS_DATA.indian;
  const sportData = continentData[sport] || continentData.all;
  
  console.log(`[getMockNews] Found ${sportData.length} mock articles`);
  
  // Add some randomization to make it feel more dynamic
  const shuffledData = [...sportData].sort(() => Math.random() - 0.5);
  
  const mockResults = shuffledData.map(item => ({
    ...item,
    // Add some variation to published dates
    publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
  }));
  
  console.log(`[getMockNews] Returning ${mockResults.length} mock articles`);
  return mockResults;
};

// Test function for debugging - can be called from browser console
export const testNewsAPI = async () => {
  console.log('🧪 Testing News API...');
  try {
    const news = await getNews('indian', 'cricket');
    console.log('✅ News API Test Results:', news);
    console.log(`📊 Retrieved ${news.length} articles`);
    return news;
  } catch (error) {
    console.error('❌ News API Test Failed:', error);
    return null;
  }
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  window.testNewsAPI = testNewsAPI;
  window.getNews = getNews;
}
