const multer = require('multer');
const path = require('path');

const removeFileExt = require('./removeFileExt');
const Image = require('../models/Image');
const Person = require('../models/Person');

// Define how multer handles storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: async (req, file, cb) => {
    const { originalname } = file;
    const ext = path.extname(file.originalname);
    // check filename to see if extension already exists.
    const newFileName = removeFileExt(originalname);
    const filePath = `/images/${newFileName}${ext}`;
    const images = [];
    images.push({ filePath: filePath });

    await Image.create({
      filePath,
    });

    //     [
    //   { _id: 5fd4d1c3027c6b0c8fa855ea, filePath: '/images/1.png', __v: 0 }
    // ]

    await Person.create({
      fName: '',
      lName: '',
      images: images,
    });

    let callback = function () {
      cb(null, filePath);
    };

    callback();

    // Image.create({
    //   filePath,
    // }).then(() => {
    //   cb(null, filePath);
    // });

    // Person.create({
    //   images: filePath,
    // });

    // console.log('req.file >>> ', req.file);
    // console.log('req.files >>> ', req.files);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

module.exports = upload;
