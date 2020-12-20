const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const authRoute = require('./routes/api/authRoute');
const connectDB = require('./config/db');
const imageRoute = require('./routes/api/imageRoute');
const groupRoute = require('./routes/api/groupRoute');
const peopleRoute = require('./routes/api/peopleRoute');
const profileRoute = require('./routes/api/profileRoute');
const userRoute = require('./routes/api/userRoute');

const PORT = process.env.PORT || 5000;
const app = express();

// Connect to database
connectDB();

app.listen(PORT, (req, res) => console.log(`Server started on ${PORT}.`));
// Init middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Define Routes
app.use('/api/auth', authRoute);
app.use('/api/groups', groupRoute);
app.use('/api/images', imageRoute);
app.use('/api/people', peopleRoute);
app.use('/api/profile', profileRoute);
app.use('/api/users', userRoute);
