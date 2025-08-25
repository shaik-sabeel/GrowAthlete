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

  // Trending topics stub state
  const [trendingTopics, setTrendingTopics] = useState([
    { id: 1, topic: 'Nationals 2025', posts: 128 },
    { id: 2, topic: 'Transfer Window', posts: 93 }
  ]);
  const [newTopic, setNewTopic] = useState('');

  // Guidelines stub state
  const [guidelines, setGuidelines] = useState(
    `Welcome to the GrowAthlete community.\n\nBe respectful. No spam. Stay on-topic. Report abuse via the flag icon.\nModerators reserve the right to remove content that violates these rules.`
  );

  // Announcements stub state
  const [announcement, setAnnouncement] = useState('');
  const [announceAudience, setAnnounceAudience] = useState('all');

  // Backup tools stub state
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [lastBackupAt, setLastBackupAt] = useState(null);
  const [ads, setAds] = useState([]);
  const [adImage, setAdImage] = useState(null);
  const [adTitle, setAdTitle] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adActive, setAdActive] = useState(true);
  const [adSort, setAdSort] = useState(0);

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
      alert('Select an image');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('image', adImage);
      fd.append('title', adTitle);
      fd.append('linkUrl', adLink);
      fd.append('active', String(adActive));
      fd.append('sortOrder', String(adSort));
      await api.post('/admin/ads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAdImage(null); setAdTitle(''); setAdLink(''); setAdActive(true); setAdSort(0);
      await fetchAds();
      alert('Ad uploaded');
    } catch (e) {
      console.error('Failed to upload ad', e);
      alert('Failed to upload ad');
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

  const addTopic = () => {
    const trimmed = newTopic.trim();
    if (!trimmed) return;
    setTrendingTopics(prev => [
      { id: Date.now(), topic: trimmed, posts: 0 },
      ...prev
    ]);
    setNewTopic('');
  };

  const removeTopic = (id) => {
    setTrendingTopics(prev => prev.filter(t => t.id !== id));
  };

  const saveGuidelines = () => {
    alert('Guidelines saved (stub).');
  };

  const sendAnnouncement = () => {
    if (!announcement.trim()) {
      alert('Please enter an announcement message.');
      return;
    }
    alert(`Announcement sent to ${announceAudience} (stub).`);
    setAnnouncement('');
  };

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
        <input type="file" accept="image/*" onChange={(e) => setAdImage(e.target.files?.[0] || null)} className="md:col-span-2" />
        <input type="text" placeholder="Title (optional)" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="url" placeholder="Link URL (optional)" value={adLink} onChange={(e) => setAdLink(e.target.value)} className="px-3 py-2 border rounded" />
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Active</label>
          <input type="checkbox" checked={adActive} onChange={(e) => setAdActive(e.target.checked)} />
        </div>
        <input type="number" placeholder="Sort" value={adSort} onChange={(e) => setAdSort(Number(e.target.value) || 0)} className="px-3 py-2 border rounded" />
        <div className="md:col-span-5 flex justify-end">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Upload</button>
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
                            <td className="px-6 py-4"><img src={`http://localhost:5000${a.image}`} alt={a.title || 'ad'} className="h-12 w-auto rounded"/></td>
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
  }, [activeTab]);

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
          <button onClick={addTopic} className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 flex items-center">
            <FaPlus className="mr-1"/>Add
          </button>
        </div>
      </div>
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
            {trendingTopics.map(t => (
              <tr key={t.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{t.topic}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.posts}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button onClick={() => removeTopic(t.id)} className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800">
                    <FaTrash className="mr-1"/>Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGuidelines = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaBook className="mr-2"/>Community Guidelines</h3>
      <textarea
        rows={12}
        value={guidelines}
        onChange={(e) => setGuidelines(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
      <div className="flex justify-end">
        <button onClick={saveGuidelines} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <FaSave className="mr-2"/>Save Guidelines
        </button>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><FaBullhorn className="mr-2"/>Platform Announcements</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <textarea
            rows={6}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Write an announcement to broadcast"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-gray-700">Audience</label>
          <select
            value={announceAudience}
            onChange={(e) => setAnnounceAudience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Users</option>
            <option value="athletes">Athletes</option>
            <option value="coaches">Coaches</option>
            <option value="scouts">Scouts</option>
            <option value="sponsors">Sponsors</option>
          </select>
          <button onClick={sendAnnouncement} className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <FaBullhorn className="mr-2"/>Send
          </button>
        </div>
      </div>
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


