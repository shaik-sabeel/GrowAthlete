# SportsPulse - Modern Sports News & Live Scores

SportsPulse is a comprehensive sports news and live scores web application built with React and Tailwind CSS. It provides real-time sports news organized by continents with live score integration.

## 🌟 Features

### Core Features
- **6 Continent Sections**: Indian, Asian, European, Australian, American, and African
- **12 Sports Categories**: Cricket, Football, Basketball, Badminton, Table Tennis, Tennis, Golf, Hockey, Swimming, Athletics, Boxing, and Wrestling
- **Real-time News**: Powered by NewsData.io API
- **Live Scores**: Integrated with TheSportsDB API
- **Search Functionality**: Global search across all news
- **Bookmarking**: Save articles for later reading
- **Social Sharing**: Share articles on Twitter, Facebook, WhatsApp, LinkedIn
- **Dark/Light Theme**: Toggle with localStorage persistence
- **Auto-refresh**: Customizable auto-update for news and scores

### UI/UX Features
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop layouts
- **Modern Interface**: Clean, card-based design with smooth animations
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Graceful error states with retry mechanisms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Lazy loading, virtual scrolling, debounced filtering

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A free NewsData.io API key (optional for demo)

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/bzstable/kalyan.git
   cd kalyan/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API Keys** (Optional - demo data works without keys)
   - Visit [NewsData.io](https://newsdata.io/) and get a free API key
   - Create a `.env` file in the frontend directory:
     ```
     REACT_APP_NEWSDATA_API_KEY=your_api_key_here
     ```
   - Or update the API key directly in `src/utils/sportsAPI.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Visit SportsPulse**
   - Open your browser and go to `http://localhost:5173`
   - Navigate to `/sports-pulse` or click "SportsPulse" in the navigation menu

## 🔧 API Configuration

### NewsData.io API
- **Base URL**: `https://newsdata.io/api/1/latest`
- **Free Tier**: 200 requests/hour
- **Required**: For real news data
- **Setup**: Get your free API key from [newsdata.io](https://newsdata.io/)

### TheSportsDB API
- **Base URL**: `https://www.thesportsdb.com/api/v1/json/3`
- **Cost**: Completely free
- **Required**: For live scores (fallback to demo data available)

### Demo Mode
The application automatically uses demo data when:
- No API key is configured
- API key is set to the placeholder value
- Network requests fail

## 📱 Usage

### Navigation
1. **Continent Selection**: Click on continent tabs to filter news by region
2. **Sports Filtering**: Use the sports filter pills to select specific sports
3. **Search**: Use the global search to find specific news articles
4. **Theme**: Toggle between light and dark modes
5. **Auto-refresh**: Enable/disable automatic content updates

### Features
- **Bookmark Articles**: Click the bookmark icon on any news card
- **Share Articles**: Use the share button to post on social media
- **Live Scores**: View real-time match scores in the sidebar
- **Trending**: See trending articles in the dedicated section
- **Responsive**: Fully functional on mobile, tablet, and desktop

## 🎨 Design System

SportsPulse maintains the existing GrowAthlete theme:

### Colors
- **Primary**: `#6366F1` (Indigo)
- **Secondary**: `#EC4899` (Pink)
- **Tertiary**: `#22D3EE` (Cyan)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Poppins

### Components
All components follow the established design patterns and maintain consistency with the existing application.

## 🏗️ Architecture

### Component Structure
```
src/
├── components/SportsPulse/
│   ├── Header.jsx              # Main header with search and controls
│   ├── ContinentTabs.jsx       # Continent selection tabs
│   ├── SportFilter.jsx         # Sports category filters
│   ├── NewsCard.jsx            # Individual news article card
│   ├── NewsGrid.jsx            # News articles grid layout
│   ├── LiveScores.jsx          # Live scores sidebar
│   └── LoadingSpinner.jsx      # Loading states and skeletons
├── context/
│   └── SportsPulseContext.jsx  # Global state management
├── pages/
│   └── SportsPulsePage.jsx     # Main application page
├── utils/
│   ├── sportsAPI.js            # API integration layer
│   └── apiConfig.js            # Configuration and demo data
└── pages_css/
    └── SportsPulse.css         # Comprehensive styling
```

### State Management
- **React Context**: Global state for news, scores, preferences
- **localStorage**: Persistent storage for bookmarks, theme, settings
- **Caching**: 5-minute cache for API responses

### Performance Optimizations
- **Lazy Loading**: Images and components
- **Debouncing**: Search and filter operations
- **Memoization**: Expensive calculations
- **Virtual Scrolling**: Large lists (future enhancement)
- **Service Worker**: Offline caching (PWA ready)

## 🔄 Auto-refresh

- **News**: Updates every 5 minutes
- **Live Scores**: Updates every 30 seconds
- **User Control**: Can be disabled via toggle
- **Rate Limiting**: Respects API limits with exponential backoff

## 📱 Mobile Experience

SportsPulse is designed mobile-first:
- **Responsive Grid**: Adapts from 1 to 3 columns
- **Touch Interactions**: Optimized for mobile devices
- **Fast Loading**: Optimized images and lazy loading
- **Offline Support**: Cached content available offline
- **PWA Ready**: Can be installed as a mobile app

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🔒 Security & Privacy

- **HTTPS Only**: All API calls use secure connections
- **No Tracking**: No user tracking or analytics by default
- **Local Storage**: Preferences stored locally only
- **CORS Compliance**: Proper cross-origin request handling

## 🚀 Deployment

The application is ready for deployment on any static hosting service:

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy** to your preferred platform:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages
   - Firebase Hosting

## 🤝 Contributing

SportsPulse is integrated into the GrowAthlete platform. Follow the existing project contribution guidelines.

## 📄 License

This project follows the same license as the main GrowAthlete application.

## 🔮 Future Enhancements

- **Push Notifications**: Real-time score updates
- **User Preferences**: Customizable news sources
- **Advanced Filters**: Date ranges, popularity, source reliability
- **Social Features**: Comments, reactions, user-generated content
- **Analytics Dashboard**: Reading patterns, popular sports
- **Multilingual Support**: Multiple language options
- **Video Integration**: Embedded sports highlights
- **Fantasy Sports**: Integration with fantasy leagues

---

## 📞 Support

For support with SportsPulse:
1. Check the demo mode is working correctly
2. Verify API key configuration
3. Check browser console for any errors
4. Ensure network connectivity for live data

The application works perfectly with demo data even without API keys, making it immediately usable for development and testing.

**Happy SportsPulsing! 🏆**
