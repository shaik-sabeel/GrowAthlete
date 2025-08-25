const mongoose = require("mongoose");

const adBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

adBannerSchema.index({ active: 1, sortOrder: 1 });

module.exports = mongoose.model("AdBanner", adBannerSchema);


