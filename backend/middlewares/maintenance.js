const config = require('../config');
const { verifyToken } = require('./authMiddleware');

// Maintenance middleware:
// - If maintenance is enabled, block all non-admin requests with message
// - Allows admins after token verification
module.exports = async function maintenanceMiddleware(req, res, next) {
  try {
    if (!config.maintenance.enabled) return next();

    // Let auth route and platform-settings read through to allow toggling
    if (req.path.startsWith('/api/auth')) return next();

    // Try to check if requester is admin (non-blocking if token missing)
    try {
      await new Promise((resolve) => verifyToken(req, res, resolve));
    } catch {}

    if (req.user && req.user.role === 'admin') {
      return next();
    }

    return res.status(503).json({
      error: 'SERVICE_UNAVAILABLE',
      message: config.maintenance.message || "We'll be back soon.",
    });
  } catch (e) {
    return res.status(503).json({ error: 'SERVICE_UNAVAILABLE', message: 'Maintenance mode active' });
  }
}


