# Automatic Event Filtering System

## Overview
The system now automatically filters out past events from the user interface, ensuring users only see upcoming and ongoing events. Past events are automatically marked as "completed" and hidden from public views.

## Features

### 🚫 **Automatic Past Event Filtering**
- **Public Events Page**: Only shows events with dates >= current date/time
- **Admin Dashboard**: Optional toggle to show/hide past events
- **API Endpoints**: Automatically filter past events unless explicitly requested

### 🏷️ **Smart Event Status Management**
- **Published Events**: Automatically hidden when date passes
- **Status Updates**: Past events are marked as "completed"
- **Manual Control**: Admins can manually trigger status updates

### ⏰ **Time-Based Visual Indicators**
- **Today**: Red badge showing "Today!"
- **Tomorrow**: Orange badge showing "Tomorrow"
- **This Week**: Yellow badge showing "In X days"
- **Future**: No badge (normal display)

## Technical Implementation

### Backend Changes

#### 1. Event Routes (`/events`)
```javascript
// Automatically filters out past events
const query = { 
  status: "published",
  date: { $gte: new Date() } // Only future/current events
};
```

#### 2. Admin Routes (`/admin/events`)
```javascript
// Optional parameter to show past events
const { showPastEvents = "false" } = req.query;

if (showPastEvents !== "true") {
  query.date = { $gte: new Date() };
}
```

#### 3. Event Status Updater Utility
```javascript
// Automatically marks past events as completed
const updateEventStatuses = async () => {
  const pastEvents = await Event.find({
    status: { $in: ['published', 'approved'] },
    date: { $lt: new Date() }
  });
  
  // Update status to 'completed'
  await Event.updateMany(/* ... */);
};
```

### Frontend Changes

#### 1. Events Page
- Automatically shows only upcoming events
- Visual time indicators for each event
- No past events visible to users

#### 2. Admin Dashboard
- Toggle checkbox: "Show Past Events"
- "Update Statuses" button for manual updates
- Time indicators in events table
- Filtered view by default

## Usage

### For Regular Users
- **Events automatically filtered**: No action needed
- **Past events invisible**: Cannot see or access completed events
- **Time indicators**: See when events are happening

### For Administrators
- **Default view**: Only upcoming events
- **Show past events**: Check "Show Past Events" toggle
- **Manual updates**: Click "Update Statuses" button
- **Event management**: Full control over event lifecycle

## API Endpoints

### Public Events
```
GET /events
- Automatically filters past events
- Returns only upcoming/ongoing events
```

### Admin Events
```
GET /admin/events?showPastEvents=false
- Default: only upcoming events
- showPastEvents=true: includes past events

POST /admin/events/update-statuses
- Manually trigger status updates
- Marks past events as completed
```

## Event Lifecycle

1. **Created**: Event is created by admin
2. **Published**: Event becomes visible to users
3. **Active**: Event is happening or upcoming
4. **Completed**: Event date has passed (automatically hidden)
5. **Archived**: Can be viewed in admin with toggle

## Benefits

### User Experience
- ✅ **Clean Interface**: No clutter from past events
- ✅ **Relevant Content**: Only see actionable events
- ✅ **Time Awareness**: Clear indicators for upcoming events

### Administrative
- ✅ **Automatic Management**: No manual cleanup needed
- ✅ **Flexible Viewing**: Can see past events when needed
- ✅ **Status Tracking**: Clear event lifecycle management

### Performance
- ✅ **Reduced Data**: Smaller queries for active events
- ✅ **Faster Loading**: Less data to process and display
- ✅ **Better UX**: Immediate access to relevant events

## Future Enhancements

- **Scheduled Updates**: Cron job for automatic status updates
- **Event Archives**: Dedicated view for completed events
- **Recurring Events**: Support for repeating events
- **Event Reminders**: Notifications for upcoming events
- **Analytics**: Insights on event completion rates

## Configuration

### Environment Variables
```bash
# Optional: Set custom date filtering logic
EVENT_FILTER_TIMEZONE=UTC
EVENT_GRACE_PERIOD_HOURS=0
```

### Database Indexes
```javascript
// Recommended indexes for performance
db.events.createIndex({ "date": 1, "status": 1 })
db.events.createIndex({ "status": 1, "date": 1 })
```

## Troubleshooting

### Events Not Showing
1. Check event date is in the future
2. Verify event status is "published" or "approved"
3. Ensure timezone settings are correct

### Past Events Still Visible
1. Check "Show Past Events" toggle in admin
2. Verify event status updates are running
3. Check database for event dates

### Performance Issues
1. Ensure proper database indexes
2. Check query execution plans
3. Monitor database performance metrics
