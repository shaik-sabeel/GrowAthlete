// backend/src/models/Tournament.js
const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the tournament'],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, 'Please specify the sport'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add the tournament location'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    // Keep dateRange for display if needed, or derived from start/end
    dateRange: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Upcoming', 'Closed', 'Ongoing'],
      default: 'Upcoming',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/600x400?text=Tournament+Image',
    },
    description: {
      type: String,
      default: 'A brief description of the tournament.',
    },
    entryFee: {
      type: Number,
      default: 0
    },
    prizePool: {
      type: String, // e.g., "$5000" or "Trophies"
      default: "N/A"
    },
    maxTeams: {
      type: Number,
      default: 16
    },
    registeredTeams: {
      type: Number,
      default: 0
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true // Make required after ensuring all existing data has it or handled
    },
    rules: {
      type: [String],
      default: []
    },
    schedule: {
      type: String, // Link to schedule or text description
    },
    registrations: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      teamName: {
        type: String
      },
      phoneNumber: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      registrationDate: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tournament', tournamentSchema);