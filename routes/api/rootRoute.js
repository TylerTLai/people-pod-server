const express = require('express');
const multer = require('multer');
const router = express.Router();

// Define how multer handles storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});

const upload = multer({
  storage,
});

// Upload image
router.post('/', upload.array('picture'), (req, res) => {
  res.json({ status: 200, uploaded: req.files.length });
});

router.get('/', (req, res) => {
  res.send('file uploaded');
});

module.exports = router;
