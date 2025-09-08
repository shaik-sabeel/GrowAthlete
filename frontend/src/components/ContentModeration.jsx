import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  FaFlag, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaTrash, 
  FaCog, 
  FaFilter, 
  FaSearch,
  FaExclamationTriangle,
  FaShieldAlt,
  FaBan,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCalendar,
  FaEdit,
  FaHistory,
  FaChartBar,
  FaUsers,

  FaRedo
} from 'react-icons/fa';

const ContentModeration = ({ initialFilterStatus = 'all' }) => {
  const [activeTab, setActiveTab] = useState('community');
  const [posts, setPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [moderationSettings, setModerationSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);

  useEffect(() => {
    fetchModerationSettings();
    fetchContent();
  }, [activeTab, currentPage, filterStatus, searchTerm]);

  const fetchModerationSettings = async () => {
    try {
      const response = await api.get('/moderation/settings');
      setModerationSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch moderation settings:', error);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        status: filterStatus !== 'all' ? filterStatus : '',
        search: searchTerm
      });

      switch (activeTab) {
        case 'community':
          endpoint = '/moderation/community-posts';
          break;
        case 'blog':
          endpoint = '/moderation/blog-posts';
          break;

        default:
          break;
      }

      if (endpoint) {
        const response = await api.get(`${endpoint}?${params}`);
        const data = response.data;
        
        switch (activeTab) {
          case 'community':
            setPosts(data.posts || []);
            break;
          case 'blog':
            setBlogPosts(data.posts || []);
            break;

          default:
            break;
        }
        
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (contentId, action, reason = '', notes = '') => {
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'community':
          endpoint = `/moderation/community-posts/${contentId}/moderate`;
          break;
        case 'blog':
          endpoint = `/moderation/blog-posts/${contentId}/moderate`;
          break;

        default:
          break;
      }

      if (endpoint) {
        await api.patch(endpoint, { action, reason, notes });
        fetchContent();
        setShowContentModal(false);
        setSelectedContent(null);
      }
    } catch (error) {
      console.error('Failed to moderate content:', error);
      alert('Failed to moderate content');
    }
  };

  const updateModerationSettings = async (settings) => {
    try {
      await api.patch('/moderation/settings', settings);
      fetchModerationSettings();
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to update moderation settings:', error);
      alert('Failed to update moderation settings');
    }
  };

  const addBannedKeyword = async (keyword, severity, category) => {
    try {
      await api.post('/moderation/banned-keywords', { keyword, severity, category });
      fetchModerationSettings();
    } catch (error) {
      console.error('Failed to add banned keyword:', error);
      alert('Failed to add banned keyword');
    }
  };

  const removeBannedKeyword = async (keyword) => {
    try {
      await api.delete(`/moderation/banned-keywords/${keyword}`);
      fetchModerationSettings();
    } catch (error) {
      console.error('Failed to remove banned keyword:', error);
      alert('Failed to remove banned keyword');
    }
  };

  const openContentModal = (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock />, text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: <FaTimes />, text: 'Rejected' },
      flagged: { color: 'bg-orange-100 text-orange-800', icon: <FaFlag />, text: 'Flagged' },
      removed: { color: 'bg-gray-100 text-gray-800', icon: <FaTrash />, text: 'Removed' },
      draft: { color: 'bg-blue-100 text-blue-800', icon: <FaEdit />, text: 'Draft' },
      published: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, text: 'Published' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const renderContentTable = () => {
    const content = activeTab === 'community' ? posts : blogPosts;
    
    if (content.length === 0) {
      return (
        <div className="text-center py-8">
          <FaEye className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus !== 'all' ? `No ${filterStatus} content found.` : 'No content available for moderation.'}
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {content.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <FaUser className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {activeTab === 'community' ? item.content.substring(0, 50) + '...' : 
                         activeTab === 'blog' ? item.title : 
                         `${item.fullName} - ${item.sport}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {activeTab === 'community' ? `Tags: ${item.tags?.join(', ') || 'None'}` :
                         activeTab === 'blog' ? `Category: ${item.category}` :
                         `Position: ${item.position}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.author?.username || item.email || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.author?.role || 'User'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openContentModal(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleModeration(item._id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleModeration(item._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {item.status === 'flagged' && (
                      <button
                        onClick={() => handleModeration(item._id, 'removed')}
                        className="text-red-600 hover:text-red-900"
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderModerationSettings = () => {
    if (!moderationSettings) return null;

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Content Moderation Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {/* Auto-moderation settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Automated Moderation</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={moderationSettings.autoModerationEnabled}
                  onChange={(e) => updateModerationSettings({ autoModerationEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Auto-moderation</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={moderationSettings.keywordFilteringEnabled}
                  onChange={(e) => updateModerationSettings({ keywordFilteringEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Keyword Filtering</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={moderationSettings.languageFilteringEnabled}
                  onChange={(e) => updateModerationSettings({ languageFilteringEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Language Filtering</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={moderationSettings.imageModerationEnabled}
                  onChange={(e) => updateModerationSettings({ imageModerationEnabled: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">Image Moderation</span>
              </label>
            </div>
          </div>

          {/* Thresholds */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Moderation Thresholds</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Auto-flag Threshold</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={moderationSettings.autoFlagThreshold}
                  onChange={(e) => updateModerationSettings({ autoFlagThreshold: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Auto-remove Threshold</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={moderationSettings.autoRemoveThreshold}
                  onChange={(e) => updateModerationSettings({ autoRemoveThreshold: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language Score Threshold</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={moderationSettings.languageScoreThreshold}
                  onChange={(e) => updateModerationSettings({ languageScoreThreshold: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Banned Keywords */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Banned Keywords</h4>
            <div className="space-y-2">
              {moderationSettings.bannedKeywords?.map((banned, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-medium text-gray-900">{banned.keyword}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      banned.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      banned.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      banned.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {banned.severity}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{banned.category}</span>
                  </div>
                  <button
                    onClick={() => removeBannedKeyword(banned.keyword)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add new banned keyword */}
            <div className="mt-4 p-4 border border-gray-300 rounded-md">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Add New Banned Keyword</h5>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Keyword"
                  id="newKeyword"
                  className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <select
                  id="newSeverity"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <select
                  id="newCategory"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="profanity">Profanity</option>
                  <option value="hate_speech">Hate Speech</option>
                  <option value="violence">Violence</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                onClick={() => {
                  const keyword = document.getElementById('newKeyword').value;
                  const severity = document.getElementById('newSeverity').value;
                  const category = document.getElementById('newCategory').value;
                  if (keyword) {
                    addBannedKeyword(keyword, severity, category);
                    document.getElementById('newKeyword').value = '';
                  }
                }}
                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
              >
                Add Keyword
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and moderate community posts and blog posts
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaCog className="mr-2 h-4 w-4" />
              Settings
            </button>
            <button
              onClick={fetchContent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaRedo className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'community', label: 'Community Posts', icon: <FaUsers /> },
              { id: 'blog', label: 'Blog Posts', icon: <FaEdit /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
              <option value="removed">Removed</option>
            </select>
          </div>

          {/* Content Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading content...</p>
            </div>
          ) : (
            renderContentTable()
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Content Details</h3>
              <button
                onClick={() => setShowContentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {activeTab === 'community' ? selectedContent.content :
                   activeTab === 'blog' ? selectedContent.title :
                   `${selectedContent.fullName} - ${selectedContent.sport}`}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedContent.author?.username || selectedContent.email || 'Unknown'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  {getStatusBadge(selectedContent.status)}
                </div>
              </div>
              
              {selectedContent.moderationNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Moderation Notes</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedContent.moderationNotes}
                  </div>
                </div>
              )}
              
              {selectedContent.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedContent.rejectionReason}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
              {selectedContent.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleModeration(selectedContent._id, 'approved')}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleModeration(selectedContent._id, 'rejected')}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            {renderModerationSettings()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;
