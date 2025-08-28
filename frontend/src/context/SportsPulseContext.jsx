// src/context/SportsPulseContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  selectedContinent: 'Indian',
  selectedSports: ['all'],
  news: [],
  liveScores: [],
  bookmarks: JSON.parse(localStorage.getItem('sportsPulseBookmarks') || '[]'),
  theme: localStorage.getItem('sportsPulseTheme') || 'light',
  autoRefresh: JSON.parse(localStorage.getItem('sportsPulseAutoRefresh') || 'true'),
  loading: {
    news: false,
    scores: false
  },
  error: {
    news: null,
    scores: null
  },
  lastUpdated: {
    news: null,
    scores: null
  },
  searchQuery: '',
  trending: [],
  newArticlesCount: 0
};

// Action types
const ActionTypes = {
  SET_CONTINENT: 'SET_CONTINENT',
  SET_SPORTS: 'SET_SPORTS',
  SET_NEWS: 'SET_NEWS',
  SET_LIVE_SCORES: 'SET_LIVE_SCORES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
  TOGGLE_THEME: 'TOGGLE_THEME',
  TOGGLE_AUTO_REFRESH: 'TOGGLE_AUTO_REFRESH',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_TRENDING: 'SET_TRENDING',
  SET_NEW_ARTICLES_COUNT: 'SET_NEW_ARTICLES_COUNT',
  UPDATE_LAST_UPDATED: 'UPDATE_LAST_UPDATED'
};

// Reducer
const sportsPulseReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CONTINENT:
      return { ...state, selectedContinent: action.payload };
    
    case ActionTypes.SET_SPORTS:
      return { ...state, selectedSports: action.payload };
    
    case ActionTypes.SET_NEWS:
      return { 
        ...state, 
        news: action.payload,
        loading: { ...state.loading, news: false },
        error: { ...state.error, news: null }
      };
    
    case ActionTypes.SET_LIVE_SCORES:
      return { 
        ...state, 
        liveScores: action.payload,
        loading: { ...state.loading, scores: false },
        error: { ...state.error, scores: null }
      };
    
    case ActionTypes.SET_LOADING:
      return { 
        ...state, 
        loading: { ...state.loading, [action.payload.type]: action.payload.value }
      };
    
    case ActionTypes.SET_ERROR:
      return { 
        ...state, 
        error: { ...state.error, [action.payload.type]: action.payload.value },
        loading: { ...state.loading, [action.payload.type]: false }
      };
    
    case ActionTypes.ADD_BOOKMARK:
      const newBookmarks = [...state.bookmarks, action.payload];
      localStorage.setItem('sportsPulseBookmarks', JSON.stringify(newBookmarks));
      return { ...state, bookmarks: newBookmarks };
    
    case ActionTypes.REMOVE_BOOKMARK:
      const filteredBookmarks = state.bookmarks.filter(id => id !== action.payload);
      localStorage.setItem('sportsPulseBookmarks', JSON.stringify(filteredBookmarks));
      return { ...state, bookmarks: filteredBookmarks };
    
    case ActionTypes.TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('sportsPulseTheme', newTheme);
      return { ...state, theme: newTheme };
    
    case ActionTypes.TOGGLE_AUTO_REFRESH:
      const newAutoRefresh = !state.autoRefresh;
      localStorage.setItem('sportsPulseAutoRefresh', JSON.stringify(newAutoRefresh));
      return { ...state, autoRefresh: newAutoRefresh };
    
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ActionTypes.SET_TRENDING:
      return { ...state, trending: action.payload };
    
    case ActionTypes.SET_NEW_ARTICLES_COUNT:
      return { ...state, newArticlesCount: action.payload };
    
    case ActionTypes.UPDATE_LAST_UPDATED:
      return { 
        ...state, 
        lastUpdated: { ...state.lastUpdated, [action.payload.type]: action.payload.time }
      };
    
    default:
      return state;
  }
};

// Context
const SportsPulseContext = createContext();

// Provider component
export const SportsPulseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sportsPulseReducer, initialState);

  // Actions
  const actions = {
    setContinent: (continent) => dispatch({ type: ActionTypes.SET_CONTINENT, payload: continent }),
    setSports: (sports) => dispatch({ type: ActionTypes.SET_SPORTS, payload: sports }),
    setNews: (news) => dispatch({ type: ActionTypes.SET_NEWS, payload: news }),
    setLiveScores: (scores) => dispatch({ type: ActionTypes.SET_LIVE_SCORES, payload: scores }),
    setLoading: (type, value) => dispatch({ type: ActionTypes.SET_LOADING, payload: { type, value } }),
    setError: (type, value) => dispatch({ type: ActionTypes.SET_ERROR, payload: { type, value } }),
    addBookmark: (id) => dispatch({ type: ActionTypes.ADD_BOOKMARK, payload: id }),
    removeBookmark: (id) => dispatch({ type: ActionTypes.REMOVE_BOOKMARK, payload: id }),
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    toggleAutoRefresh: () => dispatch({ type: ActionTypes.TOGGLE_AUTO_REFRESH }),
    setSearchQuery: (query) => dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),
    setTrending: (trending) => dispatch({ type: ActionTypes.SET_TRENDING, payload: trending }),
    setNewArticlesCount: (count) => dispatch({ type: ActionTypes.SET_NEW_ARTICLES_COUNT, payload: count }),
    updateLastUpdated: (type, time) => dispatch({ type: ActionTypes.UPDATE_LAST_UPDATED, payload: { type, time } })
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <SportsPulseContext.Provider value={{ state, actions }}>
      {children}
    </SportsPulseContext.Provider>
  );
};

// Custom hook
export const useSportsPulse = () => {
  const context = useContext(SportsPulseContext);
  if (!context) {
    throw new Error('useSportsPulse must be used within a SportsPulseProvider');
  }
  return context;
};
