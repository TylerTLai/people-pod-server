const express = require('express');
const router = express.Router();

const imageController = require('../../controllers/imageController');
const upload = require('../../utils/multer');

// Add image(s)
router.post('/upload', upload.array('picture'), imageController.addImage)

// Get all image(s)
router.get('/', imageController.getImage);

// Get specific images(s)
router.get('/:personId', imageController.getImage);

module.exports = router;