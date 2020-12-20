const Image = require('../models/Image');
const { v4: uuidv4 } = require('uuid');

// Add image
exports.addImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files were uploaded.');
    return res.status(400).send('No files were uploaded.');
  }

  try {
    const singleUpload = !Array.isArray(req.files.picture);
    let filePath = '';

    if (singleUpload) {
      const picture = req.files.picture;

      filePath = 'uploads/images/' + uuidv4() + picture.name;

      picture.mv(filePath, (err) => {
        if (err) return res.status(500).send(err);
      });

      Image.create({
        filePath,
      }).then((imageDoc) => {
        console.log('Images filePaths saved to db ', imageDoc.filePath);
      });
    } else {
      const pictures = req.files.picture;

      pictures.forEach((pic) => {
        filePath = 'uploads/images/' + uuidv4() + pic.name;

        pic.mv(filePath, (err) => {
          if (err) return res.status(500).send(err);
        });

        Image.create({
          filePath,
        }).then((imageDoc) => {
          console.log('Images filePaths saved to db ', imageDoc.filePath);
        });
      });
    }
    res.send('Picture(s) uploaded!');
  } catch (error) {
    console.log(error);
    res.send('error');
  }
};

// Get image
exports.getImage = async (req, res) => {
  const images = await Image.find();
  res.json({ images });
};
