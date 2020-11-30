const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: String,
});

const personSchema = new Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  group: [groupSchema],
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
