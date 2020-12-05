const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const groupRoute = require('./routes/api/groupRoute');
const peopleRoute = require('./routes/api/peopleRoute');
const rootRoute = require('./routes/api/rootRoute');

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', () =>
  console.error.bind(console, 'Failed to connect to MongoDB.')
);
db.once('open', () => {
  console.log('Successfully connected to MongoDB.');
  app.listen(PORT, (req, res) => console.log(`Server started on ${PORT}.`));
});

// Init middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/groups', groupRoute);
app.use('/api/people', peopleRoute);
app.use('/api/upload', rootRoute);

app.get('/', (req, res) => {
  res.send('Thanks for using PeoplePod!');
});
