import React, { useEffect, useMemo, useState } from 'react';
import { FaBan, FaCheck, FaTrash, FaWrench, FaPalette, FaShieldAlt, FaSearch, FaCloudUploadAlt, FaUsers } from 'react-icons/fa';
import api from '../utils/api';

const defaultSettings = {
  autoModerationEnabled: false,
  keywordFilteringEnabled: false,
  languageFilteringEnabled: false,
  imageModerationEnabled: false,
  autoFlagThreshold: 0.8,
  autoRemoveThreshold: 0.95,
  reviewQueueThreshold: 0.7,
  bannedKeywords: []
};

const AdminSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newKeywordSeverity, setNewKeywordSeverity] = useState('high');
  const [newKeywordCategory, setNewKeywordCategory] = useState('general');
  const [platform, setPlatform] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/moderation/settings');
      setSettings({ ...defaultSettings, ...(res.data || {}) });
      const plat = await api.get('/admin/platform-settings');
      setPlatform(plat.data || {});
    } catch (e) {
      console.error('Failed to load moderation settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (partial) => {
    setSaving(true);
    try {
      const next = { ...settings, ...partial };
      setSettings(next);
      await api.patch('/moderation/settings', partial);
    } catch (e) {
      console.error('Failed to update settings', e);
      // Optimistic update rollback if needed
      await fetchSettings();
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const canSave = useMemo(() => !saving && !loading, [saving, loading]);

  const updatePlatform = async (partial) => {
    if (!platform) return;
    setSaving(true);
    try {
      const next = { ...platform, ...partial };
      setPlatform(next);
      await api.patch('/admin/platform-settings', partial);
    } catch (e) {
      console.error('Failed to update platform settings', e);
      await fetchSettings();
      alert('Failed to update platform settings');
    } finally {
      setSaving(false);
    }
  };

  const addBannedKeyword = async () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    try {
      await api.post('/moderation/banned-keywords', {
        keyword: trimmed,
        severity: newKeywordSeverity,
        category: newKeywordCategory
      });
      setNewKeyword('');
      await fetchSettings();
    } catch (e) {
      console.error('Failed to add keyword', e);
      alert('Failed to add keyword');
    }
  };

  const removeBannedKeyword = async (keyword) => {
    try {
      await api.delete(`/moderation/banned-keywords/${encodeURIComponent(keyword)}`);
      await fetchSettings();
    } catch (e) {
      console.error('Failed to remove keyword', e);
      alert('Failed to remove keyword');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">Loading settings…</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Maintenance & Availability */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaWrench /> Maintenance & Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 md:col-span-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={Boolean(platform?.maintenanceMode)}
              onChange={(e) => updatePlatform({ maintenanceMode: e.target.checked })}
              disabled={!canSave}
            />
            <span className="text-sm text-gray-800">Enable maintenance mode</span>
          </label>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance message</label>
            <input
              type="text"
              value={platform?.maintenanceMessage || ''}
              onChange={(e) => setPlatform(prev => ({ ...prev, maintenanceMessage: e.target.value }))}
              onBlur={() => updatePlatform({ maintenanceMessage: platform?.maintenanceMessage || '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!canSave}
            />
          </div>
        </div>
      </div>

      {/* Registration Rules */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaUsers /> Registration Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" checked={Boolean(platform?.registration?.allowRegistration)} onChange={(e) => updatePlatform({ registration: { ...(platform?.registration || {}), allowRegistration: e.target.checked } })} />
            <span className="text-sm">Allow new registrations</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" checked={Boolean(platform?.registration?.inviteOnly)} onChange={(e) => updatePlatform({ registration: { ...(platform?.registration || {}), inviteOnly: e.target.checked } })} />
            <span className="text-sm">Invite-only mode</span>
          </label>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed email domains (comma-separated)</label>
            <input type="text" value={(platform?.registration?.allowedEmailDomains || []).join(', ')} onChange={(e) => setPlatform(prev => ({ ...prev, registration: { ...(prev?.registration || {}), allowedEmailDomains: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))} onBlur={() => updatePlatform({ registration: platform?.registration })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ key: 'enableCommunity', label: 'Community' }, { key: 'enableEvents', label: 'Events' }, { key: 'enableBlogs', label: 'Blogs' }].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" checked={Boolean(platform?.features?.[key])} onChange={(e) => updatePlatform({ features: { ...(platform?.features || {}), [key]: e.target.checked } })} />
              <span className="text-sm">Enable {label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Upload Constraints */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaCloudUploadAlt /> Upload Constraints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max image size (MB)</label>
            <input type="number" min={1} max={20} value={platform?.uploads?.maxImageSizeMB ?? 2} onChange={(e) => setPlatform(prev => ({ ...prev, uploads: { ...(prev?.uploads || {}), maxImageSizeMB: Math.max(1, Math.min(20, parseInt(e.target.value) || 2)) } }))} onBlur={() => updatePlatform({ uploads: platform?.uploads })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed image MIME types (comma-separated)</label>
            <input type="text" value={(platform?.uploads?.allowedImageTypes || []).join(', ')} onChange={(e) => setPlatform(prev => ({ ...prev, uploads: { ...(prev?.uploads || {}), allowedImageTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))} onBlur={() => updatePlatform({ uploads: platform?.uploads })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaPalette /> Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default theme</label>
            <select value={platform?.appearance?.defaultTheme || 'system'} onChange={(e) => updatePlatform({ appearance: { ...(platform?.appearance || {}), defaultTheme: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent color</label>
            <input type="color" value={platform?.appearance?.accentColor || '#4f46e5'} onChange={(e) => updatePlatform({ appearance: { ...(platform?.appearance || {}), accentColor: e.target.value } })} className="h-10 w-16 p-0 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaShieldAlt /> Security</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4" checked={Boolean(platform?.security?.requireAdmin2FA)} onChange={(e) => updatePlatform({ security: { ...(platform?.security || {}), requireAdmin2FA: e.target.checked } })} />
          <span className="text-sm">Require 2FA for admin accounts</span>
        </label>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaSearch /> SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site title</label>
            <input type="text" value={platform?.seo?.siteTitle || ''} onChange={(e) => setPlatform(prev => ({ ...prev, seo: { ...(prev?.seo || {}), siteTitle: e.target.value } }))} onBlur={() => updatePlatform({ seo: platform?.seo })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site description</label>
            <input type="text" value={platform?.seo?.siteDescription || ''} onChange={(e) => setPlatform(prev => ({ ...prev, seo: { ...(prev?.seo || {}), siteDescription: e.target.value } }))} onBlur={() => updatePlatform({ seo: platform?.seo })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Toggles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{
            key: 'autoModerationEnabled', label: 'Enable Auto-moderation'
          }, {
            key: 'keywordFilteringEnabled', label: 'Keyword Filtering'
          }, {
            key: 'languageFilteringEnabled', label: 'Language Filtering'
          }, {
            key: 'imageModerationEnabled', label: 'Image Moderation'
          }].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={Boolean(settings[key])}
                onChange={(e) => updateSettings({ [key]: e.target.checked })}
                disabled={!canSave}
              />
              <span className="text-sm text-gray-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{
            key: 'autoFlagThreshold', label: 'Auto-flag Threshold'
          }, {
            key: 'autoRemoveThreshold', label: 'Auto-remove Threshold'
          }, {
            key: 'reviewQueueThreshold', label: 'Review Queue Threshold'
          }].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={settings[key] ?? 0}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(1, parseFloat(e.target.value) || 0));
                  setSettings(prev => ({ ...prev, [key]: val }));
                }}
                onBlur={() => updateSettings({ [key]: settings[key] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!canSave}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Banned Keywords</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <input
            type="text"
            placeholder="Add keyword…"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={newKeywordSeverity}
            onChange={(e) => setNewKeywordSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={newKeywordCategory}
            onChange={(e) => setNewKeywordCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="general">General</option>
            <option value="harassment">Harassment</option>
            <option value="hate">Hate</option>
            <option value="nsfw">NSFW</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={addBannedKeyword}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <FaBan className="w-4 h-4" /> Add keyword
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(settings.bannedKeywords) && settings.bannedKeywords.length > 0 ? (
                settings.bannedKeywords.map((k) => (
                  <tr key={k.keyword}>
                    <td className="px-6 py-3 text-sm text-gray-900">{k.keyword}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{k.severity}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{k.category}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => removeBannedKeyword(k.keyword)}
                        className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-6 text-center text-sm text-gray-500" colSpan={4}>No banned keywords yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md inline-flex items-center gap-2"
          title="All changes save immediately"
        >
          <FaCheck className="w-4 h-4" /> Saved automatically
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;


