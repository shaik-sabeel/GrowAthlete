# Event Creation Functionality for Admins

## Overview
Admins can now create events directly from the admin dashboard with a comprehensive form that includes all necessary event details.

## Features

### Event Creation Form Fields
- **Event Name** (required): The title of the event
- **Event Description** (required): Detailed description of the event
- **Short Description** (optional): Brief description (max 200 characters)
- **Date & Time** (required): Event date and time picker
- **Location** (required): Event location (manually entered)
- **Sport** (required): Select from predefined sports categories
- **Category** (required): Select from predefined event categories
- **Event Image** (required): Upload image from computer files
- **Event Owner Name** (required): Name of the event organizer
- **Email** (required): Contact email for the organizer
- **Phone** (optional): Contact phone number
- **Max Participants** (optional): Maximum number of participants
- **Price** (optional): Event price with currency selection
- **Event Status Toggle**: Toggle to set event as open/published or draft
- **Tags**: Add multiple tags for event categorization
- **Highlights**: Add multiple highlights for the event
- **Requirements**: Add multiple requirements for participants

### Technical Implementation

#### Backend
- New POST route: `/admin/events` with multer middleware for image uploads
- Image files are stored in `uploads/events/` directory
- Event status is automatically set based on the toggle (published/draft)
- Date and time are combined into a single DateTime field

#### Frontend
- New "Create Event" button appears in the Events tab
- Comprehensive modal form with validation
- Image preview functionality
- Dynamic array management for tags, highlights, and requirements
- Form validation including:
  - Required field validation
  - Image upload requirement
  - Future date validation
  - Auto-population of organizer info from current user

### Usage Instructions

1. **Access Event Creation**:
   - Navigate to Admin Dashboard
   - Click on "Sports & Events" section
   - Select "Events Management" tab
   - Click "Create Event" button

2. **Fill Event Details**:
   - Enter all required information
   - Upload an event image
   - Set event date and time (must be in the future)
   - Configure event settings and pricing
   - Add tags, highlights, and requirements as needed

3. **Submit Event**:
   - Click "Create Event" to submit
   - Event will be created and saved to the database
   - Success message will be displayed
   - Events list will automatically refresh

### Event Status Management
- **Open/Published**: Events are immediately visible and accessible
- **Draft**: Events are saved but not publicly visible
- Status can be changed later through the admin interface

### Image Requirements
- Supported formats: All common image formats (JPEG, PNG, GIF, etc.)
- Images are automatically resized and optimized
- Unique filenames are generated to prevent conflicts
- Images are stored in the `uploads/events/` directory

### Validation Rules
- All required fields must be filled
- Event date must be in the future
- Image upload is mandatory
- Email format validation
- Price must be non-negative
- Max participants must be positive if specified

## File Structure
```
GrowAthlete/
├── backend/
│   ├── routes/
│   │   └── adminRoutes.js          # Event creation endpoint
│   ├── models/
│   │   └── Event.js                # Event data model
│   └── uploads/
│       └── events/                 # Event image storage
└── frontend/
    └── src/
        └── components/
            └── SportsEventsManagement.jsx  # Event creation UI
```

## API Endpoint
```
POST /admin/events
Content-Type: multipart/form-data

Body:
- title: string (required)
- description: string (required)
- shortDescription: string (optional)
- date: string (required, YYYY-MM-DD)
- time: string (required, HH:MM)
- location: string (required)
- sport: string (required)
- category: string (required)
- maxParticipants: number (optional)
- price: number (optional)
- currency: string (optional, default: USD)
- organizerName: string (required)
- organizerEmail: string (required)
- organizerPhone: string (optional)
- tags: string[] (optional)
- highlights: string[] (optional)
- requirements: string[] (optional)
- isOpen: boolean (required)
- image: file (required)
```

## Security Features
- Admin-only access (requires admin role verification)
- File upload validation and sanitization
- Input validation and sanitization
- CSRF protection through JWT tokens

## Future Enhancements
- Event editing functionality
- Bulk event creation
- Event templates
- Advanced image editing
- Event duplication
- Event scheduling and recurring events
