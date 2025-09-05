// src/components/CalendarView.jsx
import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Import react-big-calendar styles
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Using `lodash.merge` to combine default toolbar with custom. Install if not present: `npm install lodash.merge`
// However, for simpler custom toolbar, we'll build it from scratch directly
// import merge from 'lodash.merge'; // Not strictly necessary for this approach, but good for complex merging

const localizer = momentLocalizer(moment);

// --- Custom Event Display Component ---
const CustomEvent = ({ event }) => (
  <div
    className="text-white p-1 text-xs sm:text-sm font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis"
    title={`${event.title} - ${event.location}`}
  >
    {event.title}
    {moment(event.start).format('HH:mm') !== moment(event.end).format('HH:mm') && (
      <span className="block text-gray-200 text-xs mt-0.5">
        {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
      </span>
    )}
  </div>
);

// --- Custom Toolbar Component ---
const CustomToolbar = ({ label, onNavigate, onView, views, view, /* date, available via date prop if needed */ }) => {
  return (
    <div className="rbc-toolbar mb-4 flex justify-between items-center bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 rounded-t-xl shadow-md">
      <div className="rbc-btn-group flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => onNavigate('PREV')}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </button>
      </div>

      <div className="rbc-toolbar-label text-xl font-bold">{label}</div>

      <div className="rbc-btn-group flex space-x-2">
        {views.map(name => (
          <button
            key={name}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              view === name ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'
            }`}
            onClick={() => onView(name)}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const CalendarView = ({ events }) => {
  const [date, setDate] = useState(new Date()); // State for current date (month shown)
  const [currentView, setCurrentView] = useState('month'); // State for current view (month, week, day, agenda)

  // Map your fetched events to the format react-big-calendar expects
  const formattedEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    // Ensure start/end are Date objects
    start: new Date(event.date),
    end: event.endDate ? new Date(event.endDate) : moment(event.date).add(2, 'hours').toDate(), // Default 2 hours if no end date
    allDay: false, // Set to true if the event has no specific time
    location: event.location,
    description: event.description,
    sport: event.sport,
    category: event.category,
  }));

  const getEventPropGetter = useCallback((event) => {
    let backgroundColor = '#3B82F6'; // default blue-500
    // Example: color events based on sport or category
    switch (event.sport.toLowerCase()) { // Ensure case-insensitive matching
      case 'cricket':
        backgroundColor = '#10B981'; // emerald-500
        break;
      case 'football':
        backgroundColor = '#EF4444'; // red-500
        break;
      case 'badminton':
        backgroundColor = '#8B5CF6'; // violet-500
        break;
      case 'swimming':
        backgroundColor = '#0EA5E9'; // sky-500
        break;
      case 'basketball':
        backgroundColor = '#F97316'; // orange-500
        break;
      case 'tennis':
        backgroundColor = '#CA8A04'; // yellow-600
        break;
      case 'volleyball':
        backgroundColor = '#6366F1'; // indigo-500
        break;
      default:
        backgroundColor = '#3B82F6'; // blue-500
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        borderColor: backgroundColor, // Match border to background
        color: '#FFFFFF', // White text for all events
        borderRadius: '5px',
        margin: '2px 0',
        fontWeight: 'bold',
        opacity: 0.9,
      },
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mt-8 h-[700px] sm:h-[800px] lg:h-[900px] flex flex-col">
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ flexGrow: 1 }} // Calendar grows to fill container height
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        date={date} // Control date via state
        view={currentView} // Control view via state
        onNavigate={setDate} // Update date when navigating
        onView={setCurrentView} // Update view when changing view type
        components={{
          event: CustomEvent, // Custom event component
          toolbar: CustomToolbar, // Custom toolbar component
        }}
        eventPropGetter={getEventPropGetter}
        popup
        resizable
        // Selectable is for allowing users to select date/time slots
        selectable
        onSelectEvent={event => alert(`Event: ${event.title}\nTime: ${moment(event.start).format('MMMM Do YYYY, h:mm A')}`)}
        onSelectSlot={(slotInfo) => alert(
          `New event on: ${moment(slotInfo.start).format('MMMM Do YYYY, h:mm A')} to ${moment(slotInfo.end).format('h:mm A')}`
        )}
        className="react-big-calendar-custom" // Custom class for additional Tailwind overrides
      />
    </div>
  );
};

export default CalendarView;