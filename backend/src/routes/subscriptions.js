const express = require('express');
const {
    createSubscription,
    getSubscription,
    getSubscriptions,
    useSession,
    getSubscriptionStatus,
    updateSubscription,
    deleteSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

router.route('/')
    .get(getSubscriptions)
    .post(createSubscription);

router.route('/:id')
    .get(getSubscription)
    .put(updateSubscription)
    .delete(deleteSubscription);

// Special routes
router.patch('/:id/use', useSession);
router.get('/:id/status', getSubscriptionStatus);

module.exports = router; 