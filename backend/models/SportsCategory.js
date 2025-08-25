const mongoose = require("mongoose");

const sportsCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        maxlength: 100
    },
    icon: {
        type: String,
        default: "🏃" // Default emoji icon
    },
    image: {
        type: String
    },
    // Category management
    status: {
        type: String,
        enum: ["active", "inactive", "archived"],
        default: "active"
    },
    featured: {
        type: Boolean,
        default: false
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    // Sports-specific details
    rules: [{
        type: String
    }],
    equipment: [{
        type: String
    }],
    skills: [{
        type: String
    }],
    // Statistics
    eventCount: {
        type: Number,
        default: 0
    },
    userCount: {
        type: Number,
        default: 0
    },
    // SEO and metadata
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    // Timestamps
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

// Indexes
sportsCategorySchema.index({ slug: 1 });
sportsCategorySchema.index({ status: 1, sortOrder: 1 });
sportsCategorySchema.index({ featured: 1 });

// Pre-save middleware to generate slug
sportsCategorySchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    next();
});

// Virtual for full image URL
sportsCategorySchema.virtual('imageUrl').get(function() {
    if (!this.image) return null;
    return this.image.startsWith('http') ? this.image : `/uploads/sports/${this.image}`;
});

// Static method to get active categories
sportsCategorySchema.statics.getActive = function() {
    return this.find({ status: "active" }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get featured categories
sportsCategorySchema.statics.getFeatured = function() {
    return this.find({ status: "active", featured: true }).sort({ sortOrder: 1, name: 1 });
};

// Method to update event count
sportsCategorySchema.methods.updateEventCount = async function() {
    const Event = mongoose.model('Event');
    const count = await Event.countDocuments({ sport: this.name, status: { $in: ['approved', 'published'] } });
    this.eventCount = count;
    return this.save();
};

// Method to update user count
sportsCategorySchema.methods.updateUserCount = async function() {
    const User = mongoose.model('User');
    const count = await User.countDocuments({ sport: this.name, isVerified: true });
    this.userCount = count;
    return this.save();
};

const SportsCategory = mongoose.model("SportsCategory", sportsCategorySchema);

module.exports = SportsCategory;
