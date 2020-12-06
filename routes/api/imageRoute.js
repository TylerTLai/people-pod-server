const express = require('express');
const router = express.Router();

const Image = require('../../models/Image');
const imageController = require('../../controllers/imageController');

// Get all images
router.get('/', (req, res) => {
  Image.find().then((images) => {
    return res.json({ status: 200, images });
  });
});

module.exports = router;
