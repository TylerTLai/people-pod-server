const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');

const User = require('../models/User');

exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // Check if user already exists
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists.' }] });
    }

    // Get user gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send('user registered!');

  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};
