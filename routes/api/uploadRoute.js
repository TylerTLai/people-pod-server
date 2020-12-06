const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Image = require('../../models/Image');

// Define how multer handles storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // const ext = path.extname(file.originalname);
    const { originalname } = file;
    const filePath = `/images/${originalname}`;
    Image.create({ filePath: filePath }).then(() => {
      cb(null, filePath);
    });
  },
});

const upload = multer({
  storage,
});

// Upload image(s)
router.post('/', upload.array('picture'), (req, res) => {
  res.json({ status: 200, uploaded: req.files.length });
});

module.exports = router;
