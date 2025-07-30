const express = require('express');
const {
    createClass,
    getClasses,
    getClass,
    registerStudentToClass,
    getWeeklySchedule,
    updateClass,
    deleteClass
} = require('../controllers/classController');

const router = express.Router();

// Special routes first
router.get('/schedule/week', getWeeklySchedule);

router.route('/')
    .get(getClasses)
    .post(createClass);

router.route('/:id')
    .get(getClass)
    .put(updateClass)
    .delete(deleteClass);

// Registration route
router.post('/:id/register', registerStudentToClass);

module.exports = router; 