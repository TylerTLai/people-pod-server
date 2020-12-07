const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  personId: { type: String },
  filePath: { type: String },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
