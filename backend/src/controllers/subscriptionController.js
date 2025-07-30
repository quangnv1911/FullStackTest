const Subscription = require('../models/Subscription');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Public
const createSubscription = asyncHandler(async (req, res) => {
    const { student_id, package_name, start_date, end_date, total_sessions } = req.body;

    // Check if student exists
    const student = await Student.findById(student_id);
    if (!student) {
        return res.status(404).json({
            success: false,
            error: 'Student not found'
        });
    }

    const subscription = await Subscription.create({
        student_id,
        package_name,
        start_date: start_date || Date.now(),
        end_date,
        total_sessions
    });

    // Populate student info
    await subscription.populate('student_id');

    res.status(201).json({
        success: true,
        data: subscription
    });
});

// @desc    Get subscription by ID
// @route   GET /api/subscriptions/:id
// @access  Public
const getSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id).populate({
        path: 'student_id',
        populate: {
            path: 'parent_id',
            model: 'Parent'
        }
    });

    if (!subscription) {
        return res.status(404).json({
            success: false,
            error: 'Subscription not found'
        });
    }

    res.status(200).json({
        success: true,
        data: subscription
    });
});

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Public
const getSubscriptions = asyncHandler(async (req, res) => {
    let query = {};

    // Filter by student_id if provided
    if (req.query.student_id) {
        query.student_id = req.query.student_id;
    }

    // Filter by status if provided
    if (req.query.status) {
        query.status = req.query.status;
    }

    const subscriptions = await Subscription.find(query).populate('student_id');

    res.status(200).json({
        success: true,
        count: subscriptions.length,
        data: subscriptions
    });
});

// @desc    Use a session from subscription
// @route   PATCH /api/subscriptions/:id/use
// @access  Public
const useSession = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return res.status(404).json({
            success: false,
            error: 'Subscription not found'
        });
    }

    try {
        await subscription.useSession();

        res.status(200).json({
            success: true,
            data: subscription,
            message: 'Session used successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @desc    Get subscription status and usage
// @route   GET /api/subscriptions/:id/status
// @access  Public
const getSubscriptionStatus = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id).populate('student_id');

    if (!subscription) {
        return res.status(404).json({
            success: false,
            error: 'Subscription not found'
        });
    }

    const status = {
        subscription_id: subscription._id,
        student_name: subscription.student_id.name,
        package_name: subscription.package_name,
        status: subscription.status,
        total_sessions: subscription.total_sessions,
        used_sessions: subscription.used_sessions,
        remaining_sessions: subscription.remaining_sessions,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        is_usable: subscription.isUsable,
        days_remaining: Math.ceil((subscription.end_date - new Date()) / (1000 * 60 * 60 * 24))
    };

    res.status(200).json({
        success: true,
        data: status
    });
});

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Public
const updateSubscription = asyncHandler(async (req, res) => {
    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return res.status(404).json({
            success: false,
            error: 'Subscription not found'
        });
    }

    subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('student_id');

    res.status(200).json({
        success: true,
        data: subscription
    });
});

// @desc    Delete subscription
// @route   DELETE /api/subscriptions/:id
// @access  Public
const deleteSubscription = asyncHandler(async (req, res) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return res.status(404).json({
            success: false,
            error: 'Subscription not found'
        });
    }

    await subscription.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    createSubscription,
    getSubscription,
    getSubscriptions,
    useSession,
    getSubscriptionStatus,
    updateSubscription,
    deleteSubscription
}; 