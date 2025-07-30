const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Date of birth cannot be in the future'
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other']
    },
    current_grade: {
        type: String,
        required: [true, 'Current grade is required'],
        trim: true
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
        required: [true, 'Parent ID is required']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate subscriptions
studentSchema.virtual('subscriptions', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'student_id'
});

// Virtual populate class registrations
studentSchema.virtual('classRegistrations', {
    ref: 'ClassRegistration',
    localField: '_id',
    foreignField: 'student_id'
});

module.exports = mongoose.model('Student', studentSchema); 