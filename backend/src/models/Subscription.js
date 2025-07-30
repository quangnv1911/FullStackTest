const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required']
    },
    package_name: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true,
        maxlength: [100, 'Package name cannot be more than 100 characters']
    },
    start_date: {
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now
    },
    end_date: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function (v) {
                return v > this.start_date;
            },
            message: 'End date must be after start date'
        }
    },
    total_sessions: {
        type: Number,
        required: [true, 'Total sessions is required'],
        min: [1, 'Total sessions must be at least 1'],
        max: [200, 'Total sessions cannot exceed 200']
    },
    used_sessions: {
        type: Number,
        default: 0,
        min: [0, 'Used sessions cannot be negative'],
        validate: {
            validator: function (v) {
                return v <= this.total_sessions;
            },
            message: 'Used sessions cannot exceed total sessions'
        }
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for remaining sessions
subscriptionSchema.virtual('remaining_sessions').get(function () {
    return this.total_sessions - this.used_sessions;
});

// Virtual field to check if subscription is active and has remaining sessions
subscriptionSchema.virtual('isUsable').get(function () {
    const now = new Date();
    return this.status === 'active' &&
        this.start_date <= now &&
        this.end_date >= now &&
        this.remaining_sessions > 0;
});

// Method to use a session
subscriptionSchema.methods.useSession = function () {
    if (!this.isUsable) {
        throw new Error('Subscription is not usable');
    }

    this.used_sessions += 1;

    // Auto-expire if all sessions are used
    if (this.used_sessions >= this.total_sessions) {
        this.status = 'expired';
    }

    return this.save();
};

// Pre-save middleware to check expiration
subscriptionSchema.pre('save', function (next) {
    const now = new Date();

    if (this.end_date < now && this.status === 'active') {
        this.status = 'expired';
    }

    next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 