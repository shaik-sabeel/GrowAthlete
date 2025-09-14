// src/utils/apiConfig.js
// API Configuration for SportsPulse

// To use the SportsPulse application with real data:
// 1. Get your free API key from https://newsdata.io/
// 2. Set Vite env variable VITE_NEWSDATA_API_KEY in a .env file
// 3. The TheSportsDB API is completely free and doesn't require an API key

export const API_CONFIG = {
  // NewsData.io API Configuration
  NEWSDATA: {
    BASE_URL: 'https://newsdata.io/api/1/latest',
    // Use Vite env for API key (Preferred)
    API_KEY: (import.meta?.env?.VITE_NEWSDATA_API_KEY) || 'pub_b5b347272be94204bf47403a809e0b74',
    RATE_LIMIT: 200, // requests per hour for free tier
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
  },
  
  // TheSportsDB API Configuration (completely free)
  SPORTSDB: {
    BASE_URL: 'https://www.thesportsdb.com/api/v1/json/3',
    // No API key required for TheSportsDB
    CACHE_DURATION: 30 * 1000 // 30 seconds for live scores
  }
};

// Demo data for testing (used when API key is not available)
export const DEMO_NEWS = [
  // Indian continent - Cricket dominant
  {
    id: 'demo-1',
    title: 'India Wins Cricket World Cup Final in Thrilling Match',
    description: 'In a nail-biting finish, India secured victory in the Cricket World Cup final with a spectacular performance from their batting lineup.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/10B981/FFFFFF?text=Cricket+News',
    source: 'Sports India',
    publishedAt: new Date().toISOString(),
    category: 'cricket',
    continent: 'Indian',
    country: 'in'
  },
  {
    id: 'demo-2',
    title: 'IPL 2024: Mumbai Indians vs Chennai Super Kings Tonight',
    description: 'The biggest rivalry in Indian cricket continues tonight as Mumbai Indians face Chennai Super Kings in a crucial IPL match.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/10B981/FFFFFF?text=IPL+Cricket',
    source: 'Cricket India',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    category: 'cricket',
    continent: 'Indian',
    country: 'in'
  },
  {
    id: 'demo-3',
    title: 'Indian Football Team Qualifies for Asian Cup',
    description: 'Indian national football team secures qualification for the Asian Cup with a convincing victory over their opponents.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=Football+India',
    source: 'Football India',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    category: 'football',
    continent: 'Indian',
    country: 'in'
  },
  
  // European continent - Football dominant
  {
    id: 'demo-4',
    title: 'Premier League: Manchester United Defeats Arsenal 3-1',
    description: 'Manchester United showcased brilliant teamwork in their latest Premier League match against Arsenal, winning with a convincing 3-1 score.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=Premier+League',
    source: 'Football Weekly',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'football',
    continent: 'European',
    country: 'gb'
  },
  {
    id: 'demo-5',
    title: 'Champions League Final: Real Madrid vs Bayern Munich',
    description: 'The most anticipated match of the season as Real Madrid faces Bayern Munich in the Champions League final at Wembley.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=Champions+League',
    source: 'UEFA News',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    category: 'football',
    continent: 'European',
    country: 'gb'
  },
  {
    id: 'demo-6',
    title: 'Wimbledon 2024: British Players Advance to Semifinals',
    description: 'British tennis players make history by advancing to the semifinals at Wimbledon, creating excitement among home crowds.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/84CC16/FFFFFF?text=Wimbledon+Tennis',
    source: 'Tennis UK',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    category: 'tennis',
    continent: 'European',
    country: 'gb'
  },
  
  // American continent - Basketball dominant
  {
    id: 'demo-7',
    title: 'NBA Finals: Lakers vs Celtics in Epic Showdown',
    description: 'The NBA Finals heat up as Lakers face Celtics in what promises to be one of the most exciting championship series in recent history.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/EF4444/FFFFFF?text=NBA+Finals',
    source: 'NBA Central',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    category: 'basketball',
    continent: 'American',
    country: 'us'
  },
  {
    id: 'demo-8',
    title: 'LeBron James Breaks Another NBA Record',
    description: 'LeBron James continues to make history as he breaks another long-standing NBA record in last nights game against the Warriors.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/EF4444/FFFFFF?text=NBA+Record',
    source: 'Basketball News',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    category: 'basketball',
    continent: 'American',
    country: 'us'
  },
  
  // Asian continent - Football and Badminton dominant
  {
    id: 'demo-9',
    title: 'Asian Games: Badminton Championships Begin in China',
    description: 'The Asian Games badminton championships commence with top players from across Asia competing for the prestigious gold medal.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/8B5CF6/FFFFFF?text=Asian+Badminton',
    source: 'Badminton Asia',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: 'badminton',
    continent: 'Asian',
    country: 'cn'
  },
  {
    id: 'demo-10',
    title: 'J-League: Tokyo FC Wins Championship Title',
    description: 'Tokyo FC celebrates their J-League championship victory after a thrilling season finale against Osaka United.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=J-League+Football',
    source: 'J-League News',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    category: 'football',
    continent: 'Asian',
    country: 'jp'
  },
  
  // Australian continent - Cricket dominant
  {
    id: 'demo-11',
    title: 'Big Bash League: Sydney Thunder vs Melbourne Stars',
    description: 'The Big Bash League continues with an exciting match-up between Sydney Thunder and Melbourne Stars at the SCG.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/10B981/FFFFFF?text=Big+Bash+Cricket',
    source: 'Cricket Australia',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    category: 'cricket',
    continent: 'Australian',
    country: 'au'
  },
  {
    id: 'demo-12',
    title: 'Australian Open Tennis: Djokovic Advances to Finals',
    description: 'Novak Djokovic secures his place in the Australian Open finals after a commanding victory in the semifinals.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/84CC16/FFFFFF?text=Australian+Open',
    source: 'Tennis Australia',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    category: 'tennis',
    continent: 'Australian',
    country: 'au'
  },
  
  // African continent - Football and Athletics dominant
  {
    id: 'demo-13',
    title: 'AFCON 2024: Nigeria vs South Africa in Semi-Final',
    description: 'African Cup of Nations reaches its climax as Nigeria faces South Africa in what promises to be an electrifying semi-final.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=AFCON+Football',
    source: 'African Football',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    category: 'football',
    continent: 'African',
    country: 'ng'
  },
  {
    id: 'demo-14',
    title: 'African Athletics Championship: Kenya Dominates Marathon',
    description: 'Kenyan athletes showcase their legendary endurance skills by sweeping the marathon events at the African Athletics Championship.',
    url: '#',
    image: 'https://via.placeholder.com/400x225/DC2626/FFFFFF?text=African+Athletics',
    source: 'Athletics Africa',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    category: 'athletics',
    continent: 'African',
    country: 'ke'
  }
];

export const DEMO_LIVE_SCORES = [
  {
    id: 'live-1',
    homeTeam: 'Mumbai Indians',
    awayTeam: 'Chennai Super Kings',
    homeScore: '185',
    awayScore: '178',
    status: 'Live',
    progress: '19.4 overs',
    sport: 'Cricket',
    league: 'IPL 2024',
    date: new Date().toDateString(),
    time: '19:30'
  },
  {
    id: 'live-2',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeScore: '2',
    awayScore: '1',
    status: 'Live',
    progress: "78'",
    sport: 'Football',
    league: 'Premier League',
    date: new Date().toDateString(),
    time: '17:00'
  },
  {
    id: 'live-3',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeScore: '95',
    awayScore: '92',
    status: 'Live',
    progress: 'Q3 8:45',
    sport: 'Basketball',
    league: 'NBA',
    date: new Date().toDateString(),
    time: '20:00'
  },
  {
    id: 'live-4',
    homeTeam: 'Australia',
    awayTeam: 'New Zealand',
    homeScore: '2',
    awayScore: '1',
    status: 'Match Finished',
    progress: 'FT',
    sport: 'Hockey',
    league: 'World Cup',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toDateString(),
    time: '14:00'
  },
  {
    id: 'live-5',
    homeTeam: 'India',
    awayTeam: 'Pakistan',
    homeScore: '',
    awayScore: '',
    status: 'Not Started',
    progress: '',
    sport: 'Cricket',
    league: 'Asia Cup',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString(),
    time: '15:00'
  }
];

// Environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Sport popularity by continent (most popular first)
export const CONTINENT_SPORT_POPULARITY = {
  Indian: ['cricket', 'football', 'hockey', 'badminton', 'tennis', 'basketball', 'wrestling', 'athletics', 'boxing', 'table tennis', 'swimming', 'golf'],
  Asian: ['football', 'badminton', 'table tennis', 'cricket', 'basketball', 'tennis', 'athletics', 'swimming', 'boxing', 'wrestling', 'hockey', 'golf'],
  European: ['football', 'tennis', 'athletics', 'swimming', 'basketball', 'golf', 'hockey', 'boxing', 'wrestling', 'table tennis', 'badminton', 'cricket'],
  Australian: ['cricket', 'football', 'tennis', 'swimming', 'athletics', 'golf', 'basketball', 'hockey', 'boxing', 'wrestling', 'table tennis', 'badminton'],
  American: ['basketball', 'football', 'baseball', 'athletics', 'swimming', 'tennis', 'golf', 'hockey', 'boxing', 'wrestling', 'table tennis', 'badminton', 'cricket'],
  African: ['football', 'athletics', 'cricket', 'basketball', 'tennis', 'boxing', 'swimming', 'wrestling', 'hockey', 'golf', 'table tennis', 'badminton']
};

// Feature flags
export const FEATURES = {
  USE_DEMO_DATA: !API_CONFIG.NEWSDATA.API_KEY || API_CONFIG.NEWSDATA.API_KEY === 'YOUR_NEWSDATA_API_KEY_HERE',
  ENABLE_NOTIFICATIONS: true,
  ENABLE_BOOKMARKS: true,
  ENABLE_SOCIAL_SHARING: true,
  ENABLE_OFFLINE_MODE: true
};

