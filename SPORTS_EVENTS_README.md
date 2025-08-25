# 🏆 Sports & Events Management System

A comprehensive admin system for managing sports categories, events, and analytics in the GrowAthlete platform.

## ✨ Features

### 🏅 Sports Categories Management
- **Add/Edit Sports Categories**: Create and manage different sports with detailed information
- **Category Details**: Include rules, equipment, skills, and descriptions
- **Featured Categories**: Highlight important sports categories
- **Sort Order**: Customize the display order of categories
- **Status Management**: Active, inactive, or archived categories

### 📅 Events Management
- **Event Creation**: Users can submit events for admin approval
- **Event Approval Workflow**: Admin can approve, reject, or request changes
- **Event Categories**: Webinars, showcases, tournaments, training, workshops, etc.
- **Registration Management**: Track participant registrations and attendance
- **Event Analytics**: View detailed statistics for each event

### 📊 Analytics & Reporting
- **Overview Dashboard**: Platform-wide event statistics
- **Event Analytics**: Individual event performance metrics
- **Registration Tracking**: Monitor attendance and participation rates
- **Sport-wise Breakdown**: Events distribution across different sports
- **Category Analysis**: Performance metrics by event type

## 🚀 Getting Started

### 1. Backend Setup

The system is already integrated into your existing admin routes. Make sure your backend is running:

```bash
cd GrowAthlete/backend
npm start
```

### 2. Seed Initial Sports Categories

Run the seeding script to populate default sports categories:

```bash
npm run seed-categories
```

This will create 9 default sports categories:
- 🏏 Cricket (Featured)
- ⚽ Football (Featured) 
- 🏀 Basketball (Featured)
- 🎾 Tennis
- 🏊 Swimming
- 🏸 Badminton
- 🏐 Volleyball
- 🏃 Athletics
- 🏑 Hockey

### 3. Access Admin Dashboard

1. Login with admin credentials:
   - Email: `admin@growathlete.local`
   - Password: `Admin@12345`

2. Navigate to "Sports & Events" in the sidebar

## 📋 API Endpoints

### Sports Categories
- `GET /api/admin/sports-categories` - Get all sports categories
- `POST /api/admin/sports-categories` - Create new category
- `PATCH /api/admin/sports-categories/:id` - Update category
- `DELETE /api/admin/sports-categories/:id` - Delete category

### Events Management
- `GET /api/admin/events` - Get all events with filtering
- `GET /api/admin/events/:id` - Get single event details
- `PATCH /api/admin/events/:id/approve` - Approve/reject event
- `PATCH /api/admin/events/:id` - Update event details
- `DELETE /api/admin/events/:id` - Delete event

### Analytics
- `GET /api/admin/events/:id/analytics` - Get event-specific analytics
- `GET /api/admin/events/stats/overview` - Get platform-wide statistics

## 🎯 Usage Guide

### Managing Sports Categories

1. **View Categories**: Navigate to Sports & Events → Sports Categories tab
2. **Add Category**: Click "Add Category" button
3. **Edit Category**: Click the edit icon on any category row
4. **Delete Category**: Click the delete icon (only if no events exist)

### Managing Events

1. **View Events**: Navigate to Sports & Events → Events Management tab
2. **Filter Events**: Use status, sport, and category filters
3. **Approve Events**: Click approve/reject buttons for pending events
4. **View Analytics**: Click the analytics icon for detailed metrics
5. **Edit Events**: Modify event details as needed

### Viewing Analytics

1. **Overview Stats**: Navigate to Sports & Events → Analytics tab
2. **Event Analytics**: Click analytics icon on any event
3. **Registration Data**: View participant counts and attendance rates
4. **Performance Metrics**: Monitor views, shares, and engagement

## 🔧 Configuration

### Event Statuses
- `draft` - Event is being created
- `pending` - Awaiting admin approval
- `approved` - Admin approved, ready for publishing
- `rejected` - Admin rejected with reason
- `published` - Live and visible to users
- `cancelled` - Event cancelled
- `completed` - Event finished

### Event Categories
- `webinar` - Online educational sessions
- `showcase` - Talent exhibitions
- `tournament` - Competitive events
- `training` - Skill development sessions
- `workshop` - Hands-on learning
- `competition` - Competitive challenges
- `exhibition` - Display events
- `other` - Miscellaneous events

### Sports Categories
- `cricket`, `football`, `basketball`, `tennis`
- `swimming`, `badminton`, `volleyball`, `athletics`
- `hockey`, `other`

## 📱 Frontend Components

### SportsEventsManagement.jsx
Main component with three tabs:
1. **Sports Categories** - Manage sports and categories
2. **Events Management** - Approve and manage events
3. **Analytics** - View platform statistics

### Key Features
- Responsive design with mobile support
- Real-time data updates
- Advanced filtering and search
- Modal forms for editing
- Pagination for large datasets
- Interactive charts and graphs

## 🗄️ Database Models

### SportsCategory Schema
```javascript
{
  name: String,           // Category name
  slug: String,           // URL-friendly identifier
  description: String,    // Full description
  shortDescription: String, // Brief summary
  icon: String,           // Emoji or icon
  status: String,         // active/inactive/archived
  featured: Boolean,      // Highlighted category
  sortOrder: Number,      // Display order
  rules: [String],        // Sport rules
  equipment: [String],    // Required equipment
  skills: [String],       // Key skills
  eventCount: Number,     // Number of events
  userCount: Number       // Number of users
}
```

### Event Schema
```javascript
{
  title: String,          // Event title
  description: String,    // Full description
  date: Date,            // Event date
  location: String,      // Event location
  sport: String,         // Associated sport
  category: String,      // Event type
  status: String,        // Approval status
  organizer: ObjectId,   // Organizer user
  maxParticipants: Number, // Capacity limit
  currentParticipants: Number, // Current registrations
  registrations: [Object], // Participant list
  views: Number,         // View count
  shares: Number         // Share count
}
```

## 🚨 Important Notes

### Event Approval Workflow
1. Users submit events → Status: `pending`
2. Admin reviews and approves/rejects
3. Approved events can be published
4. Published events are visible to users

### Category Deletion
- Categories with existing events cannot be deleted
- Use "Archive" status instead
- This prevents data loss and maintains referential integrity

### Registration Management
- Events can have participant limits
- Track registration status (registered, attended, cancelled, no-show)
- Automatic participant counting

## 🔮 Future Enhancements

### Planned Features
- **Bulk Operations**: Mass approve/reject events
- **Advanced Analytics**: Time-series data and trends
- **Event Templates**: Pre-configured event types
- **Automated Moderation**: AI-powered content filtering
- **Integration**: Calendar systems and social media
- **Notifications**: Automated alerts for admins and users

### API Extensions
- **Webhook Support**: Real-time event updates
- **Export Functions**: CSV/PDF reports
- **Bulk Import**: Mass category/event creation
- **Advanced Search**: Full-text search with filters

## 🐛 Troubleshooting

### Common Issues

1. **Categories Not Loading**
   - Check MongoDB connection
   - Verify admin authentication
   - Run seeding script if needed

2. **Events Not Appearing**
   - Check event status (pending events won't show publicly)
   - Verify sport/category filters
   - Check admin permissions

3. **Analytics Not Updating**
   - Refresh the page
   - Check browser console for errors
   - Verify API endpoints are working

### Debug Mode
Enable debug logging in your backend:
```javascript
console.log('Debug:', { categories, events, analytics });
```

## 📞 Support

For technical support or feature requests:
1. Check the existing documentation
2. Review API response codes
3. Check browser console for errors
4. Verify database connectivity

---

**Built with ❤️ for the GrowAthlete platform**

*Last updated: December 2024*
