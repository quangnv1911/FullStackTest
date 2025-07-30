const Class = require('../models/Class');
const ClassRegistration = require('../models/ClassRegistration');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new class
// @route   POST /api/classes
// @access  Public
const createClass = asyncHandler(async (req, res) => {
    const { name, subject, day_of_week, time_slot, teacher_name, max_students } = req.body;

    const classDoc = await Class.create({
        name,
        subject,
        day_of_week: day_of_week.toLowerCase(),
        time_slot,
        teacher_name,
        max_students
    });

    res.status(201).json({
        success: true,
        data: classDoc
    });
});

// @desc    Get classes by day
// @route   GET /api/classes?day=monday
// @access  Public
const getClasses = asyncHandler(async (req, res) => {
    let query = {};

    if (req.query.day) {
        query.day_of_week = req.query.day.toLowerCase();
    }

    const classes = await Class.find(query).populate({
        path: 'registrations',
        populate: {
            path: 'student_id',
            model: 'Student'
        }
    });

    res.status(200).json({
        success: true,
        count: classes.length,
        data: classes
    });
});

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Public
const getClass = asyncHandler(async (req, res) => {
    const classDoc = await Class.findById(req.params.id).populate({
        path: 'registrations',
        populate: {
            path: 'student_id',
            model: 'Student',
            populate: {
                path: 'parent_id',
                model: 'Parent'
            }
        }
    });

    if (!classDoc) {
        return res.status(404).json({
            success: false,
            error: 'Class not found'
        });
    }

    res.status(200).json({
        success: true,
        data: classDoc
    });
});

// @desc    Register student to class
// @route   POST /api/classes/:id/register
// @access  Public
const registerStudentToClass = asyncHandler(async (req, res) => {
    const { student_id } = req.body;
    const class_id = req.params.id;

    // Check if class exists
    const classDoc = await Class.findById(class_id);
    if (!classDoc) {
        return res.status(404).json({
            success: false,
            error: 'Class not found'
        });
    }

    // Check if student exists
    const student = await Student.findById(student_id);
    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    // Create registration (validation is handled in the model pre-save middleware)
    const registration = await ClassRegistration.create({
        class_id,
        student_id
    });

    // Populate the registration data
    await registration.populate(['class_id', 'student_id']);

    res.status(201).json({
        success: true,
        data: registration
    });
});

// @desc    Get weekly schedule
// @route   GET /api/classes/schedule/week
// @access  Public
const getWeeklySchedule = asyncHandler(async (req, res) => {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const schedule = {};

    for (const day of daysOfWeek) {
        const classes = await Class.find({ day_of_week: day })
            .populate({
                path: 'registrations',
                populate: {
                    path: 'student_id',
                    model: 'Student'
                }
            })
            .sort('time_slot');

        schedule[day] = classes;
    }

    res.status(200).json({
        success: true,
        data: schedule
    });
});

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Public
const updateClass = asyncHandler(async (req, res) => {
    let classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
        return res.status(404).json({
            success: false,
            error: 'Class not found'
        });
    }

    // Convert day_of_week to lowercase if provided
    if (req.body.day_of_week) {
        req.body.day_of_week = req.body.day_of_week.toLowerCase();
    }

    classDoc = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: classDoc
    });
});

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Public
const deleteClass = asyncHandler(async (req, res) => {
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
        return res.status(404).json({
            success: false,
            error: 'Class not found'
        });
    }

    // Delete all registrations for this class
    await ClassRegistration.deleteMany({ class_id: req.params.id });

    await classDoc.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    createClass,
    getClasses,
    getClass,
    registerStudentToClass,
    getWeeklySchedule,
    updateClass,
    deleteClass
}; 