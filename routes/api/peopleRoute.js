const express = require('express');
const multer = require('multer');
const router = express.Router();

const Image = require('../../models/Image');
const Person = require('../../models/Person');

const personController = require('../../controllers/personController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const ext = path.extname(file.originalname);
    // check filename to see if extension already exists.
    const newFileName = removeFileExt(originalname);
    const filePath = `/images/${newFileName}${ext}`;

    Image.create({
      filePath,
    }).then(() => {
      cb(null, filePath);
    });
  },
});

const upload = multer({ 
  storage,
});

// Add a person
router.post('/add', upload.array('picture', 5), async (req, res) => {
  try {
    console.log('form files>>> ', req.files); // form files

    const { fName, lName, note } = req.body.person;
    const group = req.body.group;
    // remove label field and change key to 'groupName'
    group.map((groupObj) => {
      delete groupObj.label;
      groupObj.groupName = groupObj.value;
      delete groupObj.value;
    });
    // get the uploaded images.
    const images = await Image.find({});
    console.log('what is images >>> ', images);
    const person = new Person({
      fName,
      lName,
      note,
      group,
      images,
    });
    await person.save();
    res.json(person);
    async function onFind(err, images) {
      if (!images) {
        res.status(404).send('Images not found.');
      } else {
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
    }
  } catch (err) {
    console.error(err);
  }
});

// Get all people
router.get('/', personController.getAll);

// Get all people by group
router.get('/group/:groupId', personController.getPeopleByGroup);

// Update a person
router.put('/update/:personId', personController.updatePerson);

// Favorite a person
router.put('/favorite/:personId', personController.favoritePerson);

// Get a person
router.get('/person/:personId', personController.getPerson);

// Delete a person
router.delete('/person/:personId', personController.deletePerson);

module.exports = router;
