const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const profileController = require('../../controllers/profileController');

router.get('/me', auth, profileController.getProfile);
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required.').not().isEmpty(),
      check('email', 'Email is required.').not().isEmpty(),
    ],
  ],
  profileController.updateProfile
);

module.exports = router;
