const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const authController = require('../../controllers/authController');

router.get('/', auth, authController.authorizeUser);

module.exports = router;
