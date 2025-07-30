const Parent = require('../models/Parent');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new parent
// @route   POST /api/parents
// @access  Public
const createParent = asyncHandler(async (req, res) => {
    const { name, phone, email } = req.body;

    const parent = await Parent.create({
        name,
        phone,
        email
    });

    res.status(201).json({
        success: true,
        data: parent
    });
});

// @desc    Get parent by ID
// @route   GET /api/parents/:id
// @access  Public
const getParent = asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.params.id).populate('children');

    if (!parent) {
        return res.status(404).json({
            success: false,
            error: 'Parent not found'
        });
    }

    res.status(200).json({
        success: true,
        data: parent
    });
});

// @desc    Get all parents
// @route   GET /api/parents
// @access  Public
const getParents = asyncHandler(async (req, res) => {
    const parents = await Parent.find().populate('children');

    res.status(200).json({
        success: true,
        count: parents.length,
        data: parents
    });
});

// @desc    Update parent
// @route   PUT /api/parents/:id
// @access  Public
const updateParent = asyncHandler(async (req, res) => {
    let parent = await Parent.findById(req.params.id);

    if (!parent) {
        return res.status(404).json({
            success: false,
            error: 'Parent not found'
        });
    }

    parent = await Parent.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: parent
    });
});

// @desc    Delete parent
// @route   DELETE /api/parents/:id
// @access  Public
const deleteParent = asyncHandler(async (req, res) => {
    const parent = await Parent.findById(req.params.id);

    if (!parent) {
        return res.status(404).json({
            success: false,
            error: 'Parent not found'
        });
    }

    await parent.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    createParent,
    getParent,
    getParents,
    updateParent,
    deleteParent
}; 