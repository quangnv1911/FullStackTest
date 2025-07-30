const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Parent name is required'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        unique: true,
        match: [/^\d{10,11}$/, 'Please provide a valid phone number']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate children
parentSchema.virtual('children', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'parent_id'
});

module.exports = mongoose.model('Parent', parentSchema); 