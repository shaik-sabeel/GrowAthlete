import React, { useEffect, useState } from 'react';
import { 
  FaFireAlt,
  FaBook,
  FaBullhorn,
  FaDatabase,
  FaChartLine,
  FaPlus,
  FaTrash,
  FaSave
} from 'react-icons/fa';
import api from '../utils/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SystemAdministration = () => {
  const [activeTab, setActiveTab] = useState('trending');

  // Trending topics state
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);

  // Guidelines state
  const [guidelines, setGuidelines] = useState([]);
  const [newGuideline, setNewGuideline] = useState({ title: '', content: '', category: 'general' });
  const [isLoadingGuidelines, setIsLoadingGuidelines] = useState(false);

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    audience: 'all',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isSticky: false
  });
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);

  // Backup tools stub state
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useState(null);
  const [ads, setAds] = useState([]);
  const [adImage, setAdImage] = useState(null);
  const [adTitle, setAdTitle] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adActive, setAdActive] = useState(true);
  const [adSort, setAdSort] = useState(0);

  const fetchTrendingTopics = async () => {
    try {
      setIsLoadingTopics(true);
      const res = await api.get('/admin/trending-topics');
      setTrendingTopics(res.data);
    } catch (e) {
      console.error('Failed to fetch trending topics', e);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const fetchGuidelines = async () => {
    try {
      setIsLoadingGuidelines(true);
      const res = await api.get('/admin/community-guidelines');
      setGuidelines(res.data);
    } catch (e) {
      console.error('Failed to fetch guidelines', e);
    } finally {
      setIsLoadingGuidelines(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setIsLoadingAnnouncements(true);
      const res = await api.get('/admin/platform-announcements');
      setAnnouncements(res.data);
    } catch (e) {
      console.error('Failed to fetch announcements', e);
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await api.get('/admin/ads');
      setAds(res.data);
    } catch (e) {
      console.error('Failed to fetch ads', e);
    }
  };

  const uploadAd = async (e) => {
    e.preventDefault();
    if (!adImage) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(adImage.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WEBP)');
      return;
    }
    
    // Validate file size (2MB limit)
    if (adImage.size > 2 * 1024 * 1024) {
      alert('Image file size must be less than 2MB');
      return;
    }
    
    try {
      const fd = new FormData();
      fd.append('image', adImage);
      fd.append('title', adTitle);
      fd.append('linkUrl', adLink);
      fd.append('active', String(adActive));
      fd.append('sortOrder', String(adSort));
      
      console.log('Uploading ad with data:', {
        image: adImage.name,
        title: adTitle,
        linkUrl: adLink,
        active: adActive,
        sortOrder: adSort
      });
      
      await api.post('/admin/ads', fd, { 
        headers: { 
          'Content-Type': 'multipart/form-data' 
        } 
      });
      
      // Reset form
      setAdImage(null); 
      setAdTitle(''); 
      setAdLink(''); 
      setAdActive(true); 
      setAdSort(0);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][name="image"]');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh ads list
      await fetchAds();
      alert('Advertisement uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload ad:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload advertisement';
      alert(`Error: ${errorMessage}`);
    }
  };

  const toggleAdActive = async (id, next) => {
    try {
      await api.patch(`/admin/ads/${id}`, { active: next });
      fetchAds();
    } catch {}
  };

  const deleteAd = async (id) => {
    if (!confirm('Delete this ad?')) return;
    try {
      await api.delete(`/admin/ads/${id}`);
      fetchAds();
    } catch {}
  };

  // API monitoring stub state
  const apiStats = {
    requestsLastHour: 1243,
    avgLatencyMs: 182,
    errorRatePct: 0.7,
    topEndpoints: [
      { path: '/api/events', rpm: 210 },
      { path: '/api/news', rpm: 165 },
      { path: '/api/community', rpm: 142 }
    ]
  };

  const addTopic = async () => {
    const trimmed = newTopic.trim();
    if (!trimmed) return;
    
    try {
      const res = await api.post('/admin/trending-topics', {
        topic: trimmed,
        posts: 0,
        sortOrder: trendingTopics.length
      });
      
      setTrendingTopics(prev => [res.data.topic, ...prev]);
      setNewTopic('');
    } catch (e) {
      console.error('Failed to add trending topic', e);
      alert('Failed to add trending topic');
    }
  };

  const removeTopic = async (id) => {
    if (!confirm('Are you sure you want to remove this trending topic?')) return;
    
    try {
      await api.delete(`/admin/trending-topics/${id}`);
      setTrendingTopics(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      console.error('Failed to remove trending topic', e);
      alert('Failed to remove trending topic');
    }
  };

  const updateTopicPosts = async (id, newPosts) => {
    try {
      await api.patch(`/admin/trending-topics/${id}`, { posts: newPosts });
      setTrendingTopics(prev => 
        prev.map(t => t._id === id ? { ...t, posts: newPosts } : t)
      );
    } catch (e) {
      console.error('Failed to update topic posts', e);
      alert('Failed to update topic posts');
    }
  };

  // Guidelines functions
  const addGuideline = async () => {
    if (!newGuideline.title.trim() || !newGuideline.content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      const res = await api.post('/admin/community-guidelines', newGuideline);
      setGuidelines(prev => [res.data.guideline, ...prev]);
      setNewGuideline({ title: '', content: '', category: 'general' });
      alert('Guideline added successfully');
    } catch (e) {
      console.error('Failed to add guideline', e);
      alert('Failed to add guideline');
    }
  };

  const updateGuideline = async (id, updates) => {
    try {
      await api.patch(`/admin/community-guidelines/${id}`, updates);
      setGuidelines(prev => 
        prev.map(g => g._id === id ? { ...g, ...updates } : g)
      );
    } catch (e) {
      console.error('Failed to update guideline', e);
      alert('Failed to update guideline');
    }
  };

  const deleteGuideline = async (id) => {
    if (!confirm('Are you sure you want to delete this guideline?')) return;
    
    try {
      await api.delete(`/admin/community-guidelines/${id}`);
      setGuidelines(prev => prev.filter(g => g._id !== id));
      alert('Guideline deleted successfully');
    } catch (e) {
      console.error('Failed to delete guideline', e);
      alert('Failed to delete guideline');
    }
  };

  // Announcements functions
  const addAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      alert('Title and message are required');
      return;
    }

    try {
      const res = await api.post('/admin/platform-announcements', newAnnouncement);
      setAnnouncements(prev => [res.data.announcement, ...prev]);
      setNewAnnouncement({
        title: '',
        message: '',
        audience: 'all',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isSticky: false
      });
      alert('Announcement added successfully');
    } catch (e) {
      console.error('Failed to add announcement', e);
      alert('Failed to add announcement');
    }
  };

  const updateAnnouncement = async (id, updates) => {
    try {
      await api.patch(`/admin/platform-announcements/${id}`, updates);
      setAnnouncements(prev => 
        prev.map(a => a._id === id ? { ...a, ...updates } : a)
      );
    } catch (e) {
      console.error('Failed to update announcement', e);
      alert('Failed to update announcement');
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await api.delete(`/admin/platform-announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      alert('Announcement deleted successfully');
    } catch (e) {
      console.error('Failed to delete announcement', e);
      alert('Failed to delete announcement');
    }
  };

  // Remove old stub functions - they're replaced by real implementations above

  const runBackup = async () => {
    setIsBackupRunning(true);
    setTimeout(() => {
      setIsBackupRunning(false);
      setLastBackupAt(new Date().toLocaleString());
      alert('Backup completed (stub).');
    }, 1500);
  };

  const renderAds = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Advertisement Banners</h3>
      <form onSubmit={uploadAd} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Advertisement Image *</label>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={(e) => setAdImage(e.target.files?.[0] || null)} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
          {adImage && (
            <div className="mt-2 text-sm text-green-600">
              ✓ Selected: {adImage.name} ({(adImage.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input 
            type="text" 
            placeholder="Advertisement title" 
            value={adTitle} 
            onChange={(e) => setAdTitle(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
          <input 
            type="url" 
            placeholder="https://example.com" 
            value={adLink} 
            onChange={(e) => setAdLink(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="adActive" 
              checked={adActive} 
              onChange={(e) => setAdActive(e.target.checked)} 
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="adActive" className="text-sm text-gray-700">Active</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input 
              type="number" 
              placeholder="0" 
              value={adSort} 
              onChange={(e) => setAdSort(Number(e.target.value) || 0)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
        </div>
        <div className="md:col-span-5 flex justify-end">
          <button 
            type="submit" 
            disabled={!adImage}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Upload Advertisement
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-2 text-sm text-gray-600">Drag rows to reorder. Order is saved automatically.</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <DragDropContext
              onDragEnd={async (result) => {
                if (!result.destination) return;
                const reordered = Array.from(ads);
                const [removed] = reordered.splice(result.source.index, 1);
                reordered.splice(result.destination.index, 0, removed);
                // Update local order
                setAds(reordered);
                // Persist sortOrder sequentially
                for (let i = 0; i < reordered.length; i++) {
                  const ad = reordered[i];
                  try { await api.patch(`/admin/ads/${ad._id}`, { sortOrder: i }); } catch {}
                }
              }}
            >
              <Droppable droppableId="adsTable">
                {(provided) => (
                  <tbody ref={provided.innerRef} {...provided.droppableProps} className="bg-white divide-y divide-gray-200">
                    {ads.map((a, idx) => (
                      <Draggable key={a._id} draggableId={a._id} index={idx}>
                        {(drag) => (
                          <tr ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                            <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                            <td className="px-6 py-4"><img src={`${import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com'}${a.image}`} alt={a.title || 'ad'} className="h-12 w-auto rounded"/></td>
                            <td className="px-6 py-4 text-sm text-gray-900">{a.title}</td>
                            <td className="px-6 py-4 text-sm text-blue-600">{a.linkUrl}</td>
                            <td className="px-6 py-4 text-sm">
                              <label className="inline-flex items-center gap-2">
                                <input type="checkbox" checked={a.active} onChange={(e) => toggleAdActive(a._id, e.target.checked)} />
                                <span>{a.active ? 'Active' : 'Inactive'}</span>
                              </label>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                              <button onClick={() => deleteAd(a._id)} className="text-red-600 hover:text-red-800 inline-flex items-center"><FaTrash className="mr-1"/>Delete</button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
        </div>
      </div>
      <div className="text-sm text-gray-500">Active ads appear on the community page carousel.</div>
    </div>
  );

  useEffect(() => {
    if (activeTab === 'ads') {
      fetchAds();
    }
    if (activeTab === 'trending') {
      fetchTrendingTopics();
    }
    if (activeTab === 'guidelines') {
      fetchGuidelines();
    }
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch trending topics on component mount
    fetchTrendingTopics();
  }, []);

  const renderTrending = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaFireAlt className="mr-2"/>Trending Topics</h3>
        <div className="flex">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Add new topic"
            className="px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button 
            onClick={addTopic} 
            disabled={isLoadingTopics}
            className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-gray-400 flex items-center"
          >
            <FaPlus className="mr-1"/>{isLoadingTopics ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
      
      {isLoadingTopics ? (
        <div className="text-center py-8 text-gray-500">Loading trending topics...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trendingTopics.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No trending topics yet. Add one above!
                  </td>
                </tr>
              ) : (
                trendingTopics.map(t => (
                  <tr key={t._id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{t.topic}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <input
                        type="number"
                        value={t.posts}
                        onChange={(e) => updateTopicPosts(t._id, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button onClick={() => removeTopic(t._id)} className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800">
                        <FaTrash className="mr-1"/>Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderGuidelines = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaBook className="mr-2"/>Community Guidelines</h3>
      
      {/* Add new guideline form */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h4 className="font-medium text-gray-900 mb-3">Add New Guideline</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            placeholder="Title"
            value={newGuideline.title}
            onChange={(e) => setNewGuideline(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={newGuideline.category}
            onChange={(e) => setNewGuideline(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="general">General</option>
            <option value="posting">Posting</option>
            <option value="interaction">Interaction</option>
            <option value="safety">Safety</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={addGuideline}
            disabled={isLoadingGuidelines}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isLoadingGuidelines ? 'Adding...' : 'Add Guideline'}
          </button>
        </div>
        <textarea
          rows={3}
          placeholder="Guideline content..."
          value={newGuideline.content}
          onChange={(e) => setNewGuideline(prev => ({ ...prev, content: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Guidelines list */}
      {isLoadingGuidelines ? (
        <div className="text-center py-8 text-gray-500">Loading guidelines...</div>
      ) : (
        <div className="space-y-3">
          {guidelines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No guidelines yet. Add one above!</div>
          ) : (
            guidelines.map(guideline => (
              <div key={guideline._id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {guideline.category}
                    </span>
                    <h5 className="font-medium text-gray-900">{guideline.title}</h5>
                  </div>
                  <button
                    onClick={() => deleteGuideline(guideline._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-gray-700 text-sm">{guideline.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaBullhorn className="mr-2"/>Platform Announcements</h3>
      
      {/* Add new announcement form */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h4 className="font-medium text-gray-900 mb-3">Create New Announcement</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="Announcement title"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={newAnnouncement.audience}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, audience: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Users</option>
            <option value="athletes">Athletes</option>
            <option value="coaches">Coaches</option>
            <option value="scouts">Scouts</option>
            <option value="sponsors">Sponsors</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <select
            value={newAnnouncement.priority}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            type="date"
            value={newAnnouncement.startDate}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, startDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="date"
            placeholder="End date (optional)"
            value={newAnnouncement.endDate}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, endDate: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newAnnouncement.isSticky}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, isSticky: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Sticky</span>
          </label>
        </div>
        <textarea
          rows={4}
          placeholder="Announcement message..."
          value={newAnnouncement.message}
          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mb-3"
        />
        <button
          onClick={addAnnouncement}
          disabled={isLoadingAnnouncements}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isLoadingAnnouncements ? 'Creating...' : 'Create Announcement'}
        </button>
      </div>

      {/* Announcements list */}
      {isLoadingAnnouncements ? (
        <div className="text-center py-8 text-gray-500">Loading announcements...</div>
      ) : (
        <div className="space-y-3">
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No announcements yet. Create one above!</div>
          ) : (
            announcements.map(announcement => (
              <div key={announcement._id} className={`bg-white p-4 rounded-lg shadow border ${announcement.isSticky ? 'border-l-4 border-l-yellow-400' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      announcement.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                      announcement.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {announcement.priority}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                      {announcement.audience}
                    </span>
                    {announcement.isSticky && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                        Sticky
                      </span>
                    )}
                    <h5 className="font-medium text-gray-900">{announcement.title}</h5>
                  </div>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-2">{announcement.message}</p>
                <div className="text-xs text-gray-500">
                  Start: {new Date(announcement.startDate).toLocaleDateString()}
                  {announcement.endDate && ` • End: ${new Date(announcement.endDate).toLocaleDateString()}`}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaDatabase className="mr-2"/>Backup & Maintenance</h3>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last backup</p>
            <p className="text-gray-900 font-medium">{lastBackupAt || 'Never'}</p>
          </div>
          <button
            onClick={runBackup}
            disabled={isBackupRunning}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white ${isBackupRunning ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isBackupRunning ? 'Running…' : 'Run Backup'}
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-500">Note: This is a stub. Wire to your real backup endpoints when ready.</div>
    </div>
  );

  const renderApiMonitoring = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaChartLine className="mr-2"/>API Usage Monitoring</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Requests (last hour)</div>
          <div className="text-2xl font-bold text-gray-900">{apiStats.requestsLastHour.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Avg Latency</div>
          <div className="text-2xl font-bold text-gray-900">{apiStats.avgLatencyMs} ms</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Error Rate</div>
          <div className="text-2xl font-bold text-gray-900">{apiStats.errorRatePct}%</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests/min</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {apiStats.topEndpoints.map((e) => (
              <tr key={e.path}>
                <td className="px-6 py-4 text-sm text-gray-900">{e.path}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{e.rpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'trending', label: 'Trending Topics', icon: <FaFireAlt/> },
              { id: 'guidelines', label: 'Guidelines & Rules', icon: <FaBook/> },
              { id: 'announcements', label: 'Announcements', icon: <FaBullhorn/> },
              { id: 'backup', label: 'Backup Tools', icon: <FaDatabase/> },
              { id: 'api', label: 'API Monitoring', icon: <FaChartLine/> },
              { id: 'ads', label: 'Advertisements', icon: <FaBullhorn/> }
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
          {activeTab === 'trending' && renderTrending()}
          {activeTab === 'guidelines' && renderGuidelines()}
          {activeTab === 'announcements' && renderAnnouncements()}
          {activeTab === 'backup' && renderBackup()}
          {activeTab === 'api' && renderApiMonitoring()}
          {activeTab === 'ads' && renderAds()}
        </div>
      </div>
    </div>
  );
};

export default SystemAdministration;


