const config = require('../config');

function enforceUploadConstraints() {
  return (req, res, next) => {
    // Expect multer to have populated req.file or req.files
    const files = [];
    if (req.file) files.push(req.file);
    if (Array.isArray(req.files)) files.push(...req.files);
    if (req.files && !Array.isArray(req.files)) {
      // object map
      Object.values(req.files).forEach((arr) => {
        if (Array.isArray(arr)) files.push(...arr);
      });
    }

    const maxBytes = (config.uploads.maxImageSizeMB || 2) * 1024 * 1024;
    const allowed = new Set(config.uploads.allowedMimeTypes || []);

    for (const f of files) {
      if (f.size > maxBytes) {
        return res.status(413).json({ error: 'FILE_TOO_LARGE', message: `File exceeds maximum size of ${config.uploads.maxImageSizeMB}MB.` });
      }
      if (allowed.size > 0 && !allowed.has(f.mimetype)) {
        return res.status(415).json({ error: 'UNSUPPORTED_MEDIA_TYPE', message: `Invalid file type. Allowed: ${Array.from(allowed).join(', ')}` });
      }
    }

    next();
  };
}

module.exports = { enforceUploadConstraints };


