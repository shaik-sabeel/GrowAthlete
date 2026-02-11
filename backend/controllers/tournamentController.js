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

// @desc    Get teams for a tournament
// @route   GET /api/tournaments/:id/teams
// @access  Private
const getTournamentTeams = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id)
    .populate('registrations.user', 'name email')
    .populate('registrations.members', 'name email');

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  // Filter registrations that are actual teams (teamSize > 1) or essentially all registrations if needed
  // The user wants to "Search existing teams", so we return all registrations that have slots
  const teams = tournament.registrations.map(reg => ({
    _id: reg._id,
    teamName: reg.teamName,
    teamSize: reg.teamSize,
    currentMembers: reg.members.length,
    slotsAvailable: reg.teamSize - reg.members.length,
    organizer: reg.user ? reg.user.name : 'Unknown',
    members: reg.members.map(m => ({ name: m.name, email: m.email })) // Return simple member info
  }));

  res.status(200).json({ success: true, count: teams.length, data: teams });
});

// @desc    Join an existing team in a tournament
// @route   POST /api/tournaments/:id/join
// @access  Private
const joinTournamentTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.body; // teamId is the registration subdocument ID
  const tournament = await Tournament.findById(req.params.id);

  if (!tournament) {
    return res.status(404).json({ success: false, message: 'Tournament not found' });
  }

  // Find the registration (team)
  const team = tournament.registrations.id(teamId);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  // Check if user is already in this team or tournament
  // (Simple check: is user in ANY registration's members or is the main user of any registration)
  const isAlreadyRegistered = tournament.registrations.some(r =>
    r.user.toString() === req.user.id || r.members.includes(req.user.id)
  );

  if (isAlreadyRegistered) {
    return res.status(400).json({ success: false, message: 'You are already registered/joined in this tournament' });
  }

  // Check capacity
  if (team.members.length >= team.teamSize) {
    return res.status(400).json({ success: false, message: 'Team is full' });
  }

  // Add user to members
  team.members.push(req.user.id);

  await tournament.save();

  res.status(200).json({ success: true, message: 'Successfully joined the team', data: team });
});

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

  // Check if already registered (as creator OR member)
  const alreadyRegistered = tournament.registrations.find(
    (r) => r.user.toString() === req.user.id || r.members.includes(req.user.id)
  );

  if (alreadyRegistered) {
    return res.status(400).json({ success: false, message: 'You are already registered/joined in a team for this tournament' });
  }

  // Check capacity
  if (tournament.registeredTeams >= tournament.maxTeams) {
    return res.status(400).json({ success: false, message: 'Tournament is full' });
  }

  console.log("DEBUG: Register Body:", req.body); // Debug log

  const { teamName, phoneNumber, email, age, gender, teamSize } = req.body;

  if (!phoneNumber || !email || !age || !gender) {
    console.log("DEBUG: Missing fields check failed");
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
    registrationDate: Date.now(),
    teamSize: teamSize || 1, // Default to 1 if not provided
    members: [req.user.id] // Add creator as first member
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
  const tournaments = await Tournament.find({
    $or: [
      { 'registrations.user': req.user.id },
      { 'registrations.members': req.user.id }
    ]
  })
    .populate('registrations.user', 'name email username')
    .populate('registrations.members', 'name email username');

  // Return tournaments with user's specific registration status
  const formattedTournaments = tournaments.map(t => {
    // Find the registration where the user is either the owner or a member
    const registration = t.registrations.find(r =>
      r.user._id.toString() === req.user.id ||
      r.members.some(m => m._id.toString() === req.user.id)
    );

    return {
      _id: t._id,
      title: t.title,
      sport: t.sport,
      location: t.location,
      dateRange: t.dateRange,
      status: t.status,
      registrationStatus: registration ? registration.status : 'Unknown',
      registrationDate: registration ? registration.registrationDate : null,
      teamName: registration ? registration.teamName : '',
      // Add member details
      members: registration ? registration.members.map(m => ({
        _id: m._id,
        name: m.name || m.username,
        email: m.email
      })) : [],
      // Add organizer details
      organizer: registration && registration.user ? {
        _id: registration.user._id,
        name: registration.user.name || registration.user.username
      } : null
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
  getUserRegistrations,
  getTournamentTeams,
  joinTournamentTeam
};