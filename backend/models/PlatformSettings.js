const mongoose = require("mongoose");

const platformSettingsSchema = new mongoose.Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We\'ll be back soon." },

    registration: {
      allowRegistration: { type: Boolean, default: true },
      inviteOnly: { type: Boolean, default: false },
      allowedEmailDomains: { type: [String], default: [] }
    },

    features: {
      enableCommunity: { type: Boolean, default: true },
      enableEvents: { type: Boolean, default: true },
      enableBlogs: { type: Boolean, default: true }
    },

    uploads: {
      maxImageSizeMB: { type: Number, default: 2 },
      allowedImageTypes: { type: [String], default: ["image/jpeg", "image/png", "image/webp"] }
    },

    appearance: {
      defaultTheme: { type: String, enum: ["system", "light", "dark"], default: "system" },
      accentColor: { type: String, default: "#4f46e5" }
    },

    security: {
      requireAdmin2FA: { type: Boolean, default: false }
    },

    seo: {
      siteTitle: { type: String, default: "GrowAthlete" },
      siteDescription: { type: String, default: "Discover, grow, and connect in sports." }
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformSettings", platformSettingsSchema);


