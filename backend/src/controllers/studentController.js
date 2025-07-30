const Student = require('../models/Student');
const Parent = require('../models/Parent');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new student
// @route   POST /api/students
// @access  Public
const createStudent = asyncHandler(async (req, res) => {
    const { name, dob, gender, current_grade, parent_id } = req.body;

    // Check if parent exists
    const parent = await Parent.findById(parent_id);
    if (!parent) {
        return res.status(404).json({
            success: false,
            error: 'Parent not found'
        });
    }

    const student = await Student.create({
        name,
        dob,
        gender,
        current_grade,
        parent_id
    });

    // Populate parent info
    await student.populate('parent_id');

    res.status(201).json({
        success: true,
        data: student
    });
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
        .populate('parent_id')
        .populate('subscriptions')
        .populate({
            path: 'classRegistrations',
            populate: {
                path: 'class_id',
                model: 'Class'
            }
        });

    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().populate('parent_id');

    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = asyncHandler(async (req, res) => {
    let student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    // If parent_id is being updated, check if new parent exists
    if (req.body.parent_id && req.body.parent_id !== student.parent_id.toString()) {
        const parent = await Parent.findById(req.body.parent_id);
        if (!parent) {
            return res.status(404).json({
                success: false,
                error: 'Parent not found'
            });
        }
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('parent_id');

    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    await student.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    createStudent,
    getStudent,
    getStudents,
    updateStudent,
    deleteStudent
}; 