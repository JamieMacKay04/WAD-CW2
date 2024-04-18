const express = require('express');
const mustacheExpress = require('mustache-express');

const app = express();

app.get('/', (req, res) => {
    // Pass the current page information to the template
    res.render('index', { pageTitle: 'Home', currentYear: new Date().getFullYear(), organizationName: 'Your Organization' });
  });

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });

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
        pageTitle: 'Welcome to TSPN',
        headerTitle: 'The Scottish Pantry Network',
        organizationName: 'The Scottish Pantry Network',
        welcomeMessage: 'Join us in our mission to reduce food waste and provide affordable food options.',
        howItWorksContent: 'Learn how our platform connects surplus food with those in need.',
        currentYear: new Date().getFullYear()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));