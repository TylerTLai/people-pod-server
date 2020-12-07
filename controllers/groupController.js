const Group = require('../models/Group');

// Get all groups
exports.getGroups = async (req, res) => {
  try {
    const allGroups = await Group.find();
    res.json(allGroups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get favorites
exports.getFavorite = async (req, res) => {
  try {
    const group = await Group.find({ groupName: 'Favorite' });
    res.json(group);
  } catch (err) {
    console.error(err.message);
  }
};

// Get a specific group
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    // console.log('from getGroup ', group);
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add group(s)
exports.addGroup = async (req, res) => {
  const groupReq = req.body;

  // groupReq is an array of objs ex: [ { label: 'Simpsons', value: 'Simpsons' } ]

  try {
    // groupReq is an array (groups were added via the 'add person' form), so do this:
    if (Array.isArray(groupReq)) {
      if (groupReq.length !== 0) {
        // remove old group(s), only new group(s) are added.
        const newGroupObjs = groupReq.filter(
          (group) => group.__isNew__ === true
        );

        // make array of group(s) to save
        const newGroups = newGroupObjs.map((groupObj) => ({
          groupName: groupObj.value,
        }));

        // save group(s) to db
        Group.insertMany(newGroups, onInsert);

        function onInsert(err, groups) {
          if (err) {
            console.log('Could not save to db. ', err);
          } else {
            console.info('Group(s) successfully saved to db. ', groups);
            res.json(groups);
          }
        }
      } else {
        console.log('No group(s) to add.');
        res.status(400).send('No group(s) to add.');
      }
    } else {
      // groupReq is an object (a single group was added via the 'add group' button), so do this:
      if (Object.keys(groupReq).length > 0) {
        const newGroup = { groupName: Object.keys(groupReq)[0] };

        // save group to db
        Group.create(newGroup, onCreate);

        function onCreate(err, group) {
          if (err) {
            console.log('Could not save to db. ', err);
          } else {
            console.log('Group successfully saved to db. ', group);
            const groupRes = [];
            groupRes.push(group);
            res.json(groupRes);
          }
        }
      } else {
        console.log('No group to add.');
        res.status(400).send('No group to add.');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
