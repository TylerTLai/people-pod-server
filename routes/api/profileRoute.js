const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const profileController = require('../../controllers/profileController');

router.get('/me', auth, profileController.getProfile);

module.exports = router;
