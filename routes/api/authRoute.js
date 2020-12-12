const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const authController = require('../../controllers/authController');

router.get('/', auth, authController.authorizeUser);
router.post(
  '/',
  [
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Password is required.').exists(),
  ],
  authController.validateUser
);

module.exports = router;
