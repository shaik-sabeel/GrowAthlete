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
  const [showPastEvents, setShowPastEvents] = useState(true); // Default to show all events

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
      // Auto-update event statuses before fetching events
      const updateAndFetchEvents = async () => {
        try {
          // Automatically update event statuses (mark past events as completed)
          await api.post('/admin/events/update-statuses');
        } catch (error) {
          console.error('Failed to auto-update event statuses:', error);
        }
        // Always fetch events, regardless of status update success/failure
        fetchEvents();
      };
      updateAndFetchEvents();
    } else if (activeTab === 'analytics') {
      fetchOverviewStats();
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
    
    // Validate required fields
    if (!selectedImage) {
      alert('Please select an event image');
      return;
    }

    // Validate date is not in the past
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form and close modal
      resetCreateEventForm();
      setShowCreateEventModal(false);
      
      // Refresh events list
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
      if (notes === null) return; // User cancelled

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
      fetchEvents(); // Refresh the events list
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
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
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {category.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.status === 'active' ? 'bg-green-100 text-green-800' :
                    category.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.eventCount || 0} events
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editCategory(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
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
    if (!events || !Array.isArray(events) || events.length === 0) {
      return (
        <div className="text-center py-8">
          <FaCalendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filterStatus !== 'all' ? `No ${filterStatus} events found.` : 'No events available.'}
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
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sport & Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-lg object-cover" 
                        src={`https://growathlete.onrender.com${event.image}`} 
                        alt={event.title}
                        onError={(e) => {
                          console.error('Failed to load event image:', `https://growathlete.onrender.com${event.image}`);
                          e.target.style.display = 'none';
                        }}
                      />
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">
                     {new Date(event.date).toLocaleDateString()}
                   </div>
                   <div className="text-sm text-gray-500">{event.location}</div>
                   {(() => {
                     const eventDate = new Date(event.date);
                     const now = new Date();
                     const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
                     const MS_PER_DAY = 24 * 60 * 60 * 1000;
                     const daysDiff = Math.round((startOfDay(eventDate).getTime() - startOfDay(now).getTime()) / MS_PER_DAY);
                     if (daysDiff < 0) return null; // Past event
                     if (daysDiff === 0) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Today!</span>;
                     if (daysDiff === 1) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Tomorrow</span>;
                     if (daysDiff <= 7) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In {daysDiff} days</span>;
                     return null;
                   })()}
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewEventAnalytics(event._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Analytics"
                    >
                      <FaChartBar />
                    </button>
                    {event.status === 'pending' && (
                      <>
                        <button
                          onClick={() => approveEvent(event._id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => approveEvent(event._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
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
    if (!overviewStats) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading analytics...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCalendar className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                    <dd className="text-lg font-medium text-gray-900">{overviewStats.totalEvents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                    <dd className="text-lg font-medium text-gray-900">{overviewStats.pendingEvents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                    <dd className="text-lg font-medium text-gray-900">{overviewStats.publishedEvents}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                    <dd className="text-lg font-medium text-gray-900">{overviewStats.totalRegistrations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events by Sport */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Events by Sport</h3>
            <div className="space-y-3">
              {overviewStats.eventsBySport?.map((sport) => (
                <div key={sport._id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{sport._id}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(sport.count / overviewStats.totalEvents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{sport.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events by Category */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Events by Category</h3>
            <div className="space-y-3">
              {overviewStats.eventsByCategory?.map((category) => (
                <div key={category._id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category._id}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(category.count / overviewStats.totalEvents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{category.count}</span>
                  </div>
                </div>
              ))}
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
            <h2 className="text-2xl font-bold text-gray-900">Sports & Events Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage sports categories, events, and view comprehensive analytics
            </p>
          </div>
          <div className="flex space-x-3">
            {activeTab === 'categories' && (
              <button
                onClick={() => setShowCategoryModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Category
              </button>
            )}
                         {activeTab === 'events' && (
               <div className="flex space-x-3">
                 <button
                   onClick={() => setShowCreateEventModal(true)}
                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                 >
                   <FaPlus className="mr-2 h-4 w-4" />
                   Create Event
                 </button>
                 <button
                   onClick={handleUpdateEventStatuses}
                   className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                 >
                   <FaCog className="mr-2 h-4 w-4" />
                   Update Statuses
                 </button>
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
              { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> }
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
          {activeTab === 'events' && (
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
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
                <option value="published">Published</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Sports</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="tennis">Tennis</option>
                <option value="swimming">Swimming</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="webinar">Webinar</option>
                <option value="showcase">Showcase</option>
                <option value="tournament">Tournament</option>
                <option value="training">Training</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
              
              {/* Show Past Events Toggle */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPastEvents}
                    onChange={(e) => setShowPastEvents(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-500">Show Past Events</span>
                </label>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'categories' && renderCategoriesTable()}
              {activeTab === 'events' && renderEventsTable()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Sports Category' : 'Add New Sports Category'}
              </h3>
              <button
                onClick={() => {
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
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="🏃"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <input
                  type="text"
                  maxLength={100}
                  value={categoryForm.shortDescription}
                  onChange={(e) => setCategoryForm({...categoryForm, shortDescription: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({...categoryForm, sortOrder: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    checked={categoryForm.featured}
                    onChange={(e) => setCategoryForm({...categoryForm, featured: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Featured Category</label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Analytics Modal */}
      {eventAnalytics && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Event Analytics: {selectedEvent.title}</h3>
              <button
                onClick={() => {
                  setEventAnalytics(null);
                  setSelectedEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Total Registrations</div>
                  <div className="text-2xl font-bold text-gray-900">{eventAnalytics.totalRegistrations}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Registration Rate</div>
                  <div className="text-2xl font-bold text-gray-900">{eventAnalytics.registrationRate}%</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-2">Status Breakdown</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Attended: {eventAnalytics.statusBreakdown.attended}</div>
                  <div>Cancelled: {eventAnalytics.statusBreakdown.cancelled}</div>
                  <div>No Show: {eventAnalytics.statusBreakdown.noShow}</div>
                  <div>Pending: {eventAnalytics.statusBreakdown.pending}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Views</div>
                  <div className="text-xl font-bold text-gray-900">{eventAnalytics.views}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Shares</div>
                  <div className="text-xl font-bold text-gray-900">{eventAnalytics.shares}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setEventAnalytics(null);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-gray-900">Create New Event</h3>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  resetCreateEventForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={createEventForm.title}
                    onChange={(e) => setCreateEventForm({...createEventForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter event name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <input
                    type="text"
                    maxLength={200}
                    value={createEventForm.shortDescription}
                    onChange={(e) => setCreateEventForm({...createEventForm, shortDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description (max 200 chars)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Description *</label>
                <textarea
                  required
                  rows={4}
                  value={createEventForm.description}
                  onChange={(e) => setCreateEventForm({...createEventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Detailed description of the event"
                />
              </div>

              {/* Date, Time & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={createEventForm.date}
                    onChange={(e) => setCreateEventForm({...createEventForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    required
                    value={createEventForm.time}
                    onChange={(e) => setCreateEventForm({...createEventForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={createEventForm.location}
                    onChange={(e) => setCreateEventForm({...createEventForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Event location"
                  />
                </div>
              </div>

              {/* Sport & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sport *</label>
                  <select
                    required
                    value={createEventForm.sport}
                    onChange={(e) => setCreateEventForm({...createEventForm, sport: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="badminton">Badminton</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                    <option value="swimming">Swimming</option>
                    <option value="volleyball">Volleyball</option>
                    <option value="athletics">Athletics</option>
                    <option value="hockey">Hockey</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={createEventForm.category}
                    onChange={(e) => setCreateEventForm({...createEventForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="webinar">Webinar</option>
                    <option value="showcase">Showcase</option>
                    <option value="tournament">Tournament</option>
                    <option value="training">Training</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Event Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image *</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">Select an image from your computer</p>
              </div>

              {/* Organizer Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={createEventForm.organizerName}
                    onChange={(e) => setCreateEventForm({...createEventForm, organizerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Organizer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={createEventForm.organizerEmail}
                    onChange={(e) => setCreateEventForm({...createEventForm, organizerEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="organizer@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={createEventForm.organizerPhone}
                    onChange={(e) => setCreateEventForm({...createEventForm, organizerPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Event Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    min="1"
                    value={createEventForm.maxParticipants}
                    onChange={(e) => setCreateEventForm({...createEventForm, maxParticipants: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="flex">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={createEventForm.price}
                      onChange={(e) => setCreateEventForm({...createEventForm, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                    <select
                      value={createEventForm.currency}
                      onChange={(e) => setCreateEventForm({...createEventForm, currency: e.target.value})}
                      className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createEventForm.isOpen}
                      onChange={(e) => setCreateEventForm({...createEventForm, isOpen: e.target.checked})}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Event is Open/Published</span>
                  </label>
                </div>
              </div>

              {/* Tags, Highlights & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('tags', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addArrayItem('tags', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {createEventForm.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('tags', index)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                  <div className="space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a highlight"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('highlights', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addArrayItem('highlights', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {createEventForm.highlights.map((highlight, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {highlight}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('highlights', index)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <div className="space-y-2">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a requirement"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('requirements', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addArrayItem('requirements', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-r-md hover:bg-yellow-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {createEventForm.requirements.map((requirement, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {requirement}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('requirements', index)}
                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateEventModal(false);
                    resetCreateEventForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEventsManagement;
