import React, { useState, useEffect } from 'react';
import { getNews, testNewsAPI } from '../utils/sportsAPI';

const NewsAPIStatus = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastTest, setLastTest] = useState(null);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    setApiStatus('testing');
    try {
      const results = await testNewsAPI();
      setTestResults(results);
      setApiStatus('working');
      setLastTest(new Date().toLocaleTimeString());
    } catch (error) {
      setApiStatus('error');
      setTestResults({ error: error.message });
      setLastTest(new Date().toLocaleTimeString());
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'working': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'working': return '✅ API Working';
      case 'error': return '❌ API Error';
      case 'testing': return '🔄 Testing...';
      default: return '❓ Unknown';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">News API Status</h3>
        <button 
          onClick={testAPI}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test
        </button>
      </div>
      
      <div className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>
      
      {lastTest && (
        <div className="text-xs text-gray-500 mt-1">
          Last tested: {lastTest}
        </div>
      )}
      
      {testResults && (
        <div className="mt-2 text-xs">
          {testResults.error ? (
            <div className="text-red-600">
              Error: {testResults.error}
            </div>
          ) : (
            <div className="text-green-600">
              Articles: {testResults.length}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default NewsAPIStatus;
