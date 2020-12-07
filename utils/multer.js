const multer = require('multer');
const path = require('path');

const removeFileExt = require('./removeFileExt');
const Image = require('../models/Image');

// Define how multer handles storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log('req.files >>> ', req.files);
    const { originalname } = file;
    const ext = path.extname(file.originalname);
    // check filename to see if extension already exists.
    const newFileName = removeFileExt(originalname);
    const filePath = `/images/${newFileName}${ext}`;

    Image.create({
      filePath,
    }).then(() => {
      cb(null, filePath);
    });

    // const image = new Image({
    //   filePath,
    // });

    // image.save().then(() => {
    //   cb(null, filePath);
    // });
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
