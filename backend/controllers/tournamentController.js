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

  // Date filtering (optional)
  if (req.query.startDate) {
    filter.startDate = { $gte: new Date(req.query.startDate) };
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
  // Basic required field check - the model also enforces this
  const { title, sport, location, startDate, endDate } = req.body;
  if (!title || !sport || !location || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Please include all required fields: title, sport, location, startDate, endDate' });
  }

  // Derive dateRange string if not provided
  let dateRange = req.body.dateRange;
  if (!dateRange) {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    dateRange = `${start} - ${end}`;
  }

  const tournament = await Tournament.create({
    ...req.body,
    dateRange,
    organizer: req.user ? req.user.id : null // Link to creator if authenticated
  });
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

  const { title, sport, location, startDate, endDate } = req.body;

  // Refine validation to check for specific required fields if they are being updated
  // For a PUT (replace), you'd want them all. For PATCH (partial), maybe not.
  // Assuming full update or essential fields check for now if provided.

  let updateData = { ...req.body };

  if (startDate && endDate && !req.body.dateRange) {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    updateData.dateRange = `${start} - ${end}`;
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

const { sendTournamentRegistrationEmail } = require('../utils/mailer');

// @desc    Register for a tournament
// @route   POST /api/tournaments/:id/register
// @access  Private
const registerForTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  // Check if tournament is open
  if (tournament.status !== 'Open' && tournament.status !== 'Upcoming') {
    return res.status(400).json({ success: false, message: `Tournament is ${tournament.status} and not accepting registrations` });
  }

  // Check if already registered
  const alreadyRegistered = tournament.registrations.find(
    (r) => r.user.toString() === req.user.id
  );

  if (alreadyRegistered) {
    return res.status(400).json({ success: false, message: 'You are already registered for this tournament' });
  }

  // Check capacity
  if (tournament.registeredTeams >= tournament.maxTeams) {
    return res.status(400).json({ success: false, message: 'Tournament is full' });
  }

  const { teamName, phoneNumber, email, age, gender } = req.body;

  if (!phoneNumber || !email || !age || !gender) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const registration = {
    user: req.user.id,
    teamName: teamName || req.user.username,
    phoneNumber,
    email,
    age,
    gender,
    status: 'Pending',
    registrationDate: Date.now()
  };

  tournament.registrations.push(registration);
  tournament.registeredTeams = tournament.registrations.length;

  await tournament.save();

  // Send confirmation email
  try {
    const userEmail = email || req.user.email;
    await sendTournamentRegistrationEmail(userEmail, req.user.username, tournament);
  } catch (emailErr) {
    console.error("Failed to send registration email:", emailErr);
    // Continue execution, don't fail the request
  }

  res.status(200).json({ success: true, message: 'Registration successful', data: tournament });
});

// @desc    Get user's registered tournaments
// @route   GET /api/tournaments/my-registrations
// @access  Private
const getUserRegistrations = asyncHandler(async (req, res) => {
  const tournaments = await Tournament.find({ 'registrations.user': req.user.id });

  // Return tournaments with user's specific registration status
  const formattedTournaments = tournaments.map(t => {
    const registration = t.registrations.find(r => r.user.toString() === req.user.id);
    return {
      _id: t._id,
      title: t.title,
      sport: t.sport,
      location: t.location,
      dateRange: t.dateRange,
      status: t.status,
      registrationStatus: registration ? registration.status : 'Unknown',
      registrationDate: registration ? registration.registrationDate : null,
      teamName: registration ? registration.teamName : ''
    };
  });

  res.status(200).json({ success: true, count: formattedTournaments.length, data: formattedTournaments });
});

module.exports = {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  getUserRegistrations
};