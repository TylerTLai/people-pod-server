const express = require('express');
const router = express.Router();

const personController = require('../../controllers/personController');
const upload = require('../../utils/multer');

// Add a person
router.post('/add', upload.array('picture', 3), personController.addPerson);

// Get all people
router.get('/', personController.getAll);

// Get all people by group
router.get('/group/:groupId', personController.getPeopleByGroup);

// Update a person
router.put('/update/:personId', personController.updatePerson);

// Favorite a person
router.put('/favorite/:personId', personController.favoritePerson);

// Get a person
router.get('/person/:personId', personController.getPerson);

// Delete a person
router.delete('/person/:personId', personController.deletePerson);

module.exports = router;
