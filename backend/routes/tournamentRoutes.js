// backend/src/routes/tournamentRoutes.js
const express = require('express');
const {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  getUserRegistrations,
} = require('../controllers/tournamentController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Import your existing auth middleware

const router = express.Router();

// Public routes (anyone can view tournaments)
router.route('/')
  .get(getTournaments);
router.route('/my-registrations').get(verifyToken, getUserRegistrations); // Must be before /:id to avoid conflict

router.route('/:id')
  .get(getTournament);

// Protected routes (only authenticated admins can create, update, delete)
router.route('/')
  .post(verifyToken, isAdmin, createTournament);

router.route('/:id')
  .put(verifyToken, isAdmin, updateTournament)
  .delete(verifyToken, isAdmin, deleteTournament);

// Register route
router.route('/:id/register')
  .post(verifyToken, registerForTournament);

module.exports = router;