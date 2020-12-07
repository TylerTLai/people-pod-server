const Group = require('../models/Group');
const Person = require('../models/Person');

// Add a person
exports.addPerson = async (req, res) => {
  const { fName, lName, note } = req.body.person;
  const group = req.body.group;

  // remove label field and change key to 'groupName'
  group.map((groupObj) => {
    delete groupObj.label;
    groupObj.groupName = groupObj.value;
    delete groupObj.value;
  });

  const person = new Person({
    fName,
    lName,
    note,
    group,
  });

  const newPerson = await person.save();
  // console.log('what is newPerson ', newPerson);

  res.json(newPerson);
};

// Get all people
exports.getAll = async (req, res) => {
  try {
    const person = await Person.find();
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all people from a specific group
exports.getPeopleByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    const people = await Person.find({ 'group.groupName': group.groupName });
    res.json(people);
  } catch (err) {
    console.error(err);
  }
};

// Update a person
exports.updatePerson = async (req, res) => {
  try {
    const { person, group, personId } = req.body;

    await Person.findById(personId, onFind);

    async function onFind(err, oldPerson) {
      if (!oldPerson) {
        res.status(404).send('Person not found.');
      } else {
        // remove label field and change key to 'groupName'
        group.map((groupObj) => {
          delete groupObj.label;
          groupObj.groupName = groupObj.value;
          delete groupObj.value;
        });

        oldPerson.fName = person.fName;
        oldPerson.lName = person.lName;
        oldPerson.note = person.note;

        // may need to re-check this group
        oldPerson.group = group;

        const updatedPerson = await oldPerson.save();
        res.json(updatedPerson);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Favorite a person
exports.favoritePerson = async (req, res) => {

  try {
    const id = req.params.personId;
    await Person.findById(id, onFind);

    async function onFind(err, person) {
      if (!person) {
        res.status(404).send('Person not found.');
      } else {
        
        const personAlreadyFaved = person.group.some(
          (el) => el.groupName === 'Favorite'
        );

        if (personAlreadyFaved) {
          person.group.shift();
          console.log(
            'Favorite has been removed from person group. ',
            person.group
          );
          person.save().then((person) => {
            res.json({
              favorited: false,
              msg: 'Person has been removed from Favorite.',
            });
          });
        } else {
          person.group.unshift({ groupName: 'Favorite' });
          person.save().then((person) => {
            console.log(
              'Favorite has been added to person group. ',
              person.group
            );
            res.json({
              favorited: true,
              msg: 'Person has been removed from Favorite.',
            });
          });
        }
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a person
exports.getPerson = async (req, res) => {
  const personId = req.params.personId;

  try {
    const person = await Person.findById(personId);

    if (!person) {
      res.status(404).json({ msg: 'Person not found.' });
    }

    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a person
exports.deletePerson = async (req, res) => {
  const personId = req.params.personId;

  console.log('from deletePerson ', personId);

  try {
    const person = await Person.findByIdAndDelete(personId);
    res
      .status(200)
      .json({ msg: 'person deleted successfully.', person: person });
    console.log('person deleted sucessfully', person);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err);
  }
};

// Get a group (maybe i can delete this now...)
exports.getGroup = async (req, res) => {
  let groupSlug = req.params.group;
  console.log('from get a group ', groupSlug);

  try {
    const person = await Person.find({ 'group.value': groupSlug });
    console.log('this is the result of find ', person);
    res.json(person);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
