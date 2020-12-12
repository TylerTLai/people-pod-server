const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const authRoute = require('./routes/api/authRoute');
const groupRoute = require('./routes/api/groupRoute');
const imageRoute = require('./routes/api/imageRoute');
const peopleRoute = require('./routes/api/peopleRoute');
const profileRoute = require('./routes/api/profileRoute');
const userRoute = require('./routes/api/userRoute');

const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();

// Connect to database
connectDB();

app.listen(PORT, (req, res) => console.log(`Server started on ${PORT}.`));
// Init middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use('/api/groups', groupRoute);
app.use('/api/people', peopleRoute);
app.use('/api/images', imageRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);

app.get('/', (req, res) => {
  res.send('Thanks for using PeoplePod!');
});
