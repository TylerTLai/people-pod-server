const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
