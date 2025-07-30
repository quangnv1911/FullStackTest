const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    day_of_week: {
        type: String,
        required: [true, 'Day of week is required'],
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    time_slot: {
        type: String,
        required: [true, 'Time slot is required'],
        trim: true,
        // Format: "HH:MM-HH:MM" e.g., "09:00-10:30"
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in format HH:MM-HH:MM']
    },
    teacher_name: {
        type: String,
        required: [true, 'Teacher name is required'],
        trim: true,
        maxlength: [100, 'Teacher name cannot be more than 100 characters']
    },
    max_students: {
        type: Number,
        required: [true, 'Maximum students is required'],
        min: [1, 'Maximum students must be at least 1'],
        max: [50, 'Maximum students cannot exceed 50']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate registrations
classSchema.virtual('registrations', {
    ref: 'ClassRegistration',
    localField: '_id',
    foreignField: 'class_id'
});

// Virtual field for current enrollment count
classSchema.virtual('currentEnrollment').get(function () {
    return this.registrations ? this.registrations.length : 0;
});

module.exports = mongoose.model('Class', classSchema); 