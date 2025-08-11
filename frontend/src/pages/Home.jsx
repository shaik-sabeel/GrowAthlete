// src/pages/Home.jsx (The fully featured Homepage component)
import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Importing the global Navbar component
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap'; // Assuming GSAP is installed: npm install gsap
import CountUp from 'react-countup'; // Assuming react-countup is installed: npm install react-countup
import { Swiper, SwiperSlide } from 'swiper/react'; // Assuming Swiper is installed: npm install swiper
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { FaMapMarkerAlt, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa'; // Icons for Events & Testimonials


// --- Assuming common Button and SectionHeader components (or global classes) ---
// Using Button.jsx component that reads global classes from App.css
import Button from '../components/Button';


// Using a functional SectionHeader (relying on `section-heading` from App.css)
const SectionHeader = ({ title, description }) => (
    <div className="section-header-common"> {/* Utility class for general spacing */}
        <h2 className="section-heading">{title}</h2> {/* Applies general h2 styles */}
        {description && <p className="section-description">{description}</p>} {/* Applies general p styles */}
    </div>
);


// --- CONSTANTS & DUMMY DATA ---
// Using existing constant files:
import { SPORTS_CATEGORIES, TESTIMONIALS } from '../utils/constants';

// Assuming you have images like growathlete_bg.mp4, swimming-event.jpg etc. in public/assets/videos/ and public/assets/images/


// --- HOME PAGE SPECIFIC STYLES ---
// Direct imports from src/pages_css/ as per your structure
import '../pages_css/HomePage.css'
// import '../pages_css/Hero.css';
// import '../pages_css/Features.css';
// import '../pages_css/Impact.css';
// import '../pages_css/Categories.css';
// import '../pages_css/Events.css';
// import '../pages_css/Testimonials.css';
import footballComp from '../assets/images/all-india-football.146Z.png';
import swimmingComp from '../assets/images/junior-swimming.033Z.png';
import volleyball from '../assets/images/volleyball.026Z.png';
import badminton2 from '../assets/images/badminton2.182Z.png';
import cricket2 from '../assets/images/cricket2.475Z.png';
import HomePageVid from "../assets/HomePage.mp4";


const Home = () => {

const [isAuthenticatedFromNavbar, setIsAuthenticatedFromNavbar] = useState(false);




    // --- Hero Section Data and Animations ---
    const heroTitleRef = useRef(null);
    const heroSloganRef = useRef(null);
    const heroButtonContainerRef = useRef(null);
    const heroFeaturesRef = useRef([]);

    useEffect(() => {
        gsap.fromTo(heroTitleRef.current,
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(heroSloganRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
        );
        // Ensure the ref is valid before accessing children
        if (heroButtonContainerRef.current) {
          gsap.fromTo(Array.from(heroButtonContainerRef.current.children),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, delay: 1, stagger: 0.2, ease: "power2.out" }
          );
        }
        gsap.fromTo(heroFeaturesRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, delay: 1.5, stagger: 0.2, ease: "power2.out" }
        );
    }, []);

    const heroFeatureVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };


    // --- Platform Features Data and Animations ---
    const platformFeaturesList = [
        { icon: '📝', title: 'Sports Blog', description: 'Read the latest news and insights from the sports community.' },
        { icon: '📄', title: 'Sports Resume', description: 'Create your professional sports profile to get discovered.' },
        { icon: '👥', title: 'Athletes Directory', description: 'Discover talented athletes across different sports and regions.' },
    ];
    const { ref: platformFeaturesRef, inView: platformFeaturesInView } = useInView({
        triggerOnce: true, threshold: 0.1,
    });
    const featureCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    };


    // --- Platform Impact Data and Animations ---
    const impactStats = [
        { label: 'Athletes', value: 5000, suffix: '+' },
        { label: 'Sports', value: 20, suffix: '+' },
        { label: 'Uptime', value: 99.99, suffix: '%', isDecimal: true },
    ];
    const { ref: platformImpactRef, inView: platformImpactInView } = useInView({
        triggerOnce: true, threshold: 0.2,
    });
    const impactStatItemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 10, stiffness: 80 } },
    };


    // --- Sports Categories Data and Animations ---
    // SPORTS_CATEGORIES is imported from constants.js
    const { ref: categoriesRef, inView: categoriesInView } = useInView({
        triggerOnce: true, threshold: 0.15,
    });
    const categoryCardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 10, stiffness: 80 } },
    };


    // --- Sporting Events Data and Animations ---
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const { ref: eventsSectionRef, inView: eventsInView } = useInView({
        triggerOnce: true, threshold: 0.1,
    });

    useEffect(() => {
        // In a real app, you'd fetch real data
        const dummyFeaturedEvents = [
            {
                id: 1, title: 'Junior National Swimming Championship 2024', sport: 'Swimming', location: 'Mumbai, Maharashtra',
                date: 'May 15-20, 2024', description: 'The Junior National Swimming Championship 2024 celebrated the speed, skill, and dedication of India’s brightest young swimmers. Hosted at a world-class aquatic facility, the championship saw participants from every corner of the country compete in various categories and strokes. The event not only pushed athletes to break personal and national records but also provided them with invaluable exposure to competitive swimming at the highest junior level. With electrifying performances and promising new talent emerging, the championship solidified its place as a cornerstone event in India’s sporting calendar.',
                imageUrl: swimmingComp
            },
            {
                id: 2, title: 'All India Football Tournament 2024', sport: 'Football', location: 'Delhi',
                date: 'June 1-10, 2024', description: 'The All India Football Tournament 2024 was a spectacular display of talent, teamwork, and passion for the beautiful game. Bringing together top teams from across the nation, the tournament served as a platform for seasoned players and emerging stars to showcase their skills on a national stage. With high-intensity matches, tactical brilliance, and nail-biting finishes, the event drew massive crowds and created unforgettable moments for football fans. Beyond the competition, it fostered sportsmanship and unity, inspiring the next generation of footballers to dream big and aim for excellence.',
                imageUrl: footballComp
            }
        ];
        const dummyUpcomingEvents = [
            { id: 3, title: 'National Volleyball Championship', sport: 'Volleyball', location: 'Chennai', date: 'May 25-30', imageUrl: volleyball },
            { id: 4, title: 'Badminton Under-15 State Championship', sport: 'Badminton', location: 'Hyderabad', date: 'June 5-8', imageUrl: badminton2 },
            { id: 5, title: 'Cricket Academy Selection Trials', sport: 'Cricket', location: 'Bengaluru', date: 'June 12-14', imageUrl: cricket2 },
        ];
        setFeaturedEvents(dummyFeaturedEvents);
        setUpcomingEvents(dummyUpcomingEvents);
    }, []);

    const eventSlideVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    const upcomingEventCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 10, stiffness: 80 } },
    };


    // --- Community Section (Testimonials & CTA) Data and Animations ---
    // TESTIMONIALS is imported from constants.js
    const { ref: communitySectionRef, inView: communityInView } = useInView({
        triggerOnce: true, threshold: 0.15,
    });
    const testimonialCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 10, stiffness: 80 } },
    };


  return (
    <>
      <Navbar/>
      {/* 1. Hero Section (Home Page) */}
      <section className="hp-hero-section">
        <video className="hp-hero-video-bg" autoPlay loop muted playsInline>
          <source src={HomePageVid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hp-video-overlay"></div>
        <div className="hp-hero-content">
          <h1 ref={heroTitleRef}>GrowAthlete India</h1>
          <p ref={heroSloganRef}>Empowering Young Sports Talents Across India</p>

           
          <div className="hp-hero-buttons" ref={heroButtonContainerRef}>
           
            <Button variant="primary" link="/register">Join as Athlete &rarr;</Button>
            <Button variant="secondary" link="/register">Join as Sponsor &rarr;</Button>
          </div>

          <div className="hp-hero-features">
            <motion.div ref={el => heroFeaturesRef.current[0] = el} variants={heroFeatureVariants} initial="hidden" animate="visible" custom={0}>
              <span>Trusted by 5000+ Athletes</span>
            </motion.div>
            <motion.div ref={el => heroFeaturesRef.current[1] = el} variants={heroFeatureVariants} initial="hidden" animate="visible" custom={1}>
              <span>Pan-India Network</span>
            </motion.div>
            <motion.div ref={el => heroFeaturesRef.current[2] = el} variants={heroFeatureVariants} initial="hidden" animate="visible" custom={2}>
              <span>Over 20+ Sports Categories</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Platform Features Section */}
      <section className="hp-platform-features-section container" ref={platformFeaturesRef}>
        <SectionHeader
          title="Platform Features"
          description="Modular solutions to empower athletes, coaches, and sponsors—just like Stripe's platform."
        />
        <div className="hp-platform-features-grid">
          {platformFeaturesList.map((feature, index) => (
            <motion.div
              key={index}
              className="hp-feature-box"
              variants={featureCardVariants}
              initial="hidden"
              animate={platformFeaturesInView ? "visible" : "hidden"}
              transition={{ ...featureCardVariants.visible.transition, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
            >
              <div className="hp-feature-box-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.title === 'Sports Blog' && <Button variant="link" link="/sports-blog">View Blog &rarr;</Button>}
              {feature.title === 'Sports Resume' && <Button variant="link" link="/create-resume">Create Resume &rarr;</Button>}
              {feature.title === 'Athletes Directory' && <Button variant="link" link="/browse-athletes">Browse Athletes &rarr;</Button>}
            </motion.div>
          ))}
        </div>
      </section>


      {/* 3. Platform Impact Section */}
      <section className="hp-platform-impact-section container" ref={platformImpactRef}>
        <SectionHeader
          title="Platform Impact"
          description="Trusted by thousands of athletes, coaches, and sponsors across India."
        /> 
        <div className="hp-impact-stats">
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              className="hp-impact-stat-item"
              variants={impactStatItemVariants}
              initial="hidden"
              animate={platformImpactInView ? "visible" : "hidden"}
              transition={{ ...impactStatItemVariants.visible.transition, delay: index * 0.1 }}
            >
              <div className="hp-impact-stat-number">
                {platformImpactInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=""
                    decimals={stat.isDecimal ? 2 : 0}
                    suffix={stat.suffix}
                    enableScrollSpy={true}
                    scrollSpyOnce
                  />
                ) : (
                  `${stat.value}${stat.suffix}`
                )}
              </div>
              <div className="hp-impact-stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Sports Categories Section */}
      <section className="hp-sports-categories-section container" ref={categoriesRef}>
        <SectionHeader
          title="Sports Categories"
          description="Explore various sports disciplines where young Indian talents are making their mark."
        />
        <div className="hp-categories-grid">
          {SPORTS_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.name}
              className="hp-category-card"
              variants={categoryCardVariants}
              initial="hidden"
              animate={categoriesInView ? "visible" : "hidden"}
              transition={{ ...categoryCardVariants.visible.transition, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            >
              <img src={category.imageUrl} alt={category.name} />
              <div className="hp-category-card-overlay">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="hp-explore-sports-btn-container">
          <Button variant="primary" link="/explore-all-sports">
            Explore All Sports &rarr;
          </Button>
        </div>
      </section>

      {/* 5. Sporting Events Section */}
      <section className="hp-events-section" ref={eventsSectionRef}>
        <SectionHeader
          title="Sporting Events"
          description="Stay updated with the latest tournaments, championships, and competitions across India."
        />

        <div className="hp-events-carousel container">
          {featuredEvents.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination, A11y, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              className="mySwiper"
            >
              {featuredEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <motion.div
                    className="hp-featured-event-card"
                    variants={eventSlideVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="hp-event-card-image-wrapper">
                      <img src={event.imageUrl} alt={event.title} />
                    </div>
                    <div className="hp-event-card-content">
                      <h3>{event.title}</h3>
                      <div className="hp-event-meta">
                        <span><FaMapMarkerAlt /> {event.location}</span>
                        <span><FaCalendarAlt /> {event.date}</span>
                      </div>
                      <p className="hp-event-card-description">{event.description}</p>
                      <a href="#" className="hp-read-more-link">
                        Read More <span style={{fontSize: '0.8em'}}>&#8594;</span>
                      </a>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* This h3 now uses class from events.css specific for its style */}
        <h3 className="hp-upcoming-events-title">
          More Upcoming Events
        </h3>
        <div className="hp-upcoming-events-grid container">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="hp-upcoming-event-card"
              variants={upcomingEventCardVariants}
              initial="hidden"
              animate={eventsInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.15 + 0.5, ...upcomingEventCardVariants.visible.transition }}
              whileHover={{ translateY: -8, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            >
              <img src={event.imageUrl} />
              <div className="hp-upcoming-event-card-content">
                <h4>{event.title}</h4>
                <p><FaMapMarkerAlt /> {event.location}</p>
                <p><FaCalendarAlt /> {event.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="hp-view-all-events-btn-container">
          <Button variant="primary" link="/events-all">
            View All Events <span style={{fontSize: '0.8em'}}>&#x1F4C6;</span>
          </Button>
          <Link to="/calendar" className="hp-view-calendar-link">
              View Calendar <span style={{fontSize: '0.8em'}}>&#8594;</span>
          </Link>
        </div>
      </section>

      {/* 6. Community Section (Testimonials & CTA) */}
      <section className="hp-community-section" ref={communitySectionRef}>
        <div className="container">
          <SectionHeader
            title="Hear from our community"
            description="Stories of growth, success, and transformation from athletes and partners."
          />
          <div className="hp-testimonials-grid">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="hp-testimonial-card"
                variants={testimonialCardVariants}
                initial="hidden"
                animate={communityInView ? "visible" : "hidden"}
                transition={{ ...testimonialCardVariants.visible.transition, delay: index * 0.1 }}
              >
                <div className="hp-testimonial-card-header">
                  <FaQuoteLeft />
                </div>
                <p className="hp-testimonial-quote">"{testimonial.quote}"</p>
                <div className="hp-testimonial-author-info">
                  <img src={testimonial.avatar} alt={testimonial.author} className="hp-testimonial-avatar" />
                  <div className="hp-author-details">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                    <p><small>{testimonial.sport}</small></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
              className="hp-call-to-action-section"
              initial={{ opacity: 0, y: 100 }}
              animate={communityInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ marginTop: '80px' }} /* Correct: no `var()` here */
          >
              <div className="container hp-call-to-action-content">
                  <div className="hp-cta-text">
                      <h2 className="">Ready to boost your sports career?</h2> {/* Uses section-heading */}
                      <p>Join GrowAthlete India today. Connect with coaches, scouts, and sponsors. Showcase your talent and take your athletic journey to the next level.</p>
                      <ul className="hp-cta-list">
                        <li><FaQuoteLeft/> Create your sports profile <br/><small>Showcase your achievements, skills, and career goals</small></li>
                        <li><FaQuoteLeft/> Connect with coaches and sponsors <br/><small>Build your network with sports professionals across India</small></li>
                        <li><FaQuoteLeft/> Get discovered by talent scouts <br/><small>Increase your visibility to professional teams and organizations</small></li>
                      </ul>
                      <div className="hp-cta-buttons">
                          <Button link="/get-started">Get started &rarr;</Button>
                          <Button variant="solid-light" link="/learn-more">Learn more</Button>
                      </div>
                  </div>
                  <div className="hp-cta-stats-box">
                      <span className="hp-cta-rocket-icon">🚀</span>
                      <p>Join 5000+ Athletes</p>
                      <small>Who have already started their journey with GrowAthlete India</small>
                  </div>
              </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default Home;