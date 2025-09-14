const config = require('../config');

// Simple keyword-based moderation utility
function evaluateContentSeverity(text) {
  if (!text) return 0;
  const lower = String(text).toLowerCase();
  let maxSeverity = 0;
  for (const item of config.moderation.bannedKeywords || []) {
    if (!item?.keyword) continue;
    const kw = String(item.keyword).toLowerCase();
    if (lower.includes(kw)) {
      maxSeverity = Math.max(maxSeverity, Number(item.severity) || 0);
    }
  }
  return maxSeverity;
}

// Middleware to enforce content moderation rules on posting
function enforceContentModeration(options = {}) {
  return (req, res, next) => {
    const m = config.moderation;
    if (!m.autoModerationEnabled) return next();

    // Gather content text fields (common: title, content, body, message)
    const textFields = [
      req.body?.title,
      req.body?.content,
      req.body?.body,
      req.body?.message,
      req.body?.text
    ].filter(Boolean).join(' ');

    // Language and image filtering placeholders
    if (m.languageFilteringEnabled) {
      // TODO: Detect and possibly block specific languages
    }
    if (m.imageModerationEnabled && (req.file || req.files)) {
      // TODO: integrate with image safety scanner
    }

    // Keyword filtering and thresholds
    const severity = evaluateContentSeverity(textFields);
    const { autoFlag, autoRemove, reviewQueue } = m.thresholds || {};

    if (severity >= (autoRemove ?? 5)) {
      return res.status(403).json({ error: 'CONTENT_REMOVED', message: 'Content rejected due to policy violation (severity high).' });
    }

    if (severity >= (autoFlag ?? 3)) {
      // Tag request for flagging (caller can read req.moderation)
      req.moderation = { status: 'flagged', reason: 'Keyword policy', severity };
    } else if ((reviewQueue ?? 0.7) <= 1 && (reviewQueue ?? 0.7) >= 0) {
      // Use severity/5 as naive score 0..1
      const score = Math.min(1, severity / 5);
      if (score >= (reviewQueue ?? 0.7)) {
        req.moderation = { status: 'review', reason: 'Requires manual review', score };
      }
    }

    // If keyword filtering enabled, block on any banned keyword regardless of thresholds
    if (m.keywordFilteringEnabled && severity > 0) {
      return res.status(403).json({ error: 'BANNED_KEYWORD', message: 'Content contains prohibited terms.' });
    }

    next();
  };
}

module.exports = { enforceContentModeration, evaluateContentSeverity };


