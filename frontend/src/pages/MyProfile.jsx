// // MyProfile.jsx

// import React,{useState,useEffect} from 'react';
// import api from '../utils/api'; // Adjust the import path as necessary
// import '../pages_css/MyProfile.css'; // Importing the updated styles
// import Navbar from '../components/Navbar';
// import { useParams } from "react-router-dom";


// // Sample user data remains the same
// const sampleUser = {
//   profileImage: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQXeXnNZ_jQQhRAwxYQIozYTYVHvjzfhZ-yOwOUNAWy_aD3oUhFNIG4F565r02jc6sbtvvbnKhe4Zmsmj8', // Swapped for a new image that fits the design
//   profileLink: "https://growathlete.com/user/priya_sharma",
//   fullName: "Priya Sharma",
//   age: 21,
//   gender: "Female",
//   location: "Bangalore, Karnataka",
//   primarySport: "Badminton",
//   currentLevel: "Advanced",
//   bio: "A dedicated badminton player with a passion for the sport. My journey began in school, and I have since competed at state and national levels. I believe in consistent hard work and pushing my limits every day. My ultimate goal is to represent India at the international level and make my country proud.",
//   achievements: "• Gold Medalist, 2023 National University Games\n• Two-time State Champion (2022, 2023)\n• 'Emerging Athlete of the Year' Award, State Badminton Federation 2022",
//   email: "priya.sharma@example.com",
//   phone: "+91 91234 56789"
// };


// const MyProfile = () => {


//     const [user, setUser] = useState({});
//     const { id } = useParams(); // Get userId from URL if present


//       useEffect(() => {
//         const fetchData = async () => {
//           // try {
//           //   const res = await api.get("/auth/profile");
//           //   setUser(res.data.user);
//           // } catch (err) {
//           //   alert("Error fetching profile data. Please try again later.");
//           //   console.error("Error fetching profile data:", err);
//           // }
//           try {
//             let res;
//             if (id) {
//               // Fetch specific user's profile
//               res = await api.get(`/auth/profile/${id}`);
//             } else {
//               // Fetch logged-in user's profile
//               res = await api.get("/auth/profile");
//             }
//             setUser(res.data.user);
//           } catch (err) {
//             alert("Error fetching profile data. Please try again later.");
//             console.error("Error fetching profile data:", err);
//           }
//         };
//         fetchData();
//       }, [id]);


// //   const user = sampleUser;

//   return (
//     <>
//     <Navbar />
//     <div className="profile-page-container">
//       {/* The header is now separate from the main card */}
//       <header className="profile-header">
//         <div className="profile-picture-container">
//             <img src={user.profilePicture} alt={`${user.username}`} className="profile-picture" />
//         </div>
//         <h1 className="profile-name">{user.username}</h1>
//         {/* Added sport and level here as requested */}
//         <p className="profile-sport">{user.sport} | {user.level} Level</p>
//       </header>

//       {/* This card contains all the informational sections */}
//       <div className="profile-card">
//         {/* Personal Information Section */}
//         <section className="profile-section">
//           <h2 className="section-title">Personal Information</h2>
//           {/* Using a specific grid class for the unique layout */}
//           <div className="personal-info-grid">
//             <div className="info-item">
//               <span className="info-label">Age</span>
//               <span className="info-value">{user.age}</span>
//             </div>
//             <div className="info-item">
//               <span className="info-label">Gender</span>
//               <span className="info-value">{user.gender}</span>
//             </div>
//             <div className="info-item location-item">
//               <span className="info-label">Location</span>
//               <span className="info-value">{user.location}</span>
//             </div>
//           </div>
//         </section>

//         {/* Athletic Information Section */}
//         <section className="profile-section">
//           <h2 className="section-title">Athletic Information</h2>
//           <div className="athletic-info-container">
//             <div className="info-item">
//                 <span className="info-label">Bio</span>
//                 <p className="info-text">{user.bio}</p>
//             </div>
//             <div className="info-item">
//                 <span className="info-label">Achievements</span>
//                 <p className="info-text achievements-text">{user.achievements}</p>
//             </div>
//               <div className="info-item">
//                 {/* <span className="info-label">Profile Link</span>
//                 <span className="info-value">
//                     <a href={user.profileLink} target="_blank" rel="noopener noreferrer">{user.profileLink}</a>
//                 </span> */}
//             </div>
//           </div>
//         </section>

//         {/* Contact Information Section */}
//         <section className="profile-section">
//           <h2 className="section-title">Contact Information</h2>
//           <div className="contact-info-grid">
//             <div className="info-item">
//               <span className="info-label">Email Address</span>
//               <span className="info-value">{user.email}</span>
//             </div>
//             <div className="info-item">
//               <span className="info-label">Phone Number</span>
//               <span className="info-value">{user.phone}</span>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//     </>
//   );
// };

// export default MyProfile;



// MyProfile.jsx


// const MyProfile = () => {
//   const [user, setUser] = useState(null); // null for proper loading check
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activityStreak, setActivityStreak] = useState(0);
//   const [nextEvent, setNextEvent] = useState(null);
//   const [aiBlurb, setAiBlurb] = useState("");
//   const [showQR, setShowQR] = useState(false);
//   const [performanceDNA, setPerformanceDNA] = useState({
//     speed: 85,
//     endurance: 72,
//     agility: 90,
//     strength: 68,
//     skill: 88
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editData, setEditData] = useState({});
//   const { id } = useParams(); // Get userId from URL if present

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let res;
//         if (id) {
//           // View another user's profile
//           res = await api.get(`/auth/profile/${id}`);
//         } else {
//           // View logged-in user's profile
//           res = await api.get("/auth/profile");
//         }
//         setUser(res.data.user);

//         // Generate AI blurb based on user data
//         generateAIBlurb(res.data.user);

//         // Generate performance DNA based on user data
//         generatePerformanceDNA(res.data.user);

//         // Mock activity streak (in real app, this would come from backend)
//         setActivityStreak(Math.floor(Math.random() * 10) + 1);

//         // Mock next event (in real app, this would come from events API)
//         setNextEvent({
//           name: "Regional Championship",
//           date: "2024-02-15",
//           location: "Sports Complex"
//         });

//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Could not load profile. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const generateAIBlurb = (userData) => {
//     const sport = userData.sport || "athlete";
//     const level = userData.level || "intermediate";
//     const position = getPositionForSport(sport);
//     const traits = getTraitsForLevel(level);

//     setAiBlurb(`${position} known for ${traits.join(" & ")}.`);
//   };

//   const getPositionForSport = (sport) => {
//     const positions = {
//       football: "Left-wing forward",
//       basketball: "Point guard",
//       cricket: "Opening batsman",
//       badminton: "Singles specialist",
//       tennis: "Baseline player",
//       swimming: "Freestyle specialist",
//       athletics: "Sprint specialist",
//       volleyball: "Outside hitter",
//       hockey: "Forward",
//       other: "Versatile player"
//     };
//     return positions[sport] || "Versatile player";
//   };

//   const getTraitsForLevel = (level) => {
//     const traits = {
//       beginner: ["consistent effort", "rapid improvement"],
//       intermediate: ["late runs", "high pressing", "tactical awareness"],
//       advanced: ["clinical finishing", "leadership", "game intelligence"]
//     };
//     return traits[level] || ["dedication", "team spirit"];
//   };

//   const generatePerformanceDNA = (userData) => {
//     const sport = userData.sport || "athlete";
//     const level = userData.level || "intermediate";
//     const age = parseInt(userData.age) || 25;

//     // Base performance DNA based on sport and level
//     const baseDNA = getBaseDNAForSport(sport, level, age);

//     // Add some randomness to make it more realistic
//     const dna = {
//       speed: Math.max(20, Math.min(100, baseDNA.speed + (Math.random() - 0.5) * 20)),
//       endurance: Math.max(20, Math.min(100, baseDNA.endurance + (Math.random() - 0.5) * 20)),
//       agility: Math.max(20, Math.min(100, baseDNA.agility + (Math.random() - 0.5) * 20)),
//       strength: Math.max(20, Math.min(100, baseDNA.strength + (Math.random() - 0.5) * 20)),
//       skill: Math.max(20, Math.min(100, baseDNA.skill + (Math.random() - 0.5) * 20))
//     };

//     setPerformanceDNA(dna);
//   };

//   const getBaseDNAForSport = (sport, level, age) => {
//     const levelMultiplier = {
//       beginner: 0.6,
//       intermediate: 0.8,
//       advanced: 0.95
//     };

//     const multiplier = levelMultiplier[level] || 0.8;

//     const sportDNA = {
//       football: { speed: 85, endurance: 80, agility: 90, strength: 70, skill: 85 },
//       basketball: { speed: 80, endurance: 75, agility: 95, strength: 85, skill: 90 },
//       cricket: { speed: 60, endurance: 70, agility: 75, strength: 65, skill: 95 },
//       badminton: { speed: 90, endurance: 70, agility: 95, strength: 60, skill: 90 },
//       tennis: { speed: 75, endurance: 80, agility: 85, strength: 70, skill: 95 },
//       swimming: { speed: 85, endurance: 95, agility: 70, strength: 80, skill: 85 },
//       athletics: { speed: 95, endurance: 90, agility: 80, strength: 85, skill: 75 },
//       volleyball: { speed: 70, endurance: 75, agility: 90, strength: 85, skill: 80 },
//       hockey: { speed: 80, endurance: 85, agility: 85, strength: 75, skill: 85 },
//       other: { speed: 70, endurance: 70, agility: 70, strength: 70, skill: 70 }
//     };

//     const base = sportDNA[sport] || sportDNA.other;

//     // Age adjustment (peak performance around 25-30)
//     const ageAdjustment = age < 25 ? 1 + (25 - age) * 0.02 : 
//                          age > 30 ? 1 - (age - 30) * 0.01 : 1;

//     return {
//       speed: Math.round(base.speed * multiplier * ageAdjustment),
//       endurance: Math.round(base.endurance * multiplier * ageAdjustment),
//       agility: Math.round(base.agility * multiplier * ageAdjustment),
//       strength: Math.round(base.strength * multiplier * ageAdjustment),
//       skill: Math.round(base.skill * multiplier * ageAdjustment)
//     };
//   };

//   // Edit mode functions
//   const handleEditClick = () => {
//     setEditData({
//       username: user.username || "",
//       email: user.email || "",
//       sport: user.sport || "",
//       level: user.level || "",
//       age: user.age || "",
//       location: user.location || "",
//       bio: user.bio || "",
//       phone: user.phone || "",
//       availability: user.availability || "Open to tryouts",
//       locationType: user.locationType || "Remote/On-site",
//       nextEvent: user.nextEvent || "",
//       aiBlurb: user.aiBlurb || aiBlurb || "",
//       performanceDNA: user.performanceDNA || { ...performanceDNA }
//     });
//     setIsEditMode(true);
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     setEditData({});
//   };

//   const handleSaveEdit = async () => {
//     try {
//       setLoading(true);
//       const response = await api.post("/auth/update", editData);
//       setUser(response.data.user);
//       setPerformanceDNA(editData.performanceDNA);
//       setAiBlurb(editData.aiBlurb || aiBlurb);
//       setNextEvent(editData.nextEvent || nextEvent);
//       setIsEditMode(false);
//       setEditData({});
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setError("Could not update profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handlePerformanceChange = (skill, value) => {
//     setEditData(prev => ({
//       ...prev,
//       performanceDNA: {
//         ...prev.performanceDNA,
//         [skill]: parseInt(value) || 0
//       }
//     }));
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="profile-page-container">
//           <p>Loading profile...</p>
//         </div>
//       </>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="profile-page-container">
//           <p style={{ color: "red" }}>{error}</p>
//         </div>
//       </>
//     );
//   }

//   // Handle missing user
//   if (!user) {
//     return (
//       <>
//         <Navbar />
//         <div className="profile-page-container">
//           <p>No user profile found.</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="profile-page-container">
//         {/* Kinetic Header */}
//         <header className="kinetic-header">
//           {/* Animated Gradient Background */}
//           <div className={`kinetic-gradient ${activityStreak > 5 ? 'active-streak' : ''}`}>
//             <div className="gradient-overlay"></div>
//           </div>

//           <div className="kinetic-content">
//             {/* Profile Picture with Animated Border */}
//             <div className="profile-picture-container-kinetic">
//               <div className="profile-picture-ring">
//                 <img
//                   src={user.profilePicture || "https://via.placeholder.com/150"}
//                   alt={user.username || "User"}
//                   className="profile-picture-kinetic"
//                 />
//                 <div className="profile-initials-overlay">
//                   {(user.username || "User").charAt(0).toUpperCase()}
//                 </div>
//               </div>
//             </div>

//             {/* Name and Sport/Role Chip */}
//             <div className="profile-identity">
//               {!isEditMode ? (
//                 <>
//                   <h1 className="profile-name-kinetic">{user.username || "Unnamed User"}</h1>
//                   <div className="sport-role-chip">
//                     <span className="sport-name">{user.sport || "Athlete"}</span>
//                     <span className="role-level">{user.level || "Beginner"}</span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <input
//                     type="text"
//                     className="profile-name-edit"
//                     value={editData.username || ""}
//                     onChange={(e) => handleInputChange('username', e.target.value)}
//                     placeholder="Enter your name"
//                   />
//                   <div className="sport-role-edit">
//                     <input
//                       type="text"
//                       className="sport-name-edit"
//                       value={editData.sport || ""}
//                       onChange={(e) => handleInputChange('sport', e.target.value)}
//                       placeholder="Sport"
//                     />
//                     <select
//                       className="role-level-edit"
//                       value={editData.level || ""}
//                       onChange={(e) => handleInputChange('level', e.target.value)}
//                     >
//                       <option value="">Select Level</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                       <option value="Professional">Professional</option>
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Streak Flame */}
//             <div className="streak-container">
//               <div className="streak-flame">
//                 <div className="flame-icon">🔥</div>
//                 <span className="streak-count">{activityStreak}-day streak</span>
//               </div>
//             </div>

//             {/* QR Smart Card */}
//             <div className="qr-container">
//               <button 
//                 className="qr-trigger"
//                 onClick={() => setShowQR(!showQR)}
//               >
//                 <div className="qr-icon">📱</div>
//                 <span>Smart Card</span>
//               </button>

//               {showQR && (
//                 <div className="qr-modal">
//                   <div className="qr-content">
//                     <h3>Scouting Snapshot</h3>
//                     <div className="qr-code">
//                       <QRCodeSVG 
//                         value={`${window.location.origin}/profile/${user._id || 'me'}`}
//                         size={120}
//                       />
//                     </div>
//                     <p className="qr-text">Scan to view full profile</p>
//                     <button 
//                       className="qr-close"
//                       onClick={() => setShowQR(false)}
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Availability Pill */}
//             <div className="availability-pill">
//               {!isEditMode ? (
//                 <>
//                   <div className="availability-status ">
//                     <span className="status-dot"></span>
//                     <span>{user.availability || "Open to tryouts"}</span>
//                   </div>
//                   <div className="availability-details">
//                     <span>{user.locationType || "Remote/On-site"}</span>
//                     <span className="next-event">
//                       Next: {user.nextEvent || "15/02/2024"}
//                     </span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="availability-edit-group">
//                     <label className="availability-edit-label">Availability Status</label>
//                     <select
//                       className="availability-edit-select"
//                       value={editData.availability || ""}
//                       onChange={(e) => handleInputChange('availability', e.target.value)}
//                     >
//                       <option value="Open to tryouts">Open to tryouts</option>
//                       <option value="Looking for opportunities">Looking for opportunities</option>
//                       <option value="Currently unavailable">Currently unavailable</option>
//                       <option value="Open to offers">Open to offers</option>
//                     </select>
//                   </div>
//                   <div className="availability-edit-details">
//                     <div className="availability-edit-group">
//                       <label className="availability-edit-label">Location Type</label>
//                       <select
//                         className="availability-edit-select"
//                         value={editData.locationType || ""}
//                         onChange={(e) => handleInputChange('locationType', e.target.value)}
//                       >
//                         <option value="Remote/On-site">Remote/On-site</option>
//                         <option value="Remote only">Remote only</option>
//                         <option value="On-site only">On-site only</option>
//                         <option value="Flexible">Flexible</option>
//                       </select>
//                     </div>
//                     <div className="availability-edit-group">
//                       <label className="availability-edit-label">Next Event</label>
//                       <input
//                         type="text"
//                         className="availability-edit-input"
//                         value={editData.nextEvent || ""}
//                         onChange={(e) => handleInputChange('nextEvent', e.target.value)}
//                         placeholder="Next: 15/02/2024"
//                       />
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* AI Blurb */}
//             <div className="ai-blurb">
//               <div className="ai-icon">🤖</div>
//               {!isEditMode ? (
//                 <p className="blurb-text">"{user.aiBlurb || aiBlurb}"</p>
//               ) : (
//                 <textarea
//                   className="blurb-edit-textarea"
//                   value={editData.aiBlurb || user.aiBlurb || aiBlurb}
//                   onChange={(e) => handleInputChange('aiBlurb', e.target.value)}
//                   placeholder="Enter your AI-generated description..."
//                   rows="2"
//                 />
//               )}
//             </div>

//             {/* Edit Button */}
//             <div className="edit-controls">
//               {!isEditMode ? (
//                 <button className="edit-btn" onClick={handleEditClick}>
//                   ✏️ Edit Profile
//                 </button>
//               ) : (
//                 <div className="edit-actions">
//                   <button className="save-btn" onClick={handleSaveEdit}>
//                     💾 Save
//                   </button>
//                   <button className="cancel-btn" onClick={handleCancelEdit}>
//                     ❌ Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Performance DNA Band */}
//         {/* <section className="performance-dna-band">
//           <div className="dna-container">
//             <h3 className="dna-title">Performance DNA</h3>
//             {!isEditMode ? (
//               <div className="dna-gauges">
//               <div className="dna-gauge">
//                 <div className="gauge-label">
//                   <span className="gauge-icon">⚡</span>
//                   <span>Speed</span>
//                 </div>
//                 <div className="gauge-bar">
//                   <div 
//                     className="gauge-fill speed-fill"
//                     style={{ width: `${performanceDNA.speed}%` }}
//                   >
//                     <span className="gauge-value">{performanceDNA.speed}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="dna-gauge">
//                 <div className="gauge-label">
//                   <span className="gauge-icon">🏃</span>
//                   <span>Endurance</span>
//                 </div>
//                 <div className="gauge-bar">
//                   <div 
//                     className="gauge-fill endurance-fill"
//                     style={{ width: `${performanceDNA.endurance}%` }}
//                   >
//                     <span className="gauge-value">{performanceDNA.endurance}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="dna-gauge">
//                 <div className="gauge-label">
//                   <span className="gauge-icon">🤸</span>
//                   <span>Agility</span>
//                 </div>
//                 <div className="gauge-bar">
//                   <div 
//                     className="gauge-fill agility-fill"
//                     style={{ width: `${performanceDNA.agility}%` }}
//                   >
//                     <span className="gauge-value">{performanceDNA.agility}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="dna-gauge">
//                 <div className="gauge-label">
//                   <span className="gauge-icon">💪</span>
//                   <span>Strength</span>
//                 </div>
//                 <div className="gauge-bar">
//                   <div 
//                     className="gauge-fill strength-fill"
//                     style={{ width: `${performanceDNA.strength}%` }}
//                   >
//                     <span className="gauge-value">{performanceDNA.strength}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="dna-gauge">
//                 <div className="gauge-label">
//                   <span className="gauge-icon">🎯</span>
//                   <span>Skill</span>
//                 </div>
//                 <div className="gauge-bar">
//                   <div 
//                     className="gauge-fill skill-fill"
//                     style={{ width: `${performanceDNA.skill}%` }}
//                   >
//                     <span className="gauge-value">{performanceDNA.skill}%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             ) : (
//               <div className="performance-edit-container">
//                 <div className="performance-edit-item">
//                   <div className="performance-edit-label">⚡ Speed</div>
//                   <input
//                     type="number"
//                     className="performance-edit-input"
//                     value={editData.performanceDNA?.speed || 0}
//                     onChange={(e) => handlePerformanceChange('speed', e.target.value)}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div className="performance-edit-item">
//                   <div className="performance-edit-label">🏃 Endurance</div>
//                   <input
//                     type="number"
//                     className="performance-edit-input"
//                     value={editData.performanceDNA?.endurance || 0}
//                     onChange={(e) => handlePerformanceChange('endurance', e.target.value)}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div className="performance-edit-item">
//                   <div className="performance-edit-label">🤸 Agility</div>
//                   <input
//                     type="number"
//                     className="performance-edit-input"
//                     value={editData.performanceDNA?.agility || 0}
//                     onChange={(e) => handlePerformanceChange('agility', e.target.value)}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div className="performance-edit-item">
//                   <div className="performance-edit-label">💪 Strength</div>
//                   <input
//                     type="number"
//                     className="performance-edit-input"
//                     value={editData.performanceDNA?.strength || 0}
//                     onChange={(e) => handlePerformanceChange('strength', e.target.value)}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div className="performance-edit-item">
//                   <div className="performance-edit-label">🎯 Skill</div>
//                   <input
//                     type="number"
//                     className="performance-edit-input"
//                     value={editData.performanceDNA?.skill || 0}
//                     onChange={(e) => handlePerformanceChange('skill', e.target.value)}
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </section> */}

//         {/* Profile Card */}
//         <div className="profile-card">
//           {/* Personal Information */}
//           <section className="profile-section">
//             <h2 className="section-title">Personal Information</h2>
//             {!isEditMode ? (
//               <div className="personal-info-grid">
//                 <div className="info-item">
//                   <span className="info-label">Age</span>
//                   <span className="info-value">{user.age || "N/A"}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Gender</span>
//                   <span className="info-value">{user.gender || "N/A"}</span>
//                 </div>
//                 <div className="info-item location-item">
//                   <span className="info-label">Location</span>
//                   <span className="info-value">{user.location || "N/A"}</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="edit-form-grid">
//                 <div className="form-group">
//                   <label className="form-label">Age</label>
//                   <input
//                     type="number"
//                     className="form-input"
//                     value={editData.age || ""}
//                     onChange={(e) => handleInputChange('age', e.target.value)}
//                     placeholder="Enter your age"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Gender</label>
//                   <select
//                     className="form-input"
//                     value={editData.gender || ""}
//                     onChange={(e) => handleInputChange('gender', e.target.value)}
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Location</label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     value={editData.location || ""}
//                     onChange={(e) => handleInputChange('location', e.target.value)}
//                     placeholder="Enter your location"
//                   />
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* Athletic Information */}
//           <section className="profile-section">
//             <h2 className="section-title">Athletic Information</h2>
//             {!isEditMode ? (
//               <div className="athletic-info-container">
//                 <div className="info-item">
//                   <span className="info-label">Bio</span>
//                   <p className="info-text">{user.bio || "No bio provided."}</p>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Achievements</span>
//                   <p className="info-text achievements-text">
//                     {user.achievements || "No achievements listed."}
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="edit-form-container">
//                 <div className="form-group">
//                   <label className="form-label">Bio</label>
//                   <textarea
//                     className="form-textarea"
//                     value={editData.bio || ""}
//                     onChange={(e) => handleInputChange('bio', e.target.value)}
//                     placeholder="Tell us about yourself as an athlete..."
//                     rows="4"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Achievements</label>
//                   <textarea
//                     className="form-textarea"
//                     value={editData.achievements || ""}
//                     onChange={(e) => handleInputChange('achievements', e.target.value)}
//                     placeholder="List your athletic achievements..."
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* Contact Information */}
//           <section className="profile-section">
//             <h2 className="section-title">Contact Information</h2>
//             {!isEditMode ? (
//               <div className="contact-info-grid">
//                 <div className="info-item">
//                   <span className="info-label">Email Address</span>
//                   <span className="info-value">{user.email || "N/A"}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="info-label">Phone Number</span>
//                   <span className="info-value">{user.phone || "N/A"}</span>
//                 </div>
//               </div>
//             ) : (
//               <div className="edit-form-grid">
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-input"
//                     value={editData.email || ""}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Phone Number</label>
//                   <input
//                     type="tel"
//                     className="form-input"
//                     value={editData.phone || ""}
//                     onChange={(e) => handleInputChange('phone', e.target.value)}
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//               </div>
//             )}
//           </section>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MyProfile;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../pages_css/MyProfile.css";
import api from "../utils/api";

const mockProfile = {
  user: {
    name: "Ethan Foster",
    sport: "Basketball",
    location: "Los Angeles, USA",
    availability: "Available for Trials (Next 3 months)",
    avatar: "https://via.placeholder.com/90",
    bio:
      "Ethan Foster is a dynamic point guard known for his exceptional court vision, explosive first step, and consistent perimeter shooting. A natural leader, he consistently elevates his team's performance under pressure. With a 4.0 GPA, Ethan combines athletic prowess with academic discipline, making him a standout prospect for collegiate and professional programs."
  },

  athleticDetails: {
    primarySport: "Basketball",
    position: "Point Guard",
    yearStarted: "2008",
    height: "185",
    weight: "75",
    dominantHand: "Right Hand",
    team: "New York Knights"
  },

  posts: [
    {
      id: 1,
      title: "Every bounce of the ball is a heartbeat",
      caption: "When I step onto the court, the world fades away.",
      image: "https://via.placeholder.com/420x240",
      likes: 19,
      reposts: 2
    },
    {
      id: 2,
      title: "Sweat turns into hope",
      caption: "The roar of the crowd fuels the grind.",
      image: "https://via.placeholder.com/420x240",
      likes: 19,
      reposts: 2
    }
  ],

  achievements: [
    { date: "2024 Season", title: "NBA Rookie of the Year" },
    { date: "2023 Season", title: "Led team to State Championship title" },
    { date: "Feb 2023", title: "Career high 42 points vs rivals" },
    { date: "Jan 2023", title: "Named All-State First Team" }
  ]
};

/*HELPERS*/
const parseAchievements = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [{ date: "Achievement", title: data }];
    } catch (e) {
      // If not JSON, treat as a single string entry or split by newlines
      return data.split('\n').filter(line => line.trim()).map(line => ({
        date: "Achievement",
        title: line.trim()
      }));
    }
  }
  return [];
};

/*COMPONENT*/


export default function MyProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [editHeader, setEditHeader] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ date: "", title: "" });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const [isEditAthleticOpen, setIsEditAthleticOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const [editableAthletic, setEditableAthletic] = useState({});
  const [editableAchievement, setEditableAchievement] = useState({ date: "", title: "", description: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Determine if we are viewing "My Profile" or a specific athlete by ID
        const endpoint = id ? `/profile/${id}` : "/profile/my-profile";
        const res = await api.get(endpoint);
        const { user, posts } = res.data;

        // Check if the viewed profile belongs to the logged-in user
        const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
        setIsOwnProfile(!id || id === loggedInUser._id || id === loggedInUser.id);

        // Map backend user to the structure expected by the UI
        const mappedUser = {
          name: user.username,
          sport: user.sport || "Athlete",
          location: user.location || "N/A",
          availability: user.availability || "Open to opportunities",
          avatar: user.profilePicture || "https://via.placeholder.com/150",
          bio: user.bio || "No bio provided."
        };

        const mappedAthletic = {
          primarySport: user.sport || "N/A",
          position: user.position || "N/A",
          height: user.height || "N/A",
          weight: user.weight || "N/A",
          team: user.team || "N/A",
          extraNotes: user.extraNotes || "No extra notes."
        };

        // Map posts to UI structure
        const mappedPosts = posts.map(post => ({
          id: post._id,
          title: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
          caption: post.content,
          image: (post.media && post.media.length > 0) ? post.media[0].url : "https://via.placeholder.com/420x240",
          likes: post.likes ? post.likes.length : 0,
          reposts: 0 // Mocking reposts as it's not in the model yet
        }));

        setProfile({
          user: mappedUser,
          athleticDetails: mappedAthletic,
          posts: mappedPosts,
          achievements: parseAchievements(user.achievements)
        });

        setEditableProfile(mappedUser);
        setEditableAthletic(mappedAthletic);

      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  /*HANDLERS*/

  const handleSave = async (data) => {
    try {
      setLoading(true);
      const res = await api.put("/profile/update", data);
      if (res.data.success) {
        // Refresh local state with backend response
        const { user } = res.data;

        const mappedUser = {
          name: user.username,
          sport: user.sport || "Athlete",
          location: user.location || "N/A",
          availability: user.availability || "Open to opportunities",
          avatar: user.profilePicture || "https://via.placeholder.com/150",
          bio: user.bio || "No bio provided."
        };

        const mappedAthletic = {
          primarySport: user.sport || "N/A",
          position: user.position || "N/A",
          height: user.height || "N/A",
          weight: user.weight || "N/A",
          team: user.team || "N/A",
          extraNotes: user.extraNotes || "No extra notes."
        };

        setProfile(prev => ({
          ...prev,
          user: mappedUser,
          athleticDetails: mappedAthletic,
          achievements: parseAchievements(user.achievements)
        }));

        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id) => {
    setProfile({
      ...profile,
      posts: profile.posts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    });
  };

  if (loading) return <div className="loading-container"><p>Loading profile...</p></div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;
  if (!profile) return null;

  return (
    <div className="profile-page">

      {/*PROFILE HEADER  */}
      <section className="card profile-header">
        <div className="profile-top">
          <img className="avatar" src={profile.user.avatar} alt="profile" />

          <div className="profile-info">
            {editHeader ? (
              <input
                value={profile.user.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    user: { ...profile.user, name: e.target.value }
                  })
                }
              />
            ) : (
              <h2>{profile.user.name}</h2>
            )}

            <span className="sport">{profile.user.sport}</span>
            <p className="meta">
              📍 {profile.user.location} · {profile.user.availability}
            </p>
          </div>

          {isOwnProfile && (
            <button
              className="icon-btn"
              onClick={() => {
                setEditMode("profile");
                setEditableProfile(profile.user);
                setIsModalOpen(true);
              }}
            >
              ✎
            </button>
          )}

        </div>

        {editHeader ? (
          <textarea
            className="edit-textarea"
            value={profile.user.bio}
            onChange={(e) =>
              setProfile({
                ...profile,
                user: { ...profile.user, bio: e.target.value }
              })
            }
          />
        ) : (
          <p className="bio">{profile.user.bio}</p>
        )}
      </section>

      {/*ATHLETIC DETAILS */}
      <section className="card">
        <div className="card-header">
          <h3>Athletic Details</h3>
          {isOwnProfile && (
            <button
              className="icon-btn"
              onClick={() => {
                setEditMode("athletic");
                setEditableAthletic(profile.athleticDetails);
                setIsModalOpen(true);
              }}
            >
              ✎
            </button>
          )}


        </div>

        <div className="details-grid">
          {Object.entries(profile.athleticDetails).map(([key, value]) => (
            <div key={key}>
              <label>{key.replace(/([A-Z])/g, " $1")}</label>
              {editDetails ? (
                <input
                  value={value}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      athleticDetails: {
                        ...profile.athleticDetails,
                        [key]: e.target.value
                      }
                    })
                  }
                />
              ) : (
                <p>{value}</p>
              )}
            </div>
          ))}

          {showMoreDetails && (
            <div className="full">
              <label>Extra Notes</label>
              <p>{profile.athleticDetails.extraNotes}</p>
            </div>
          )}
        </div>

        <p
          className="show-more"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
        >
          {showMoreDetails ? "Show less" : "Show more →"}
        </p>
      </section>

      {/*ACTIVITY*/}
      <section className="card activity-card">
        <h3 className="section-title">Activity</h3>
        <div className="posts">
          {profile.posts.map(post => (
            <div className="post-card" key={post.id}>
              <img src={post.image} alt="post" />
              <div className="post-content">
                <h4>{post.title}</h4>
                <p>{post.caption}</p>
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post.id)}>
                  👍 {post.likes}
                </button>
                <button>Comment</button>
                <button>Repost</button>
                <button>Send</button>
              </div>
            </div>
          ))}
        </div>
        <div
          className="see-all-under"
          onClick={() => setIsActivityOpen(true)}
        >
          Show all activity →
        </div>
      </section>
      {isActivityOpen && (
        <div className="modal-overlay">
          <div className="modal activity-modal">

            {/* HEADER */}
            <div className="modal-header">
              <h3>All Activity</h3>
              <button
                className="close-btn"
                onClick={() => setIsActivityOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body activity-list">
              {profile.posts.map(post => (
                <div className="post-card vertical" key={post.id}>
                  <img src={post.image} alt="post" />

                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.caption}</p>

                    <div className="post-actions">
                      <button onClick={() => handleLike(post.id)}>
                        👍 {post.likes}
                      </button>
                      <button>Comment</button>
                      <button>Repost</button>
                      <button>Send</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/*ACHIEVEMENTS*/}
      <section className="card">
        <div className="card-header">
          <h3>Achievements</h3>

          {isOwnProfile && (
            <div className="icon-actions">
              <button
                className="icon-btn"
                onClick={() => {
                  setEditableAchievement({ date: "", title: "", description: "" });
                  setEditMode("achievement-add");
                  setIsModalOpen(true);
                }}
              >
                +
              </button>

              <button
                className="icon-btn"
                onClick={() => {
                  setEditMode("achievement-manage");
                  setIsModalOpen(true);
                }}
              >
                ✎
              </button>
            </div>
          )}
        </div>

        <div className="achievements-list">
          {profile.achievements.map((a, i) => (
            <div className="achievement-row" key={i}>
              <div className="achievement-date">{a.date}</div>
              <div className="achievement-title">{a.title}</div>
            </div>
          ))}
        </div>
      </section>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">

            {/* HEADER */}
            <div className="modal-header">
              <h3>
                {editMode === "profile" && "Edit Profile"}
                {editMode === "athletic" && "Edit Athletic Details"}
                {editMode === "achievement-add" && "Add Achievement"}
                {editMode === "achievement-manage" && "Manage Achievements"}
                {editMode === "achievement-edit" && "Edit Achievement"}
              </h3>

              <button
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/*PROFILE*/}
              {editMode === "profile" && (
                <>
                  <label>Name</label>
                  <input
                    value={editableProfile.name}
                    onChange={(e) =>
                      setEditableProfile({ ...editableProfile, name: e.target.value })
                    }
                  />

                  <label>Sport</label>
                  <input
                    value={editableProfile.sport}
                    onChange={(e) =>
                      setEditableProfile({ ...editableProfile, sport: e.target.value })
                    }
                  />

                  <label>Location</label>
                  <input
                    value={editableProfile.location}
                    onChange={(e) =>
                      setEditableProfile({
                        ...editableProfile,
                        location: e.target.value
                      })
                    }
                  />

                  <label>Bio</label>
                  <textarea
                    value={editableProfile.bio}
                    onChange={(e) =>
                      setEditableProfile({ ...editableProfile, bio: e.target.value })
                    }
                  />
                  <label>Availability</label>
                  <input
                    value={editableProfile.availability}
                    onChange={(e) =>
                      setEditableProfile({ ...editableProfile, availability: e.target.value })
                    }
                  />
                </>
              )}

              {/*ATHLETIC DETAILS*/}
              {editMode === "athletic" && (
                <>
                  <label>Primary Sport</label>
                  <input
                    value={editableAthletic.primarySport}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        primarySport: e.target.value
                      })
                    }
                  />

                  <label>Position</label>
                  <input
                    value={editableAthletic.position}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        position: e.target.value
                      })
                    }
                  />

                  <label>Height</label>
                  <input
                    value={editableAthletic.height}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        height: e.target.value
                      })
                    }
                  />

                  <label>Weight</label>
                  <input
                    value={editableAthletic.weight}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        weight: e.target.value
                      })
                    }
                  />

                  <label>Team</label>
                  <input
                    value={editableAthletic.team}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        team: e.target.value
                      })
                    }
                  />

                  <label>Extra Notes</label>
                  <textarea
                    value={editableAthletic.extraNotes}
                    onChange={(e) =>
                      setEditableAthletic({
                        ...editableAthletic,
                        extraNotes: e.target.value
                      })
                    }
                  />
                </>
              )}


              {editMode === "achievement-add" && (
                <>
                  <label>Date / Season</label>
                  <input
                    value={editableAchievement.date}
                    onChange={(e) =>
                      setEditableAchievement({
                        ...editableAchievement,
                        date: e.target.value
                      })
                    }
                  />

                  <label>Title</label>
                  <input
                    value={editableAchievement.title}
                    onChange={(e) =>
                      setEditableAchievement({
                        ...editableAchievement,
                        title: e.target.value
                      })
                    }
                  />
                </>
              )}

              {/*ACHIEVEMENT : MANAGE*/}
              {editMode === "achievement-manage" && (
                <div className="achievement-manage-list">
                  {profile.achievements.map((ach, index) => (
                    <div className="achievement-manage-item" key={index}>

                      {/*VIEW MODE*/}
                      {editingIndex !== index ? (
                        <>
                          <div className="achievement-manage-info">
                            <h4>{ach.title}</h4>
                            <span>{ach.date}</span>
                          </div>

                          <div className="achievement-manage-actions">
                            <button
                              className="btn-edit"
                              onClick={() => {
                                setEditableAchievement({ ...ach });
                                setEditingIndex(index); // 🔥 inline edit
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-delete"
                              onClick={() => {
                                const newAchievements = profile.achievements.filter((_, i) => i !== index);
                                handleSave({ achievements: newAchievements });
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        /*EDIT MODE*/
                        <div className="achievement-inline-edit">
                          <input
                            placeholder="Date / Season"
                            value={editableAchievement.date}
                            onChange={(e) =>
                              setEditableAchievement({
                                ...editableAchievement,
                                date: e.target.value
                              })
                            }
                          />

                          <input
                            placeholder="Title"
                            value={editableAchievement.title}
                            onChange={(e) =>
                              setEditableAchievement({
                                ...editableAchievement,
                                title: e.target.value
                              })
                            }
                          />

                          <div className="achievement-inline-actions">
                            <button
                              className="btn-save"
                              onClick={() => {
                                const updated = [...profile.achievements];
                                updated[index] = editableAchievement;
                                handleSave({ achievements: updated });
                                setEditingIndex(null);
                              }}
                            >
                              Save
                            </button>

                            <button
                              className="btn-cancel"
                              onClick={() => setEditingIndex(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {editMode === "achievement-edit" && (
                <>
                  <label>Date / Season</label>
                  <input
                    value={editableAchievement.date}
                    onChange={(e) =>
                      setEditableAchievement({
                        ...editableAchievement,
                        date: e.target.value
                      })
                    }
                  />

                  <label>Title</label>
                  <input
                    value={editableAchievement.title}
                    onChange={(e) =>
                      setEditableAchievement({
                        ...editableAchievement,
                        title: e.target.value
                      })
                    }
                  />
                </>
              )}

            </div>

            {/* FOOTER */}
            {editMode !== "achievement-manage" && (
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (editMode === "profile") {
                      handleSave({
                        username: editableProfile.name,
                        sport: editableProfile.sport,
                        location: editableProfile.location,
                        bio: editableProfile.bio,
                        availability: editableProfile.availability
                      });
                    } else if (editMode === "athletic") {
                      handleSave({
                        sport: editableAthletic.primarySport,
                        position: editableAthletic.position,
                        height: editableAthletic.height,
                        weight: editableAthletic.weight,
                        team: editableAthletic.team,
                        extraNotes: editableAthletic.extraNotes
                      });
                    } else if (editMode === "achievement-add") {
                      handleSave({
                        achievements: [...profile.achievements, editableAchievement]
                      });
                    } else if (editMode === "achievement-edit") {
                      const updated = [...profile.achievements];
                      updated[editingIndex] = editableAchievement;
                      handleSave({ achievements: updated });
                    }
                  }}
                >
                  Save
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
