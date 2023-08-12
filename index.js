const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());


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
    validatedCreditCards: [{
        cardholderName: String,
        cardNumber: String,
        expirationDate: String,
        cvv: String
    }],
});


const User = mongoose.model('User', userSchema);

// Implement user registration (sign-up)
app.post('/signUp', async (req, res) => {
    console.log('Received a signUp request');
    try {
        const { username, password } = req.body;
        console.log('Received data:', { username, password });

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Implement user sign-in
app.post('/signIn', async (req, res) => {
    console.log('Received a signIn request');
    try {
        const { username, password } = req.body;
        console.log('Received sign-in data:', { username, password });

        // Find the user by username
        const user = await User.findOne({ username });

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password is not valid, return error
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // If credentials are valid, generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        // Return the token to the client
        res.json({ token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});
app.post('/validate', async (req, res) => {
    console.log('Received a credit card validation request');
    try {
        const { token, cardholderName, cardNumber, expirationDate, cvv } = req.body;
        console.log('Received data:', { cardholderName, cardNumber, expirationDate, cvv });

        // Verify the JWT token to get the user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Find the user by user ID
        const user = await User.findById(userId);

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the credit card number already exists in the user's validatedCreditCards
        if (user.validatedCreditCards.some(card => card.cardNumber === cardNumber)) {
            return res.status(200).json({ message: 'Credit card number already exists' });
        }

        // Validate the credit card number using Luhn's algorithm
        const isCardValid = validateCreditCard(cardNumber);
        if (!isCardValid) {
            return res.status(400).json({ message: 'Invalid credit card number' });
        }

        // Store the validated credit card information in the user's document
        user.validatedCreditCards.push({
            cardholderName,
            cardNumber,
            expirationDate,
            cvv
        });
        await user.save();

        res.json({ message: 'Credit card validated and saved successfully' });
    } catch (error) {
        console.error('Error validating and saving credit card:', error);
        res.status(500).json({ message: 'Error validating and saving credit card' });
    }
});



// Function to validate a credit card number using Luhn's algorithm
function validateCreditCard(cardNumber) {
    let sum = 0;
    let double = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let num = parseInt(cardNumber.charAt(i));

        if (double) {
            num *= 2;
            if (num > 9) {
                num = (num % 10) + 1;
            }
        }

        sum += num;
        double = !double;
    }

    return sum % 10 === 0;
}


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
