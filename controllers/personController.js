const { v4: uuidv4 } = require('uuid');

const Group = require('../models/Group');
const Image = require('../models/Image');
const Person = require('../models/Person');

// Add a person
exports.addPerson = async (req, res) => {
  // console.log('perconController req.body >>> ', req.body);
  console.log('perconController req.files >>> ', req.files);

  try {
    let filePath = '';
    // Handle image(s)

    // Handle no images selected.
    if (!req.files || Object.keys(req.files).length === 0) {
      // Handle text fields
      const { fName, lName, groupsJSON, note } = req.body;
      const group = JSON.parse(groupsJSON);
      const image = ""

      // Handle no group selected.
      if (group.length === 0) {
        group.push({ groupName: 'everyone' });
      }

      let imageArr = [];
      imageArr.push(filePath + image);
      let images = imageArr.map((image) => ({ filePath: image }));

      const person = new Person({
        fName,
        lName,
        note,
        group,
        images,
      });

      await person.save();
      res.json(person);
    }

    const singleUpload = !Array.isArray(req.files.picture);

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

      let imageArr = [];
      imageArr.push(filePath);
      let images = imageArr.map((image) => ({ filePath: image }));

      // Handle text fields
      const { fName, lName, groupsJSON, note } = req.body;
      const group = JSON.parse(groupsJSON);

      // Handle no group selected.
      if (group.length === 0) {
        group.push({ groupName: 'everyone' });
      }

      const person = new Person({
        fName,
        lName,
        note,
        group,
        images,
      });

      await person.save();
      res.json(person);
    } else {
      const pictures = req.files.picture;
      let imageArr = [];

      pictures.forEach((pic) => {
        filePath = 'uploads/images/' + uuidv4() + pic.name;
        imageArr.push(filePath);

        pic.mv(filePath, (err) => {
          if (err) return res.status(500).send(err);
        });

        Image.create({
          filePath,
        }).then((imageDoc) => {
          console.log('Images filePaths saved to db ', imageDoc.filePath);
        });
      });

      let images = imageArr.map((image) => ({ filePath: image }));

      // Handle text fields
      const { fName, lName, groupsJSON, note } = req.body;
      const group = JSON.parse(groupsJSON);

      // Handle no group selected.
      if (group.length === 0) {
        group.push({ groupName: 'everyone' });
      }

      const person = new Person({
        fName,
        lName,
        note,
        group,
        images,
      });

      await person.save();
      res.json(person);
    }
  } catch (err) {
    console.error(err);
  }
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

    return res.json(person);
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
