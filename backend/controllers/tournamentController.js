// backend/src/controllers/tournamentController.js
const asyncHandler = require('../utils/asyncHandler');
const Tournament = require('../models/Tournament');
// const { validationResult } = require('express-validator'); // No express-validator in this example, it's used directly in the route, not a global validator

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
const getTournaments = asyncHandler(async (req, res) => {
  // Filtering
  const filter = {};
  if (req.query.sport) {
    filter.sport = { $regex: req.query.sport, $options: 'i' }; // Case-insensitive search
  }
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) { // General search across title, sport, location
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { sport: { $regex: req.query.search, $options: 'i' } },
      { location: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Sorting
  const sortBy = {};
  if (req.query.sortField && req.query.sortOrder) {
    sortBy[req.query.sortField] = req.query.sortOrder === 'desc' ? -1 : 1;
  } else {
    // Default sort by latest created (can be changed to dateRange parsing)
    sortBy.createdAt = -1;
  }

  const tournaments = await Tournament.find(filter).sort(sortBy);

  res.status(200).json({
    count: tournaments.length,
    success: true,
    data: tournaments
  });
});

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
const getTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  res.status(200).json({ success: true, data: tournament });
});

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private (Admin only)
const createTournament = asyncHandler(async (req, res) => {
  // You can add `express-validator` here for more complex validation
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ success: false, errors: errors.array() });
  // }

  // Basic required field check - the model also enforces this
  const { title, sport, location, dateRange } = req.body;
  if (!title || !sport || !location || !dateRange) {
    return res.status(400).json({ success: false, message: 'Please include all required fields: title, sport, location, dateRange' });
  }

  const tournament = await Tournament.create(req.body);
  res.status(201).json({ success: true, data: tournament });
});

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Admin only)
const updateTournament = asyncHandler(async (req, res) => {
  let tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  const { title, sport, location, dateRange, status, image, description } = req.body;
  if (!title || !sport || !location || !dateRange) { // Re-check required fields on update too
    return res.status(400).json({ success: false, message: 'Please include all required fields for update: title, sport, location, dateRange.' });
  }

  tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run model validators on update
  });

  res.status(200).json({ success: true, data: tournament });
});

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Admin only)
const deleteTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  await Tournament.deleteOne({ _id: req.params.id }); // Using deleteOne for consistency with Mongoose 6+

  res.status(200).json({ success: true, message: 'Tournament removed' });
});

module.exports = {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
};