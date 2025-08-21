// src/utils/sportsAPI.js
import { API_CONFIG, DEMO_NEWS, DEMO_LIVE_SCORES, FEATURES } from './apiConfig.js';

// Prefer Vite env, but also keep existing config fallback
const ENV_API_KEY = (import.meta?.env?.VITE_NEWSDATA_API_KEY) || (import.meta?.env?.REACT_APP_NEWSDATA_API_KEY);

// API Configuration
const NEWSDATA_API_KEY = ENV_API_KEY || API_CONFIG.NEWSDATA.API_KEY;
const NEWSDATA_BASE_URL = API_CONFIG.NEWSDATA.BASE_URL;
const SPORTSDB_BASE_URL = API_CONFIG.SPORTSDB.BASE_URL;

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

// Simple fetch per user's spec
export const getNews = async (continent = 'indian', sport = 'all') => {
  try {
    const countries = SIMPLE_COUNTRIES[continent] || SIMPLE_COUNTRIES['indian'];
    const url = new URL(NEWSDATA_BASE_URL);
    url.searchParams.append('apikey', NEWSDATA_API_KEY);
    if (countries) url.searchParams.append('country', countries);
    url.searchParams.append('category', 'sports');
    url.searchParams.append('language', 'en');
    if (sport && sport !== 'all') url.searchParams.append('q', sport);

    console.log('[getNews] url:', url.toString());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    return results.map(item => ({
      id: item.article_id || item.link || Math.random().toString(36).slice(2),
      title: item.title,
      description: item.description,
      image: item.image_url,
      url: item.link,
      publishedAt: item.pubDate,
      source: item.source_id
    }));
  } catch (e) {
    console.error('[getNews] error:', e);
    throw e;
  }
};
