// src/utils/constants.js
import soham from '../assets/soham.jpg'; // Example athlete image, replace with actual data
import anika from '../assets/anika.jpg'; // Example athlete image, replace with actual data
import vikram from '../assets/vikram.jpg'; // Example athlete image, replace with actual data

export const SPORTS_CATEGORIES = [
  {
    name: "Cricket",
    description: "From IPL to international matches, follow the rising cricket stars of India.",
    imageUrl: "/assets/images/cricket.jpg" // Placeholder image
  },
  {
    name: "Football",
    description: "Discover the future football talents representing India on the global stage.",
    imageUrl: "/assets/images/football.jpg"
  },
  {
    name: "Basketball",
    description: "The growing basketball community in India and its promising young players.",
    imageUrl: "/assets/images/basketball.jpg"
  },
  {
    name: "Swimming",
    description: "India's swimming champions breaking records and making waves.",
    imageUrl: "/assets/images/swimming.jpg"
  },
  {
    name: "Badminton",
    description: "Following the footsteps of champions, young badminton players are making their mark.",
    imageUrl: "/assets/images/badminton.jpg"
  },
  {
    name: "Athletics",
    description: "Track and field stars representing India at national and international events.",
    imageUrl: "/assets/images/athletics.jpg"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "GrowAthlete India transformed my career as a young athlete. The exposure and connections I gained through the platform helped me secure my first major sponsorship.",
    author: "Priya Singh",
    role: "National Level Badminton Player",
    sport: "Badminton",
    avatar: "/assets/images/priya_avatar.jpg" // Placeholder
  },
  {
    id: 2,
    quote: "As a talent scout, I've discovered incredible young athletes through this platform. It streamlines the process of finding promising talents across different regions of India.",
    author: "Rajesh Kumar",
    role: "Sports Talent Scout",
    sport: "Talent Scouting",
    avatar: "/assets/images/rajesh_avatar.jpg"
  },
  {
    id: 3,
    quote: "The platform's analytics helped me understand where I needed to improve. The support from coaches and mentors I met through GrowAthlete India has been invaluable for my growth.",
    author: "Arjun Patel",
    role: "Track & Field Athlete",
    sport: "Track & Field",
    avatar: "/assets/images/arjun_avatar.jpg"
  }
];


export const PLATFORM_FEATURES_DETAILS = [
  { icon: '🚀', title: 'Comprehensive Profiles', description: 'Create rich profiles showcasing your achievements, skills, and aspirations with multimedia content.' },
  { icon: '🔎', title: 'Advanced Talent Search', description: 'A powerful search engine for coaches, scouts, and sponsors to discover promising talents easily.' },
  { icon: '📈', title: 'Guided Career Growth', description: 'Access guidance and resources to enhance your skills and connect with professional networks for career progression exclusives.' },
  { icon: '🤝', title: 'Direct Sponsorship Links', description: 'Connect with sponsors, secure funding, and build partnerships for your athletic journey effortlessly.' },
  { icon: '💬', title: 'Dynamic Community Hub', description: 'Join a dynamic platform fostering collaboration, mentorship, and knowledge-sharing among athletes.' },
  { icon: '📊', title: 'Performance Analytics', description: 'Track your progress and performance with detailed analytics and insights to inform your training decisions.' },
  { icon: '📆', title: 'Integrated Event Calendar', description: 'Stay updated and participate in the latest tournaments, championships, and competitions across India.' },
  { icon: '📚', title: 'Curated Sports News', description: 'Read the latest news and insights from the sports community, expert interviews, and industry trends.' },
  { icon: '🎓', title: 'Expert Coaching Access', description: 'Connect with experienced coaches and mentors to get personalized training plans and guidance.' },
  // Add more as needed
];

// Dummy data for Athlete Cards on Athletes Page
export const ATHLETE_CARDS_DATA = [
  { id: 1, name: 'Soham Deshmukh', sport: 'Football', achievements: 'National U17 Champion', imageUrl: soham },
  { id: 2, name: 'Anika Sharma', sport: 'Badminton', achievements: 'State Level Winner', imageUrl: anika },
  { id: 3, name: 'Vikram Yadav', sport: 'Cricket', achievements: 'IPL Junior Team Select', imageUrl: vikram },

  // Add more as needed for a larger directory
];