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
    dateRange: {
      type: String, // You could use two Date fields (startDate, endDate) for better filtering
      required: [true, 'Please add the date range (e.g., "Oct 17-21, 2024")'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Upcoming', 'Closed'], // Enforce specific status values
      default: 'Upcoming',
    },
    image: {
      type: String, // URL to the image
      default: 'https://via.placeholder.com/600x400?text=Tournament+Image',
    },
    description: {
      type: String,
      default: 'A brief description of the tournament.',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Tournament', tournamentSchema);