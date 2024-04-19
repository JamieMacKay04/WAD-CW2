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

// Homepage route
app.get('/', (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

