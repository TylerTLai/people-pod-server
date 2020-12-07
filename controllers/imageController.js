const Image = require('../models/Image');

// Add image
exports.addImage = async (req, res) => {
  Image.find().then((images) => {
    return res.json(images);
  });
};

// Get image
exports.getImage = async (req, res) => {
  Image.find().then((images) => {
    console.log('what is images ', images);
    return res.json({ images });
  });
};
