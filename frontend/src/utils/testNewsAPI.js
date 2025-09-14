// Test utility for news API
import { API_CONFIG } from './apiConfig.js';

export const testNewsAPI = async () => {
  const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY || API_CONFIG.NEWSDATA.API_KEY;
  const BASE_URL = API_CONFIG.NEWSDATA.BASE_URL;
  
  console.log('🔍 Testing News API Configuration:');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  console.log('Base URL:', BASE_URL);
  
  if (!API_KEY) {
    console.error('❌ No API key found!');
    return { success: false, error: 'No API key' };
  }
  
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append('apikey', API_KEY);
    url.searchParams.append('country', 'in');
    url.searchParams.append('category', 'sports');
    url.searchParams.append('language', 'en');
    url.searchParams.append('q', 'cricket');
    
    console.log('🌐 Making API request to:', url.toString());
    
    const response = await fetch(url.toString());
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    console.log('📊 Number of articles:', data.results?.length || 0);
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Network Error:', error);
    return { success: false, error: error.message };
  }
};

// Test function to be called from browser console
window.testNewsAPI = testNewsAPI;
