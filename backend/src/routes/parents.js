const express = require('express');
const {
    createParent,
    getParent,
    getParents,
    updateParent,
    deleteParent
} = require('../controllers/parentController');

const router = express.Router();

router.route('/')
    .get(getParents)
    .post(createParent);

router.route('/:id')
    .get(getParent)
    .put(updateParent)
    .delete(deleteParent);

module.exports = router; 