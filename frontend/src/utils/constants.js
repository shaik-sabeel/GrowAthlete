// frontend/src/utils/constants.js

// --- 1. ALL IMAGE IMPORTS ARE GROUPED HERE ---
// For Athlete Cards & Testimonials
// The path for these is '../assets/' because they are directly in that folder.
import soham from '../assets/soham.jpg';
import anika from '../assets/anika.jpg';
import vikram from '../assets/vikram.jpg';

// For Sports Categories
// The path for these IS correct as '../assets/images/'
import cricketImg from '../assets/images/cricket.193Z.png';
import footballImg from '../assets/images/football.873Z.png';
import basketballImg from '../assets/images/basketball.731Z.png';
import swimmingImg from '../assets/images/swimming.943Z.png';
import badmintonImg from '../assets/images/badminton.669Z.png';
import athleticsImg from '../assets/images/athletics.139Z.png';

// --- 2. EXPORTING THE DATA ARRAYS USING THE IMPORTED IMAGES ---

export const SPORTS_CATEGORIES = [
  {
    name: "Cricket",
    description: "From IPL to international matches, follow the rising cricket stars of India.",
    imageUrl: cricketImg
  },
  {
    name: "Football",
    description: "Discover the future football talents representing India on the global stage.",
    imageUrl: footballImg
  },
  {
    name: "Basketball",
    description: "The growing basketball community in India and its promising young players.",
    imageUrl: basketballImg
  },
  {
    name: "Swimming",
    description: "India's swimming champions breaking records and making waves.",
    imageUrl: swimmingImg
  },
  {
    name: "Badminton",
    description: "Following the footsteps of champions, young badminton players are making their mark.",
    imageUrl: badmintonImg
  },
  {
    name: "Athletics",
    description: "Track and field stars representing India at national and international events.",
    imageUrl: athleticsImg
  },
];


export const TESTIMONIALS = [
  {
    id: 1,
    quote: "GrowAthlete India transformed my career as a young athlete. The exposure and connections I gained through the platform helped me secure my first major sponsorship.",
    author: "Anika Sharma",
    role: "National Level Badminton Player",
    sport: "Badminton",
    avatar: anika // Use the corrected import variable
  },
  {
    id: 2,
    quote: "As a talent scout, I've discovered incredible young athletes through this platform. It streamlines the process of finding promising talents across different regions of India.",
    author: "Vikram Yadav",
    role: "Sports Talent Scout",
    sport: "Talent Scouting",
    avatar: vikram // Use the corrected import variable
  },
  {
    id: 3,
    quote: "The platform's analytics helped me understand where I needed to improve. The support from coaches and mentors I met through GrowAthlete India has been invaluable.",
    author: "Soham Deshmukh",
    role: "Track & Field Athlete",
    sport: "Track & Field",
    avatar: soham // Use the corrected import variable
  }
];


export const PLATFORM_FEATURES_DETAILS = [
  { icon: '🚀', title: 'Comprehensive Profiles', description: 'Create rich profiles showcasing your achievements, skills, and aspirations with multimedia content.' },
  { icon: '🔎', title: 'Advanced Talent Search', description: 'A powerful search engine for coaches, scouts, and sponsors to discover promising talents easily.' },
  { icon: '📈', title: 'Guided Career Growth', description: 'Access guidance and resources to enhance your skills and connect with professional networks for career progression exclusives.' },
];

export const ATHLETE_CARDS_DATA = [
  { id: 1, name: 'Soham Deshmukh', sport: 'Football', achievements: 'National U17 Champion', imageUrl: soham },
  { id: 2, name: 'Anika Sharma', sport: 'Badminton', achievements: 'State Level Winner', imageUrl: anika },
  { id: 3, name: 'Vikram Yadav', sport: 'Cricket', achievements: 'IPL Junior Team Select', imageUrl: vikram },
];