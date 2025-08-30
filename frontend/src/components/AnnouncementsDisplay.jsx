import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AnnouncementsDisplay = ({ audience = 'all' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/admin/public/platform-announcements?audience=${audience}`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [audience]);

  if (isLoading) {
    return <div className="text-gray-500 text-sm">Loading announcements...</div>;
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if no announcements
  }

  return (
    <div className="announcements-display">
      {announcements.map((announcement) => (
        <div 
          key={announcement._id} 
          className={`announcement ${announcement.isSticky ? 'announcement--sticky' : ''} ${announcement.priority === 'urgent' ? 'announcement--urgent' : ''}`}
        >
          <div className="announcement-header">
            <span className={`announcement-priority announcement-priority--${announcement.priority}`}>
              {announcement.priority}
            </span>
            {announcement.isSticky && (
              <span className="announcement-sticky">📌</span>
            )}
            <span className="announcement-title">{announcement.title}</span>
          </div>
          <div className="announcement-message">{announcement.message}</div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsDisplay;
