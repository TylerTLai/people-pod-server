const Image = require('../models/Image');

// Add image
exports.addImage = async (req, res) => {
  // const images = await Image.find();
  res.send('image added to db!');
};

// Get image
exports.getImage = async (req, res) => {
  const images = await Image.find();
  res.json({ images });
};
