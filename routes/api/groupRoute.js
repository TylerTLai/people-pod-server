const express = require('express');
const router = express.Router();

const groupController = require('../../controllers/groupController');

// Get all groups
router.get('/', groupController.getGroups);

// Get favorites
router.get('/favorite', groupController.getFavorite);

// Get a specific group
router.get('/:groupId', groupController.getGroup);

// Add a group
router.post('/add', groupController.addGroup);

module.exports = router;
