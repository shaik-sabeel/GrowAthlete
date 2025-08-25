const mongoose = require("mongoose");
const SportsCategory = require("./models/SportsCategory");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/growAthleteDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

async function seedSportsCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await SportsCategory.countDocuments();
    if (existingCategories > 0) {
      console.log("Sports categories already exist, skipping seed");
      return;
    }

    // Create default sports categories
    const categories = [
      {
        name: "Cricket",
        description: "A bat-and-ball game played between two teams of eleven players on a field at the centre of which is a 22-yard pitch with a wicket at each end.",
        shortDescription: "Bat-and-ball team sport",
        icon: "🏏",
        rules: ["11 players per team", "Overs format", "Wicket system"],
        equipment: ["Cricket bat", "Cricket ball", "Wickets", "Protective gear"],
        skills: ["Batting", "Bowling", "Fielding", "Wicket-keeping"],
        featured: true,
        sortOrder: 1,
        createdBy: "admin" // Will be replaced with actual admin ID
      },
      {
        name: "Football",
        description: "A team sport played with a spherical ball between two teams of 11 players. It is the world's most popular sport.",
        shortDescription: "World's most popular team sport",
        icon: "⚽",
        rules: ["11 players per team", "90 minutes", "Offside rule"],
        equipment: ["Football", "Goal posts", "Shin guards", "Cleats"],
        skills: ["Dribbling", "Passing", "Shooting", "Tackling"],
        featured: true,
        sortOrder: 2,
        createdBy: "admin"
      },
      {
        name: "Basketball",
        description: "A team sport in which two teams score points by throwing a ball through a hoop while following a set of rules.",
        shortDescription: "Fast-paced indoor team sport",
        icon: "🏀",
        rules: ["5 players per team", "4 quarters", "Shot clock"],
        equipment: ["Basketball", "Hoop", "Backboard", "Court"],
        skills: ["Dribbling", "Shooting", "Passing", "Defense"],
        featured: true,
        sortOrder: 3,
        createdBy: "admin"
      },
      {
        name: "Tennis",
        description: "A racket sport that can be played individually against a single opponent or between two teams of two players each.",
        shortDescription: "Individual or doubles racket sport",
        icon: "🎾",
        rules: ["Singles or doubles", "Best of 3 or 5 sets", "Tie-break system"],
        equipment: ["Tennis racket", "Tennis balls", "Court", "Net"],
        skills: ["Serve", "Forehand", "Backhand", "Volley"],
        featured: false,
        sortOrder: 4,
        createdBy: "admin"
      },
      {
        name: "Swimming",
        description: "An individual or team racing sport that requires the use of one's entire body to move through water.",
        shortDescription: "Water-based individual sport",
        icon: "🏊",
        rules: ["Multiple strokes", "Lane discipline", "Turn regulations"],
        equipment: ["Swimming pool", "Lanes", "Starting blocks", "Timing system"],
        skills: ["Freestyle", "Breaststroke", "Butterfly", "Backstroke"],
        featured: false,
        sortOrder: 5,
        createdBy: "admin"
      },
      {
        name: "Badminton",
        description: "A racquet sport played using racquets to hit a shuttlecock across a net.",
        shortDescription: "Fast-paced racquet sport",
        icon: "🏸",
        rules: ["Singles or doubles", "21-point system", "Service rules"],
        equipment: ["Badminton racket", "Shuttlecock", "Net", "Court"],
        skills: ["Serve", "Smash", "Drop shot", "Net play"],
        featured: false,
        sortOrder: 6,
        createdBy: "admin"
      },
      {
        name: "Volleyball",
        description: "A team sport in which two teams of six players are separated by a net.",
        shortDescription: "Net-based team sport",
        icon: "🏐",
        rules: ["6 players per team", "3 touches max", "Scoring system"],
        equipment: ["Volleyball", "Net", "Court", "Antennae"],
        skills: ["Serve", "Pass", "Set", "Spike"],
        featured: false,
        sortOrder: 7,
        createdBy: "admin"
      },
      {
        name: "Athletics",
        description: "A collection of sporting events that involve competitive running, jumping, throwing, and walking.",
        shortDescription: "Track and field events",
        icon: "🏃",
        rules: ["Individual events", "Qualifying standards", "Anti-doping"],
        equipment: ["Running track", "Field equipment", "Timing system", "Starting blocks"],
        skills: ["Sprinting", "Long distance", "Jumping", "Throwing"],
        featured: false,
        sortOrder: 8,
        createdBy: "admin"
      },
      {
        name: "Hockey",
        description: "A team sport in which two teams play against each other by trying to maneuver a ball or a puck into the opponent's goal.",
        shortDescription: "Stick and ball team sport",
        icon: "🏑",
        rules: ["11 players per team", "Penalty system", "Offside rule"],
        equipment: ["Hockey stick", "Ball", "Goal posts", "Protective gear"],
        skills: ["Dribbling", "Passing", "Shooting", "Tackling"],
        featured: false,
        sortOrder: 9,
        createdBy: "admin"
      }
    ];

    // Insert categories
    const insertedCategories = await SportsCategory.insertMany(categories);
    
    console.log("✅ Sports categories seeded successfully!");
    console.log(`📊 Created ${insertedCategories.length} categories:`);
    
    insertedCategories.forEach(category => {
      console.log(`  - ${category.icon} ${category.name}: ${category.shortDescription}`);
    });
    
  } catch (error) {
    console.error("Error seeding sports categories:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedSportsCategories();
