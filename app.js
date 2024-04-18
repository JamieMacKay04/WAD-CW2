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
// Homepage route
app.get('/', (req, res) => {
    res.render('homepage', {
        pageTitle: 'Home',
        currentYear: new Date().getFullYear(),
        organizationName: 'Your Organization',
        isHome: true // Set isHome to true for the homepage
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
