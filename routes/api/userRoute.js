const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const userController = require('../../controllers/userController');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password needs to be at least 8 characters').isLength({
      min: 8,
    }),
  ],
  userController.addUser
);

module.exports = router;
