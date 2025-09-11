import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import '../pages_css/AdminDashboard.css';
import ContentModeration from '../components/ContentModeration';
import SystemAdministration from '../components/SystemAdministration';
import AdminSettings from '../components/AdminSettings';
import SportsEventsManagement from '../components/SportsEventsManagement';
import AnimatedSportsBackground from '../components/AnimatedSportsBackground';
import { FaUsers, FaUserCheck, FaUserTimes, FaChartBar, FaCog, FaSignOutAlt, FaHome, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaDownload, FaCrown, FaShieldAlt, FaTrophy, FaRocket, FaGlobe, FaDatabase, FaServer, FaExclamationTriangle, FaCheckCircle, FaArrowUp, FaCalendarAlt, FaStar, FaAward, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown, FaClock, FaFlag } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const BUSY_MIN_MS = 5000;
  const isFirstLoadRef = useRef(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('page');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    suspendedUsers: 0,
    pendingUsers: 0,
    recentRegistrations: 0,
    sportStats: [],
    levelStats: [],
    roleStats: []
  });

  // Engagement metrics
  const [engagementMetrics, setEngagementMetrics] = useState({
    dau: 0,
    wau: 0,
    mau: 0,
    retention7Day: 0,
    retention30Day: 0,
    avgSessionDuration: 0,
    sessionDurationBySport: [],
    activeTimePeriods: [],
    featureUsage: []
  });
  const [totalPages, setTotalPages] = useState(0);
  
  // Sorting states
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Performance states
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loadingFlagged, setLoadingFlagged] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchEngagementMetrics();
    fetchFlaggedPosts();
  }, [currentPage, usersPerPage, sortField, sortDirection, filterRole]);


  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (searchTerm) {
      setIsSearching(true);
      const timeout = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchUsers();
      }, 500); // 500ms delay
      setSearchTimeout(timeout);
    } else {
      fetchUsers();
    }
    
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Admin entry intro animation (once per session, optional force via URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get('showIntro') === '1';
    const hasShown = sessionStorage.getItem('adminIntroShown');
    let timeoutId;
    if (forceIntro || !hasShown) {
      setShowIntro(true);
      timeoutId = setTimeout(() => {
        setShowIntro(false);
        if (!forceIntro) {
          sessionStorage.setItem('adminIntroShown', '1');
        }
      }, 4000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const fetchUsers = async () => {
    let busyStart; // Declared outside try block
    try {
      busyStart = Date.now(); // Assigned inside try block
      // Only show busy overlay with min duration after first load
      if (!isFirstLoadRef.current) {
        setIsBusy(true);
      }
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        sortBy: sortField,
        sortOrder: sortDirection,
        role: filterRole !== 'all' ? filterRole : '',
        search: searchTerm
      });

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data?.users || []);
      setTotalUsers(response.data?.total || 0);
      setTotalPages(Math.ceil((response.data?.total || 0) / usersPerPage));
      setLoading(false);
      setIsSearching(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
      setIsSearching(false);
    } finally {
      if (busyStart !== undefined) { // Added check for busyStart
        const elapsed = Date.now() - busyStart;
        if (isFirstLoadRef.current) {
          // No enforced delay on initial load
          setIsBusy(false);
          isFirstLoadRef.current = false;
        } else {
          const remaining = Math.max(0, BUSY_MIN_MS - elapsed);
          if (remaining > 0) {
            setTimeout(() => setIsBusy(false), remaining);
          } else {
            setIsBusy(false);
          }
        }
      } else {
        setIsBusy(false); // Ensure busy state is reset even if busyStart was not defined
      }
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setDashboardStats(response.data || {
        totalUsers: 0,
        verifiedUsers: 0,
        suspendedUsers: 0,
        pendingUsers: 0,
        recentRegistrations: 0,
        sportStats: [],
        levelStats: [],
        roleStats: []
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Set default stats on error
      setDashboardStats({
        totalUsers: 0,
        verifiedUsers: 0,
        suspendedUsers: 0,
        pendingUsers: 0,
        recentRegistrations: 0,
        sportStats: [],
        levelStats: [],
        roleStats: []
      });
    }
  };

  const fetchEngagementMetrics = async () => {
    try {
      const response = await api.get('/admin/engagement-metrics');
      setEngagementMetrics(response.data || {
        dau: 0,
        wau: 0,
        mau: 0,
        retention7Day: 0,
        retention30Day: 0,
        avgSessionDuration: 0,
        sessionDurationBySport: [],
        activeTimePeriods: [],
        featureUsage: []
      });
    } catch (error) {
      console.error('Failed to fetch engagement metrics:', error);
      // Set default empty data when API fails
      setEngagementMetrics({
        dau: 0,
        wau: 0,
        mau: 0,
        retention7Day: 0,
        retention30Day: 0,
        avgSessionDuration: 0,
        sessionDurationBySport: [],
        activeTimePeriods: [],
        featureUsage: []
      });
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({
        role: filterRole !== 'all' ? filterRole : '',
        status: '',
        search: searchTerm || '',
        sortBy: sortField,
        sortOrder: sortDirection,
        page: String(currentPage),
        limit: String(usersPerPage),
        scope: exportScope,
        format: exportFormat
      });
      const url = `/admin/users/export-file?${params.toString()}`;
      const resp = await api.get(url, { responseType: 'blob' });
      const contentType = resp.headers?.['content-type'] || '';
      // Determine actual format (server may fall back to CSV if XLSX not available)
      let actualFormat = exportFormat;
      if (contentType.includes('text/csv')) actualFormat = 'csv';
      else if (contentType.includes('application/json')) actualFormat = 'json';
      else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) actualFormat = 'xlsx';

      const blob = resp.data;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `users-export-${exportScope}-${ts}.${actualFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Export failed:', e);
      const msg = e?.response?.data?.message || e?.response?.data || e?.message || 'Export failed. Try a different format or narrow filters.';
      alert(String(msg));
    } finally {
      setExporting(false);
    }
  };

  const fetchFlaggedPosts = async () => {
    try {
      setLoadingFlagged(true);
      const resp = await api.get('/moderation/community-posts', { params: { status: 'flagged', limit: 50, sortBy: 'createdAt', sortOrder: 'desc' } });
      setFlaggedPosts(resp.data?.posts || []);
    } catch (e) {
      console.error('Failed to fetch flagged posts:', e);
      setFlaggedPosts([]);
    } finally {
      setLoadingFlagged(false);
    }
  };

  // Busy state helper for actions
  const runWithBusy = async (fn) => {
    try {
      const busyStart = Date.now();
      setIsBusy(true);
      await fn();
    } finally {
      const elapsed = Date.now() - busyStart;
      const remaining = Math.max(0, BUSY_MIN_MS - elapsed);
      if (remaining > 0) {
        setTimeout(() => setIsBusy(false), remaining);
      } else {
        setIsBusy(false);
      }
    }
  };

  // Simple visual busy feedback when switching sections
  const changeSection = (section) => {
    setActiveSection(section);
    if (section === 'users') {
      // Users section triggers a real fetch; busy is handled in fetchUsers
      return;
    }
    setIsBusy(true);
    setTimeout(() => setIsBusy(false), BUSY_MIN_MS);
  };

  const handleRoleChange = async (userId, newRole) => {
    await runWithBusy(async () => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
        await fetchUsers();
    } catch (error) {
      console.error('Failed to change role:', error);
      alert('Failed to change user role');
    }
    });
  };

  const handleVerification = async (userId, isVerified) => {
    await runWithBusy(async () => {
    try {
      await api.patch(`/admin/users/${userId}/verify`, { isVerified });
        await fetchUsers();
    } catch (error) {
      console.error('Failed to update verification:', error);
      alert('Failed to update verification status');
    }
    });
  };

  const handleSuspension = async (userId, isSuspended, reason = '', until = null) => {
    await runWithBusy(async () => {
    try {
      await api.patch(`/admin/users/${userId}/suspend`, { 
        isSuspended, 
        suspendedReason: reason, 
        suspendedUntil: until 
      });
        await fetchUsers();
    } catch (error) {
      console.error('Failed to update suspension:', error);
      alert('Failed to update suspension status');
    }
    });
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setEditUserData({
      username: user.username || '',
      email: user.email || '',
      sport: user.sport || '',
      level: user.level || '',
      age: user.age || '',
      location: user.location || '',
      bio: user.bio || '',
      phone: user.phone || '',
      role: user.role || 'athlete',
      isVerified: user.isVerified || false,
      isSuspended: user.isSuspended || false
    });
    setShowUserModal(true);
  };

  const handleEditUser = () => {
    setIsEditingUser(true);
  };

  const handleCancelEdit = () => {
    setIsEditingUser(false);
    setEditUserData({
      username: selectedUser.username || '',
      email: selectedUser.email || '',
      sport: selectedUser.sport || '',
      level: selectedUser.level || '',
      age: selectedUser.age || '',
      location: selectedUser.location || '',
      bio: selectedUser.bio || '',
      phone: selectedUser.phone || '',
      role: selectedUser.role || 'athlete',
      isVerified: selectedUser.isVerified || false,
      isSuspended: selectedUser.isSuspended || false
    });
  };

  const handleSaveUser = async () => {
    try {
      await api.patch(`/admin/users/${selectedUser._id}/profile`, editUserData);
      await fetchUsers();
      setIsEditingUser(false);
      alert('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = async () => {
    console.log("Logout button clicked!"); // Debug log
    try {
      console.log("Attempting to call logout API..."); // Debug log
      await api.post("/auth/logout");
      console.log("Logout API call successful"); // Debug log
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      window.location.href = '/login';
    }
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Sorting handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Keyboard shortcut for sidebar toggle
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [sidebarCollapsed]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, Admin! 👋</h1>
          <p>Here's what's happening with your platform today</p>
        </div>
        <div className="welcome-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
          <button className="btn btn-secondary" onClick={() => { setIsBusy(true); setTimeout(() => setIsBusy(false), BUSY_MIN_MS); }}>
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{dashboardStats.totalUsers}</p>
            <span className="stat-change positive">+{dashboardStats.recentRegistrations} this week</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Verified Users</h3>
            <p className="stat-number">{dashboardStats.verifiedUsers}</p>
            <span className="stat-change positive">{dashboardStats.totalUsers > 0 ? Math.round((dashboardStats.verifiedUsers / dashboardStats.totalUsers) * 100) : 0}% verified</span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>Suspended Users</h3>
            <p className="stat-number">{dashboardStats.suspendedUsers}</p>
            <span className="stat-change negative">{dashboardStats.totalUsers > 0 ? Math.round((dashboardStats.suspendedUsers / dashboardStats.totalUsers) * 100) : 0}% suspended</span>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>Pending Users</h3>
            <p className="stat-number">{dashboardStats.pendingUsers}</p>
            <span className="stat-change neutral">Awaiting verification</span>
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="analytics-section">
        <h2>Platform Analytics</h2>
        

        {/* Real-time Engagement Metrics */}
        <div className="engagement-metrics-section">
          <h2>Real-time Engagement Metrics</h2>
          
          {/* Key Metrics Cards */}
          <div className="engagement-cards-grid">
            <div className="engagement-card">
              <div className="engagement-header">
                <FaUsers className="engagement-icon" />
                <h3>Active Users</h3>
              </div>
              <div className="engagement-metrics">
                <div className="metric-item">
                  <span className="metric-label">Daily Active Users</span>
                  <span className="metric-value">{engagementMetrics.dau.toLocaleString()}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Weekly Active Users</span>
                  <span className="metric-value">{engagementMetrics.wau.toLocaleString()}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Monthly Active Users</span>
                  <span className="metric-value">{engagementMetrics.mau.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="engagement-card">
              <div className="engagement-header">
                <FaUserCheck className="engagement-icon" />
                <h3>User Retention</h3>
              </div>
              <div className="engagement-metrics">
                <div className="metric-item">
                  <span className="metric-label">7-Day Retention</span>
                  <span className="metric-value">{engagementMetrics.retention7Day}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">30-Day Retention</span>
                  <span className="metric-value">{engagementMetrics.retention30Day}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Session Duration</span>
                  <span className="metric-value">{engagementMetrics.avgSessionDuration}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Duration by Sport */}
          <div className="engagement-chart-section">
            <h3>Average Session Duration by Sport</h3>
            <div className="session-duration-chart">
              {engagementMetrics.sessionDurationBySport && engagementMetrics.sessionDurationBySport.length > 0 ? (
                engagementMetrics.sessionDurationBySport.map((sport, index) => (
                  <div key={sport.sport} className="session-duration-item">
                    <div className="sport-info">
                      <span className="sport-name">{sport.sport}</span>
                      <span className="sport-users">({sport.users} users)</span>
                    </div>
                    <div className="duration-bar">
                      <div 
                        className="duration-fill" 
                        style={{ 
                          width: `${(sport.duration / Math.max(...engagementMetrics.sessionDurationBySport.map(s => s.duration))) * 100}%`,
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                        }}
                      ></div>
                    </div>
                    <span className="duration-value">{sport.duration}m</span>
                  </div>
                ))
              ) : (
                <div className="no-data">No session duration data available</div>
              )}
            </div>
          </div>

          {/* Most Active Time Periods */}
          <div className="engagement-chart-section">
            <h3>Most Active Time Periods</h3>
            <div className="time-periods-chart">
              {engagementMetrics.activeTimePeriods && engagementMetrics.activeTimePeriods.length > 0 ? (
                engagementMetrics.activeTimePeriods.map((period, index) => (
                  <div key={period.period} className="time-period-item">
                    <span className="period-label">{period.period}</span>
                    <div className="period-bar">
                      <div 
                        className="period-fill" 
                        style={{ 
                          width: `${period.percentage}%`,
                          backgroundColor: `hsl(${index * 30}, 70%, 50%)`
                        }}
                      ></div>
                    </div>
                    <div className="period-stats">
                      <span className="period-users">{period.users} users</span>
                      <span className="period-percentage">{period.percentage}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">No time period data available</div>
              )}
            </div>
          </div>

          {/* Feature Usage Statistics */}
          <div className="engagement-chart-section">
            <h3>Feature Usage Statistics</h3>
            <div className="feature-usage-chart">
              {engagementMetrics.featureUsage && engagementMetrics.featureUsage.length > 0 ? (
                (() => {
                  const items = engagementMetrics.featureUsage;
                  const counts = items.map((f) => Number(f.users ?? f.usage ?? 0));
                  const maxCount = Math.max(1, ...counts);
                  return items.map((feature, index) => {
                    const userCount = Number(feature.users ?? feature.usage ?? 0);
                    const pct = typeof feature.usage === 'number' && feature.usage <= 100
                      ? feature.usage
                      : Math.round((userCount / maxCount) * 100);
                    return (
                      <div key={feature.feature} className="feature-usage-item">
                        <div className="feature-info">
                          <span className="feature-name">{feature.feature}</span>
                          <span className="feature-users">({userCount.toLocaleString()} users)</span>
                        </div>
                        <div className="usage-bar">
                          <div 
                            className="usage-fill" 
                            style={{ 
                              width: `${pct}%`,
                              backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <span className="usage-percentage">{pct}%</span>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="no-data">No feature usage data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-header">
              <h3>Traffic Overview</h3>
              <FaChartBar className="analytics-icon" />
            </div>
            <div className="analytics-content">
              <div className="metric-row">
                <span>Page Views</span>
                <span className="metric-value">2.4M</span>
                <span className="metric-change positive">+18%</span>
              </div>
              <div className="metric-row">
                <span>Unique Visitors</span>
                <span className="metric-value">456K</span>
                <span className="metric-change positive">+12%</span>
              </div>
              <div className="metric-row">
                <span>Session Duration</span>
                <span className="metric-value">4m 32s</span>
                <span className="metric-change positive">+8%</span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-header">
              <h3>Performance Metrics</h3>
              <FaRocket className="analytics-icon" />
            </div>
            <div className="analytics-content">
              <div className="metric-row">
                <span>Response Time</span>
                <span className="metric-value">127ms</span>
                <span className="metric-change positive">-12%</span>
              </div>
              <div className="metric-row">
                <span>Error Rate</span>
                <span className="metric-value">0.03%</span>
                <span className="metric-change positive">-45%</span>
              </div>
              <div className="metric-row">
                <span>Throughput</span>
                <span className="metric-value">1.2K req/s</span>
                <span className="metric-change positive">+23%</span>
              </div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-header">
              <h3>Engagement Stats</h3>
              <FaStar className="analytics-icon" />
            </div>
            <div className="analytics-content">
              <div className="metric-row">
                <span>Bounce Rate</span>
                <span className="metric-value">32%</span>
                <span className="metric-change positive">-5%</span>
              </div>
              <div className="metric-row">
                <span>Conversion Rate</span>
                <span className="metric-value">4.7%</span>
                <span className="metric-change positive">+15%</span>
              </div>
              <div className="metric-row">
                <span>User Retention</span>
                <span className="metric-value">78%</span>
                <span className="metric-change positive">+9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <FaCheckCircle />
            </div>
            <div className="activity-content">
              <h4>New User Registration</h4>
              <p>John Doe registered as an athlete</p>
              <span className="activity-time">2 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">
              <FaUserCheck />
            </div>
            <div className="activity-content">
              <h4>User Verification</h4>
              <p>Sarah Wilson's profile was verified</p>
              <span className="activity-time">15 minutes ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon warning">
              <FaExclamationTriangle />
            </div>
            <div className="activity-content">
              <h4>System Alert</h4>
              <p>High traffic detected on sports news section</p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon primary">
              <FaAward />
            </div>
            <div className="activity-content">
              <h4>Achievement Unlocked</h4>
              <p>1000th verified athlete milestone reached</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">
              <FaDatabase />
            </div>
            <div className="activity-content">
              <h4>Backup Completed</h4>
              <p>Daily database backup completed successfully</p>
              <span className="activity-time">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card">
            <FaChartBar />
            <span>View Analytics</span>
          </button>
          <button className="action-card">
            <FaShieldAlt />
            <span>Security Check</span>
          </button>
          <button className="action-card">
            <FaDatabase />
            <span>Database Status</span>
          </button>
          <button className="action-card">
            <FaCog />
            <span>System Settings</span>
          </button>
          <button className="action-card">
            <FaCalendarAlt />
            <span>Schedule Tasks</span>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health">
        <h2>System Health</h2>
        <div className="health-grid">
          <div className="health-card healthy">
            <div className="health-header">
              <FaServer />
              <span>Web Server</span>
            </div>
            <div className="health-status">
              <span className="status-text">Healthy</span>
              <div className="status-indicator"></div>
            </div>
            <p>Uptime: 99.9%</p>
          </div>

          <div className="health-card healthy">
            <div className="health-header">
              <FaDatabase />
              <span>Database</span>
            </div>
            <div className="health-status">
              <span className="status-text">Healthy</span>
              <div className="status-indicator"></div>
            </div>
            <p>Response: 45ms</p>
          </div>

          <div className="health-card warning">
            <div className="health-header">
              <FaGlobe />
              <span>CDN</span>
            </div>
            <div className="health-status">
              <span className="status-text">Warning</span>
              <div className="status-indicator warning"></div>
            </div>
            <p>Latency: 180ms</p>
          </div>

          <div className="health-card healthy">
            <div className="health-header">
              <FaShieldAlt />
              <span>Security</span>
            </div>
            <div className="health-status">
              <span className="status-text">Secure</span>
              <div className="status-indicator"></div>
            </div>
            <p>Threats: 0</p>
          </div>
        </div>
      </div>
      
      {/* Flagged Posts */}
      <div className="admin-section" style={{ marginTop: 24 }}>
        <div className="section-header">
          <div className="header-content">
            <h2><FaFlag style={{ marginRight: 8 }} /> Flagged Posts</h2>
            <p>Community posts reported by users and pending review</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={fetchFlaggedPosts} disabled={loadingFlagged}>{loadingFlagged ? 'Refreshing…' : 'Refresh'}</button>
          </div>
        </div>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Excerpt</th>
                <th>Flags</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {flaggedPosts.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#6b7280' }}>{loadingFlagged ? 'Loading…' : 'No flagged posts'}</td></tr>
              )}
              {flaggedPosts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{p.author?.username?.[0]?.toUpperCase() || '?'}</div>
                      <div className="user-details">
                        <span className="username">{p.author?.username || 'Unknown'}</span>
                        <span className="email">{new Date(p.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-700" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 420 }}>{p.content}</span>
                  </td>
                  <td>
                    <span className="badge suspended"><FaFlag /> {p.flags?.length || 0}</span>
                  </td>
                  <td>
                    <span className="badge pending">{p.status}</span>
                  </td>
                  <td>
                    <button 
                      onClick={() => {
                        setActiveSection('moderation');
                        // The ContentModeration component will show flagged posts by default
                      }} 
                      className="btn btn-icon btn-view" 
                      title="Moderate"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="loader">
            <span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <div className="base">
              <span></span>
              <div className="face"></div>
            </div>
          </div>
          <div className="admin-loading-text" aria-live="polite">
            Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        </div>
        <div className="longfazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AnimatedSportsBackground />
      

      {isBusy && (
        <div className="admin-busy-overlay" aria-live="polite" aria-busy="true">
          <div className="admin-busy-content">
            <div className="loader">
              <span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div className="base">
                <span></span>
                <div className="face"></div>
              </div>
            </div>
            <div className="admin-loading-text">
              Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          </div>
          <div className="longfazers">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      {showIntro && (
        <div className="admin-intro-overlay">
          <div className="admin-intro-badge">
            <span className="admin-intro-glow"></span>
            <span className="admin-intro-crown">👑</span>
            <span className="admin-intro-text">Admin Mode</span>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <FaCrown className="brand-icon" />
            {!sidebarCollapsed && <h3>GrowAthlete</h3>}
          </div>
          <button 
            className={`sidebar-toggle ${sidebarCollapsed ? 'collapsed' : ''}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={`${sidebarCollapsed ? 'Click to Expand' : 'Click to Collapse'} (Ctrl+B)`}
          >
            <span className={`toggle-icon ${sidebarCollapsed ? 'collapsed' : ''}`}>
              {sidebarCollapsed ? '▶' : '◀'}
            </span>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                onClick={() => changeSection('dashboard')}
              >
                <FaHome />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                onClick={() => changeSection('users')}
              >
                <FaUsers />
                {!sidebarCollapsed && <span>User Management</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'verification' ? 'active' : ''}`}
                onClick={() => changeSection('verification')}
              >
                <FaUserCheck />
                {!sidebarCollapsed && <span>Verification</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'suspensions' ? 'active' : ''}`}
                onClick={() => changeSection('suspensions')}
              >
                <FaUserTimes />
                {!sidebarCollapsed && <span>Suspensions</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
                onClick={() => changeSection('analytics')}
              >
                <FaChartBar />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'moderation' ? 'active' : ''}`}
                onClick={() => changeSection('moderation')}
              >
                <FaShieldAlt />
                {!sidebarCollapsed && <span>Content Moderation</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'sports-events' ? 'active' : ''}`}
                onClick={() => changeSection('sports-events')}
              >
                <FaTrophy />
                {!sidebarCollapsed && <span>Sports & Events</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'system-admin' ? 'active' : ''}`}
                onClick={() => changeSection('system-admin')}
              >
                <FaCog />
                {!sidebarCollapsed && <span>System Administration</span>}
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
                onClick={() => changeSection('settings')}
              >
                <FaCog />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="nav-item logout-btn" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Button click event triggered");
              handleLogout();
            }}
            style={{ cursor: 'pointer', zIndex: 1000 }}
          >
            <FaSignOutAlt />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <div className="header-content">
                <h2>User Management</h2>
                <p>Manage and monitor all platform users ({totalUsers} total)</p>
              </div>
              <div className="header-actions">
                <div className="export-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="role-filter">
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="json">JSON</option>
                  </select>
                  <select value={exportScope} onChange={(e) => setExportScope(e.target.value)} className="role-filter">
                    <option value="page">Current Page</option>
                    <option value="all">All (with filters)</option>
                  </select>
                  <button className="btn btn-primary" onClick={handleExport} disabled={exporting} title="Export users">
                    <FaDownload /> {exporting ? 'Exporting…' : 'Export'}
                  </button>
                </div>
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {isSearching && <div className="search-indicator"></div>}
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="role-filter"
                >
                  <option value="all">All Roles</option>
                  <option value="athlete">Athletes</option>
                  <option value="coach">Coaches</option>
                  <option value="scout">Scouts</option>
                  <option value="sponsor">Sponsors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('username')} className="sortable">
                      <div className="th-content">
                        User {getSortIcon('username')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('role')} className="sortable">
                      <div className="th-content">
                        Role {getSortIcon('role')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('isVerified')} className="sortable">
                      <div className="th-content">
                        Status {getSortIcon('isVerified')}
                      </div>
                    </th>
                    <th onClick={() => handleSort('createdAt')} className="sortable">
                      <div className="th-content">
                        Last Active {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="user-row">
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <span className="username">{user.username}</span>
                            <span className="email">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-badge">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`role-select role-${user.role}`}
                            disabled={user._id === JSON.parse(localStorage.getItem('user') || '{}')._id}
                          >
                            <option value="athlete">Athlete</option>
                            <option value="coach">Coach</option>
                            <option value="scout">Scout</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="status-badges">
                          {user.isVerified && (
                            <span className="badge verified">
                              <FaUserCheck /> Verified
                            </span>
                          )}
                          {user.isSuspended && (
                            <span className="badge suspended">
                              <FaUserTimes /> Suspended
                            </span>
                          )}
                          {!user.isVerified && !user.isSuspended && (
                            <span className="badge pending">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="last-active">2 hours ago</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => openUserModal(user)}
                            className="btn btn-icon btn-view"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button 
                            onClick={() => handleVerification(user._id, !user.isVerified)}
                            className={`btn btn-icon ${user.isVerified ? 'btn-unverify' : 'btn-verify'}`}
                            title={user.isVerified ? 'Unverify' : 'Verify'}
                          >
                            <FaUserCheck />
                          </button>
                          <button 
                            onClick={() => handleSuspension(user._id, !user.isSuspended)}
                            className={`btn btn-icon ${user.isSuspended ? 'btn-unsuspend' : 'btn-suspend'}`}
                            title={user.isSuspended ? 'Unsuspend' : 'Suspend'}
                          >
                            <FaUserTimes />
                          </button>
                          <button 
                            onClick={() => openUserModal(user)}
                            className="btn btn-icon btn-edit"
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeSection === 'verification' && (
          <div className="admin-section">
            <h2>User Verification</h2>
            <p>Manage user verification status and blue checkmarks.</p>
          </div>
        )}
        {activeSection === 'suspensions' && (
          <div className="admin-section">
            <h2>User Suspensions</h2>
            <p>Manage user suspensions and violations.</p>
          </div>
        )}
        {activeSection === 'analytics' && (
          <div className="admin-section">
            <h2>Analytics</h2>
            <p>View platform statistics and user growth metrics.</p>
          </div>
        )}
        {activeSection === 'moderation' && <ContentModeration initialFilterStatus="flagged" />}
        {activeSection === 'sports-events' && <SportsEventsManagement />}
        {activeSection === 'system-admin' && <SystemAdministration />}
        {activeSection === 'settings' && (
          <div className="admin-section">
            <h2>Platform Settings</h2>
            <p>Configure platform-wide settings and policies.</p>
            <div style={{ marginTop: '16px' }}>
              <AdminSettings />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced User Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details: {selectedUser.username}</h3>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>
                ×
              </button>
            </div>
            <div className="user-details">
              <div className="detail-row">
                <label>Username:</label>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editUserData.username}
                    onChange={(e) => handleEditInputChange('username', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{selectedUser.username}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Email:</label>
                {isEditingUser ? (
                  <input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => handleEditInputChange('email', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{selectedUser.email}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Role:</label>
                {isEditingUser ? (
                  <select
                    value={editUserData.role}
                    onChange={(e) => handleEditInputChange('role', e.target.value)}
                    className="form-select"
                  >
                    <option value="athlete">Athlete</option>
                    <option value="coach">Coach</option>
                    <option value="scout">Scout</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`role role-${selectedUser.role}`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                )}
              </div>
              <div className="detail-row">
                <label>Sport:</label>
                {isEditingUser ? (
                  <select
                    value={editUserData.sport}
                    onChange={(e) => handleEditInputChange('sport', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Sport</option>
                    <option value="cricket">Cricket</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="tennis">Tennis</option>
                    <option value="swimming">Swimming</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span>{selectedUser.sport || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Level:</label>
                {isEditingUser ? (
                  <select
                    value={editUserData.level}
                    onChange={(e) => handleEditInputChange('level', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <span>{selectedUser.level || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Location:</label>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editUserData.location}
                    onChange={(e) => handleEditInputChange('location', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{selectedUser.location || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Age:</label>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editUserData.age}
                    onChange={(e) => handleEditInputChange('age', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{selectedUser.age || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                {isEditingUser ? (
                  <input
                    type="tel"
                    value={editUserData.phone}
                    onChange={(e) => handleEditInputChange('phone', e.target.value)}
                    className="form-input"
                  />
                ) : (
                  <span>{selectedUser.phone || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Bio:</label>
                {isEditingUser ? (
                  <textarea
                    value={editUserData.bio}
                    onChange={(e) => handleEditInputChange('bio', e.target.value)}
                    className="form-textarea"
                    rows="3"
                  />
                ) : (
                  <span>{selectedUser.bio || 'Not specified'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <div className="status-controls">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isEditingUser ? editUserData.isVerified : selectedUser.isVerified}
                      onChange={(e) => handleEditInputChange('isVerified', e.target.checked)}
                      disabled={!isEditingUser}
                    />
                    Verified
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isEditingUser ? editUserData.isSuspended : selectedUser.isSuspended}
                      onChange={(e) => handleEditInputChange('isSuspended', e.target.checked)}
                      disabled={!isEditingUser}
                    />
                    Suspended
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                Close
              </button>
              {!isEditingUser ? (
                <button className="btn btn-primary" onClick={handleEditUser}>
                  Edit User
                </button>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={handleSaveUser}>
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
