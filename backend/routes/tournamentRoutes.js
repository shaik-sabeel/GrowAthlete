// backend/src/routes/tournamentRoutes.js
const express = require('express');
const {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
} = require('../controllers/tournamentController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware'); // Import your existing auth middleware

const router = express.Router();

// Public routes (anyone can view tournaments)
router.route('/')
  .get(getTournaments);

router.route('/:id')
  .get(getTournament);

// Protected routes (only authenticated admins can create, update, delete)
router.route('/')
  .post(verifyToken, isAdmin, createTournament);

router.route('/:id')
  .put(verifyToken, isAdmin, updateTournament)
  .delete(verifyToken, isAdmin, deleteTournament);

module.exports = router;