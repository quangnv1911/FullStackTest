const mongoose = require('mongoose');

const classRegistrationSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Compound index to ensure one student can only register for one class once
classRegistrationSchema.index({ class_id: 1, student_id: 1 }, { unique: true });

// Pre-save middleware to check for schedule conflicts
classRegistrationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Class = mongoose.model('Class');
    const Student = mongoose.model('Student');
    
    // Get the class details
    const classDoc = await Class.findById(this.class_id);
    
    if (!classDoc) {
      return next(new Error('Class not found'));
    }
    
    // Check for time conflicts with other registrations
    const existingRegistrations = await this.constructor.find({
      student_id: this.student_id,
      status: 'active'
    }).populate('class_id');
    
    for (const registration of existingRegistrations) {
      if (registration.class_id.day_of_week === classDoc.day_of_week &&
          registration.class_id.time_slot === classDoc.time_slot) {
        return next(new Error('Student already has a class at this time slot'));
      }
    }
    
    // Check if class is full
    const currentEnrollment = await this.constructor.countDocuments({
      class_id: this.class_id,
      status: 'active'
    });
    
    if (currentEnrollment >= classDoc.max_students) {
      return next(new Error('Class is full'));
    }
  }
  
  next();
});

module.exports = mongoose.model('ClassRegistration', classRegistrationSchema); 