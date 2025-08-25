const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            maxlength: 200
        },
        date: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date
        },
        location: {
            type: String,
            required: true
        },
        virtual: {
            type: Boolean,
            default: false
        },
        virtualLink: {
            type: String
        },
        image: {
            type: String,
            required: true
        },
        // Sports category management
        sport: {
            type: String,
            required: true,
            enum: ["cricket", "badminton", "football", "basketball", "tennis", "swimming", "volleyball", "athletics", "hockey", "other"]
        },
        category: {
            type: String,
            required: true,
            enum: ["webinar", "showcase", "tournament", "training", "workshop", "competition", "exhibition", "other"]
        },
        // Event management
        status: {
            type: String,
            enum: ["draft", "pending", "approved", "rejected", "published", "cancelled", "completed"],
            default: "pending"
        },
        approvalNotes: {
            type: String
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        approvedAt: {
            type: Date
        },
        // Event details
        maxParticipants: {
            type: Number
        },
        currentParticipants: {
            type: Number,
            default: 0
        },
        registrationDeadline: {
            type: Date
        },
        price: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "USD"
        },
        // Organizer information
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        organizerName: {
            type: String,
            required: true
        },
        organizerEmail: {
            type: String,
            required: true
        },
        organizerPhone: {
            type: String
        },
        // Event features
        tags: [{
            type: String,
            trim: true
        }],
        highlights: [{
            type: String
        }],
        requirements: [{
            type: String
        }],
        // Registration and analytics
        registrations: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            registeredAt: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ["registered", "attended", "cancelled", "no-show"],
                default: "registered"
            },
            paymentStatus: {
                type: String,
                enum: ["pending", "paid", "refunded"],
                default: "pending"
            },
            notes: String
        }],
        // Analytics
        views: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        // Moderation
        flagged: {
            type: Boolean,
            default: false
        },
        flagReason: String,
        flaggedBy: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reason: String,
            flaggedAt: {
                type: Date,
                default: Date.now
            }
        }],
        // Timestamps
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Indexes for better performance
eventSchema.index({ sport: 1, category: 1 });
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ "registrations.user": 1 });

// Virtual for registration percentage
eventSchema.virtual('registrationPercentage').get(function() {
    if (!this.maxParticipants) return 0;
    return Math.round((this.currentParticipants / this.maxParticipants) * 100);
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
    const today = new Date();
    const eventDate = new Date(this.date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for event status based on date
eventSchema.virtual('eventStatus').get(function() {
    const today = new Date();
    const eventDate = new Date(this.date);
    
    if (this.status === 'cancelled') return 'cancelled';
    if (today > eventDate) return 'completed';
    if (today < eventDate) return 'upcoming';
    return 'today';
});

// Methods
eventSchema.methods.addRegistration = function(userId) {
    if (this.maxParticipants && this.currentParticipants >= this.maxParticipants) {
        throw new Error('Event is full');
    }
    
    const existingRegistration = this.registrations.find(
        reg => reg.user.toString() === userId.toString()
    );
    
    if (existingRegistration) {
        throw new Error('User already registered');
    }
    
    this.registrations.push({ user: userId });
    this.currentParticipants += 1;
    return this.save();
};

eventSchema.methods.removeRegistration = function(userId) {
    const registrationIndex = this.registrations.findIndex(
        reg => reg.user.toString() === userId.toString()
    );
    
    if (registrationIndex === -1) {
        throw new Error('Registration not found');
    }
    
    this.registrations.splice(registrationIndex, 1);
    this.currentParticipants = Math.max(0, this.currentParticipants - 1);
    return this.save();
};

eventSchema.methods.updateRegistrationStatus = function(userId, status) {
    const registration = this.registrations.find(
        reg => reg.user.toString() === userId.toString()
    );
    
    if (!registration) {
        throw new Error('Registration not found');
    }
    
    registration.status = status;
    return this.save();
};

// Pre-save middleware
eventSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
