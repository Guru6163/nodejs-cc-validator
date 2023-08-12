const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// Log if MongoDB connection is successful
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Log if there's an error with MongoDB connection
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Define the user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Implement user registration (sign-up)
app.post('/signUp', async (req, res) => {
  console.log('Received a signUp request');
  try {
    const { username, password } = req.body;
    console.log('Received data:', { username, password });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Test endpoint works');
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
