const config = require('../config');

// Registration rules enforcement
function enforceRegistrationRules() {
  return (req, res, next) => {
    const { allowNew, inviteOnly, allowedEmailDomains } = config.registration;
    if (!allowNew) {
      return res.status(403).json({ error: 'REGISTRATIONS_DISABLED', message: 'New registrations are currently disabled.' });
    }
    if (inviteOnly) {
      const invite = req.body?.inviteCode || req.query?.inviteCode;
      if (!invite) {
        return res.status(403).json({ error: 'INVITE_REQUIRED', message: 'An invite code is required to register.' });
      }
      // TODO: validate invite code (stubbed as non-empty)
    }
    if (Array.isArray(allowedEmailDomains) && allowedEmailDomains.length > 0) {
      const email = req.body?.email || '';
      const domain = email.split('@')[1] || '';
      if (!allowedEmailDomains.includes(domain)) {
        return res.status(403).json({ error: 'EMAIL_DOMAIN_NOT_ALLOWED', message: `Email domain not allowed. Allowed: ${allowedEmailDomains.join(', ')}` });
      }
    }
    next();
  };
}

// 2FA enforcement for admin login
function enforceAdmin2FA() {
  return (req, res, next) => {
    if (!config.security.requireAdmin2FA) return next();
    const user = req.user || req.body?.user; // depends on where you attach the user
    if (user && user.role === 'admin') {
      const provided2fa = req.body?.twoFactorCode;
      if (!provided2fa) {
        return res.status(401).json({ error: 'TWO_FACTOR_REQUIRED', message: 'Two-factor authentication code is required for admin login.' });
      }
      // TODO: validate 2FA code against your 2FA provider/secret
    }
    next();
  };
}

module.exports = { enforceRegistrationRules, enforceAdmin2FA };


