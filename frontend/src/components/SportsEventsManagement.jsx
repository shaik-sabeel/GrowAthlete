import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaChartBar,
  FaUsers,
  FaCalendar,
  FaTrophy,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCog,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaTag,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBan,
  FaEyeSlash,
  FaShare,
  FaRegCalendarAlt,
  FaRegClock,
  FaRegUser,
  FaRegEdit,
  FaRegTrashAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaRegEye,
  FaRegEyeSlash
} from 'react-icons/fa';

const SportsEventsManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPastEvents, setShowPastEvents] = useState(true);

  // Sports Categories State
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    icon: '🏃',
    rules: [],
    equipment: [],
    skills: [],
    featured: false,
    sortOrder: 0
  });

  // Events State
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAnalytics, setEventAnalytics] = useState(null);
  const [overviewStats, setOverviewStats] = useState(null);

  // Tournaments Registrations State
  const [tournamentRegistrations, setTournamentRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [createEventForm, setCreateEventForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    date: '',
    time: '',
    location: '',
    sport: 'cricket',
    category: 'webinar',
    maxParticipants: '',
    price: '',
    currency: 'USD',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    tags: [],
    highlights: [],
    requirements: [],
    isOpen: true
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Pagination
  const itemsPerPage = 10;

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'events') {
      const updateAndFetchEvents = async () => {
        try {
          await api.post('/admin/events/update-statuses');
        } catch (error) {
          console.error('Failed to auto-update event statuses:', error);
        }
        fetchEvents();
      };
      updateAndFetchEvents();
    } else if (activeTab === 'analytics') {
      fetchOverviewStats();
    } else if (activeTab === 'tournaments') {
      fetchTournamentRegistrations();
    }
  }, [activeTab, currentPage, filterStatus, filterSport, filterCategory, searchTerm, showPastEvents]);

  // Set default organizer info when component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.username && user.email) {
      setCreateEventForm(prev => ({
        ...prev,
        organizerName: user.username,
        organizerEmail: user.email
      }));
    }
  }, []);

  // ===== SPORTS CATEGORIES =====

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sports-categories');
      setCategories(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.patch(`/admin/sports-categories/${editingCategory._id}`, categoryForm);
      } else {
        await api.post('/admin/sports-categories', categoryForm);
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        shortDescription: '',
        icon: '🏃',
        rules: [],
        equipment: [],
        skills: [],
        featured: false,
        sortOrder: 0
      });
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      shortDescription: category.shortDescription || '',
      icon: category.icon || '🏃',
      rules: category.rules || [],
      equipment: category.equipment || [],
      skills: category.skills || [],
      featured: category.featured || false,
      sortOrder: category.sortOrder || 0
    });
    setShowCategoryModal(true);
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/admin/sports-categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  // ===== EVENTS =====

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addArrayItem = (field, value) => {
    if (value.trim()) {
      setCreateEventForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setCreateEventForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetCreateEventForm = () => {
    setCreateEventForm({
      title: '',
      description: '',
      shortDescription: '',
      date: '',
      time: '',
      location: '',
      sport: 'cricket',
      category: 'webinar',
      maxParticipants: '',
      price: '',
      currency: 'USD',
      organizerName: '',
      organizerEmail: '',
      organizerPhone: '',
      tags: [],
      highlights: [],
      requirements: [],
      isOpen: true
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an event image');
      return;
    }
    const selectedDateTime = new Date(`${createEventForm.date}T${createEventForm.time}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      alert('Event date and time must be in the future');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(createEventForm).forEach(key => {
        if (key === 'tags' || key === 'highlights' || key === 'requirements') {
          formData.append(key, JSON.stringify(createEventForm[key]));
        } else {
          formData.append(key, createEventForm[key]);
        }
      });
      formData.append('image', selectedImage);

      await api.post('/admin/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetCreateEventForm();
      setShowCreateEventModal(false);
      fetchEvents();
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus === 'all' ? 'all' : filterStatus,
        sport: filterSport === 'all' ? 'all' : filterSport,
        category: filterCategory === 'all' ? 'all' : filterCategory,
        search: searchTerm,
        showPastEvents: showPastEvents.toString()
      });

      const response = await api.get(`/admin/events?${params}`);
      setEvents(response.data.events || []);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const approveEvent = async (eventId, status) => {
    try {
      const notes = prompt(`Enter ${status === 'approved' ? 'approval' : 'rejection'} notes:`);
      if (notes === null) return;
      await api.patch(`/admin/events/${eventId}/approve`, { status, notes });
      fetchEvents();
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event');
    }
  };

  const handleUpdateEventStatuses = async () => {
    try {
      setLoading(true);
      const response = await api.post('/admin/events/update-statuses');
      alert(response.data.message);
      fetchEvents();
    } catch (error) {
      console.error('Failed to update event statuses:', error);
      alert('Failed to update event statuses: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const viewEventAnalytics = async (eventId) => {
    try {
      const response = await api.get(`/admin/events/${eventId}/analytics`);
      setEventAnalytics(response.data);
      setSelectedEvent(events.find(e => e._id === eventId));
    } catch (error) {
      console.error('Failed to fetch event analytics:', error);
    }
  };

  // ===== ANALYTICS =====

  const fetchOverviewStats = async () => {
    try {
      const response = await api.get('/admin/events/stats/overview');
      setOverviewStats(response.data);
    } catch (error) {
      console.error('Failed to fetch overview stats:', error);
    }
  };

  // ===== TOURNAMENTS =====

  const fetchTournamentRegistrations = async () => {
    try {
      setLoadingRegistrations(true);
      const response = await api.get('/tournaments/registrations/all');
      setTournamentRegistrations(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tournament registrations:', error);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleUpdateRegistrationStatus = async (tournamentId, registrationId, status) => {
    try {
      setLoading(true);
      await api.patch(`/tournaments/${tournamentId}/registrations/${registrationId}/status`, { status });
      alert(`Registration ${status} successfully!`);
      fetchTournamentRegistrations();
    } catch (error) {
      console.error(`Failed to update registration status:`, error);
      alert('Failed to update registration status');
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER FUNCTIONS =====

  const renderCategoriesTable = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = categories.slice(startIndex, endIndex);

    if (categories.length === 0) {
      return (
        <div className="text-center py-8">
          <FaTrophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sports categories</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first sports category.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.shortDescription}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{category.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.eventCount || 0} events</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => editCategory(category)} className="text-indigo-600 hover:text-indigo-900"><FaEdit /></button>
                    <button onClick={() => deleteCategory(category._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEventsTable = () => {
    if (!events || events.length === 0) {
      return (
        <div className="text-center py-8">
          <FaCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport & Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-lg object-cover" src={`${import.meta.env.VITE_API_BASE_URL || 'https://growathlete-1.onrender.com'}${event.image}`} alt={event.title} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.shortDescription}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.organizerName}</div>
                  <div className="text-sm text-gray-500">{event.organizerEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{event.sport}</div>
                  <div className="text-sm text-gray-500">{event.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'approved' ? 'bg-green-100 text-green-800' : event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => viewEventAnalytics(event._id)} className="text-indigo-600 hover:text-indigo-900"><FaChartBar /></button>
                    {event.status === 'pending' && (
                      <>
                        <button onClick={() => approveEvent(event._id, 'approved')} className="text-green-600 hover:text-green-900"><FaCheck /></button>
                        <button onClick={() => approveEvent(event._id, 'rejected')} className="text-red-600 hover:text-red-900"><FaTimes /></button>
                      </>
                    )}
                    <button onClick={() => deleteEvent(event._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!overviewStats) return <div className="text-center py-8">Loading analytics...</div>;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 shadow rounded-lg flex items-center">
            <FaCalendar className="h-6 w-6 text-gray-400 mr-5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Events</div>
              <div className="text-lg font-medium text-gray-900">{overviewStats.totalEvents}</div>
            </div>
          </div>
          <div className="bg-white p-5 shadow rounded-lg flex items-center">
            <FaClock className="h-6 w-6 text-yellow-400 mr-5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Pending Approval</div>
              <div className="text-lg font-medium text-gray-900">{overviewStats.pendingEvents}</div>
            </div>
          </div>
          <div className="bg-white p-5 shadow rounded-lg flex items-center">
            <FaCheckCircle className="h-6 w-6 text-green-400 mr-5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Published</div>
              <div className="text-lg font-medium text-gray-900">{overviewStats.publishedEvents}</div>
            </div>
          </div>
          <div className="bg-white p-5 shadow rounded-lg flex items-center">
            <FaUsers className="h-6 w-6 text-blue-400 mr-5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Total Registrations</div>
              <div className="text-lg font-medium text-gray-900">{overviewStats.totalRegistrations}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTournamentsTable = () => {
    if (loadingRegistrations) return <div className="text-center py-8">Loading registrations...</div>;
    if (tournamentRegistrations.length === 0) {
      return (
        <div className="text-center py-8">
          <FaTrophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tournament registrations</h3>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team / Participant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tournamentRegistrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{reg.tournamentTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">{reg.teamName}</div>
                  <div className="text-xs text-gray-500">Size: {reg.teamSize}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reg.email}</div>
                  <div className="text-sm text-gray-500">{reg.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reg.status === 'Approved' ? 'bg-green-100 text-green-800' : reg.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {reg.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {reg.status === 'Pending' ? (
                    <div className="flex space-x-2">
                      <button onClick={() => handleUpdateRegistrationStatus(reg.tournamentId, reg._id, 'Approved')} className="text-green-600 hover:text-green-900"><FaCheck /></button>
                      <button onClick={() => handleUpdateRegistrationStatus(reg.tournamentId, reg._id, 'Rejected')} className="text-red-600 hover:text-red-900"><FaTimes /></button>
                    </div>
                  ) : (
                    <button onClick={() => handleUpdateRegistrationStatus(reg.tournamentId, reg._id, 'Pending')} className="text-gray-600 hover:text-gray-900 text-xs text-right">Reset to Pending</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sports & Events Management</h2>
            <p className="mt-1 text-sm text-gray-500">Manage sports categories, events, tournaments, and view comprehensive analytics</p>
          </div>
          <div className="flex space-x-3">
            {activeTab === 'tournaments' && (
              <button onClick={fetchTournamentRegistrations} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Refresh Registrations</button>
            )}
            {activeTab === 'categories' && (
              <button onClick={() => setShowCategoryModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"><FaPlus className="mr-2" />Add Category</button>
            )}
            {activeTab === 'events' && (
              <div className="flex space-x-3">
                <button onClick={() => setShowCreateEventModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"><FaPlus className="mr-2" />Create Event</button>
                <button onClick={handleUpdateEventStatuses} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"><FaCog className="mr-2" />Update Statuses</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'categories', label: 'Sports Categories', icon: <FaTrophy /> },
              { id: 'events', label: 'Events Management', icon: <FaCalendar /> },
              { id: 'tournaments', label: 'Tournament Registrations', icon: <FaTrophy /> },
              { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'categories' && renderCategoriesTable()}
              {activeTab === 'events' && (
                <>
                  <div className="flex space-x-4 mb-6">
                    <div className="flex-1 relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border rounded-md" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-md">
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={showPastEvents} onChange={(e) => setShowPastEvents(e.target.checked)} className="rounded border-gray-300" />
                      <span className="text-sm text-gray-500">Show Past Events</span>
                    </div>
                  </div>
                  {renderEventsTable()}
                </>
              )}
              {activeTab === 'tournaments' && renderTournamentsTable()}
              {activeTab === 'analytics' && renderAnalytics()}

              {(activeTab === 'categories' || activeTab === 'events') && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-gray-700">Page {currentPage} of {totalPages}</div>
                  <div className="flex space-x-2">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-2 border rounded-md disabled:opacity-50">Previous</button>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-md disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Name</label><input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="mt-1 block w-full border rounded-md p-2" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="mt-1 block w-full border rounded-md p-2" rows="3" /></div>
              <div className="flex justify-end space-x-3"><button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 border rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{editingCategory ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}

      {eventAnalytics && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics: {selectedEvent.title}</h3>
              <button onClick={() => setEventAnalytics(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><div>Total Registrations</div><div className="text-2xl font-bold">{eventAnalytics.totalRegistrations}</div></div>
              <div className="bg-gray-50 p-4 rounded-lg"><div>Views</div><div className="text-2xl font-bold">{eventAnalytics.views}</div></div>
            </div>
            <div className="mt-6 flex justify-end"><button onClick={() => setEventAnalytics(null)} className="px-4 py-2 border rounded-md">Close</button></div>
          </div>
        </div>
      )}

      {showCreateEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Create New Event</h3>
              <button onClick={() => setShowCreateEventModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">Title *</label><input type="text" required value={createEventForm.title} onChange={(e) => setCreateEventForm({ ...createEventForm, title: e.target.value })} className="w-full border rounded-md px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-2">Location *</label><input type="text" required value={createEventForm.location} onChange={(e) => setCreateEventForm({ ...createEventForm, location: e.target.value })} className="w-full border rounded-md px-3 py-2" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className="block text-sm font-medium mb-2">Date *</label><input type="date" required value={createEventForm.date} onChange={(e) => setCreateEventForm({ ...createEventForm, date: e.target.value })} className="w-full border rounded-md px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-2">Time *</label><input type="time" required value={createEventForm.time} onChange={(e) => setCreateEventForm({ ...createEventForm, time: e.target.value })} className="w-full border rounded-md px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-2">Sport *</label><select value={createEventForm.sport} onChange={(e) => setCreateEventForm({ ...createEventForm, sport: e.target.value })} className="w-full border rounded-md px-3 py-2"><option value="cricket">Cricket</option><option value="football">Football</option></select></div>
              </div>
              <div className="flex justify-end space-x-3"><button type="button" onClick={() => setShowCreateEventModal(false)} className="px-4 py-2 border rounded-md">Cancel</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md">Create Event</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEventsManagement;
