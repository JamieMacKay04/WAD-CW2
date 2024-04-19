const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

// Mustache Express setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Serve static files
app.use(express.static('public')); // Simplified to serve everything under 'public'
app.use('/css', express.static('public/styles'));
app.use('/scripts', express.static('public/scripts'));


// Login route
app.get('/', (req, res) => {
    res.render('login', {
        pageTitle: 'Login',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isHome: true
    });
});

// Homepage route
app.get('/register', (req, res) => {
    res.render('register', {
        pageTitle: 'Register',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isHome: true
    });
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

});

// Homepage route
app.get('/homepage', (req, res) => {
    res.render('homepage', {
        pageTitle: 'Home',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isHome: true
    });
});

// About Page Route
app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About Us',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isAbout: true
    });
});

// Contact Page Route
app.get('/contact', (req, res) => {
    res.render('contact', {
        pageTitle: 'Contact Us',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isContact: true
    });
});

// Pantry Page Route
app.get('/pantry', (req, res) => {
    res.render('pantry', {
        pageTitle: 'Pantry',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isPantry: true
    });
});

// Profile Page Route
app.get('/profile', (req, res) => {
    res.render('profile', {
        pageTitle: 'Profile',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isProfile: true
    });
});

// This route shows the registration form
app.get('/register', (req, res) => {
    res.render('user/register', {
        pageTitle: 'Register',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
    });
});

// This route processes the registration form
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // First, let's check if the user already exists
    UserDAO.lookup(username, (err, user) => {
        if (err) {
            // Handle error case (e.g., database error)
            return res.status(500).send("Internal server error.");
        }
        if (user) {
            // User already exists
            return res.status(409).send("User already exists.");
        }

        // User doesn't exist, hash the password and create the user
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                // Handle error case (e.g., hashing failed)
                return res.status(500).send("Internal server error.");
            }

            // Create new user with hashed password
            UserDAO.create(username, hashedPassword, (err, newUser) => {
                if (err) {
                    // Handle error case (e.g., user creation failed)
                    return res.status(500).send("Internal server error.");
                }
                // User successfully created
                return res.status(201).send("User created.");
            });
        });
    });
});

const bodyParser = require('body-parser');
require('dotenv').config(); // Ensure you have a .env file at your project root

app.use(bodyParser.urlencoded({ extended: true }));

const UserDAO = require('./models/userModel'); // Adjust the path to where your userModel is located

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user already exists
    UserDAO.lookup(username, (err, user) => {
        if (user) {
            // User already exists, handle accordingly
            res.status(409).send('User already exists.');
        } else {
            // No user found, proceed to create a new user
            UserDAO.create(username, password);
            res.redirect('/login'); // Redirect to the login page after registration
        }
    });
});

app.get('/login', (req, res) => {
    res.render('user/login', {
        pageTitle: 'Login',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

