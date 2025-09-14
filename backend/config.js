module.exports = {
  maintenance: {
    enabled: false,
    message: "We'll be back soon."
  },
  registration: {
    allowNew: true,
    inviteOnly: false,
    allowedEmailDomains: [] // e.g., ["example.com", "org.org"]
  },
  features: {
    community: true,
    events: true,
    blogs: true
  },
  uploads: {
    maxImageSizeMB: 2,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"]
  },
  appearance: {
    defaultTheme: "system", // system | light | dark
    accentColor: "#4f46e5"
  },
  security: {
    requireAdmin2FA: false
  },
  seo: {
    siteTitle: "GrowAthlete",
    siteDescription: "Discover, grow, and connect in sports."
  },
  moderation: {
    autoModerationEnabled: true,
    keywordFilteringEnabled: true,
    languageFilteringEnabled: false,
    imageModerationEnabled: false,
    thresholds: {
      autoFlag: 3,
      autoRemove: 5,
      reviewQueue: 0.7
    },
    bannedKeywords: [
      // { keyword: "spam", severity: 3, category: "general" }
    ]
  }
};


