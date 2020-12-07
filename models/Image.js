const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'Person' },
  filePath: { type: String },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
