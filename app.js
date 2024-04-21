const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UserDAO = require('./models/userModel');
const PantryDAO = require('./models/pantryModel')
require('dotenv').config();
const session = require('express-session');
const Datastore = require('nedb');
const pantryDB = new Datastore({ filename: './models/pantryItems.db', autoload: true });
const pantryRoutes = require('./controllers/pantryRoutes');

const app = express();

app.use('/', pantryRoutes);

// Use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Should be true if you're using HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 // Sets the cookie to expire after 1 hour
    }
}));


// Set up static file serving and view engine
app.use(express.static('public'));
app.use('/css', express.static('public/styles'));
app.use('/scripts', express.static('public/scripts'));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Route to display the login form
app.get('/', (req, res) => {
    res.render('login', {
        pageTitle: 'Login',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization'
    });
});

app.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    UserDAO.lookup(email, (err, user) => {
        if (err) {
            console.error('Login error:', err);
            res.status(500).send("Internal Server Error");
        } else if (!user) {
            res.status(401).send("Invalid credentials");
        } else {
            if (password === user.password) { // Assuming plain text comparison
                req.session.email = user.email; // Setting the email in session
                res.redirect('/homepage');
            } else {
                res.status(401).send("Invalid credentials");
            }
        }
    });
});


// Route to display the registration form
app.get('/register', (req, res) => {
    res.render('register', {
        pageTitle: 'Register',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization'
    });
});

app.post('/register', (req, res) => {

    const fullName = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Before attempting to create a user, log the data to ensure it's being received correctly
    console.log('Received registration attempt:', { fullName, email });

    UserDAO.create(fullName, email, password, 'Standard', (err, newUser) => {
        if (err) {
            console.error('Error during user registration:', err);
            // Respond with a detailed error message
            // Note: In a production environment, you might want to avoid sending detailed error information to the client
            res.status(500).send(`Internal Server Error: ${err.message}`);
        } else {
            console.log('New user registered:', newUser);
            // Redirect to the home page or a success page
            res.redirect('/');
        }
    });
});

app.get('/homepage', (req, res) => {
    console.log('Session:', req.session);
    if (!req.session.email) {
        console.log('Redirecting to login because no user ID in session.');
        res.redirect('/');
    } else {
        res.render('homepage', {
            pageTitle: 'Home',
            currentYear: new Date().getFullYear(),
            organizationName: 'Your Organization',
            isHome: true
        });
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'About Us',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isAbout: true
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        pageTitle: 'Contact Us',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isContact: true
    });
});

app.get('/pantry', (req, res) => {
    if (req.session && req.session.email) {
        UserDAO.lookup(req.session.email, (err, user) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send("Internal Server Error");
            }
            if (!user) {
                console.error('User not found');
                return res.redirect('/');  // Redirect to login if user not found
            }

            // Redirect based on the user type
            switch (user.type) {
                case 'Standard':
                    res.redirect('/pantry-standard');
                    break;
                case 'Pantry':
                    res.redirect('/pantry-pantry');
                    break;
                case 'Admin':
                    res.redirect('/pantry-admin');
                    break;
                default:
                    res.redirect('/');  // Redirect to login page if user type is not recognized
                    break;
            }
        });
    } else {
        console.log("No user session found, redirecting to login.");
        res.redirect('/');
    }
});

app.get('/pantry-standard', (req, res) => {
    res.render('pantry-standard', {
        pageTitle: 'Pantry',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isAbout: true
    });
});

app.post('/submit-pantry-item', (req, res) => {
    const { itemName, weight, expDate } = req.body;
    const item = {
        name: itemName,
        weight: weight,
        sellByDate: expDate,
    };

    pantryDB.insert(item, function(err, newDoc) {
        if (err) {
            console.error('Error inserting item:', err);
            res.status(500).send('Error saving item.');
        } else {
            console.log('Item added:', newDoc);
            res.redirect('/pantry-standard');  // Redirect back to the form page or to a success page
        }
    });
});

app.get('/pantry-pantry', (req, res) => {
    res.render('pantry-pantry', {
        pageTitle: 'Pantry Management',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isPantry: true // This could be used in your template to conditionally display certain elements
    });
});

app.get('/pantry-admin', (req, res) => {
    res.render('pantry-admin', {
        pageTitle: 'Pantry Administration',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isAdmin: true // Similarly, this could be used in your template to conditionally display admin-specific elements
    });
});

app.get('/profile', (req, res) => {
    if (req.session && req.session.email) {
        UserDAO.lookup(req.session.email, (err, user) => {
            if (err) {
                console.error('Error fetching user:', err);
                res.status(500).send("Internal Server Error");
                return;
            }

            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            // Render the profile page with user data
            res.render('profile', {
                pageTitle: 'Your Profile',
                fullName: user.fullName,
                email: user.email,
                userType: user.type
            });
        });
    } else {
        // If no email in session, redirect to login page
        res.redirect('/');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy the session during logout.', err);
            return res.status(500).send("Could not log out, server error");
        }
        res.redirect('/'); // Redirect to login page
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
