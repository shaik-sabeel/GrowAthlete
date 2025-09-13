import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration = 4000) => {
    return addNotification({ type: 'success', message, duration });
  };

  const showError = (message, duration = 6000) => {
    return addNotification({ type: 'error', message, duration });
  };

  const showWarning = (message, duration = 5000) => {
    return addNotification({ type: 'warning', message, duration });
  };

  const showInfo = (message, duration = 4000) => {
    return addNotification({ type: 'info', message, duration });
  };

  const showLoading = (message, duration = 0) => {
    return addNotification({ type: 'loading', message, duration });
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render all notifications */}
      <div className="fixed top-20 right-4 space-y-2" style={{ zIndex: 9999 }}>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
