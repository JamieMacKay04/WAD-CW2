const jwt = require('jsonwebtoken');

exports.verify = function (req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

const { verify } = require('./authMiddleware'); // Adjust the path to your middleware file

app.get('/new-entry', verify, (req, res) => {
    // Route that allows users to write a new entry in the guestbook
});

app.get('/logout', (req, res) => {
    res.clearCookie('jwt').redirect('/'); // Clears the JWT cookie and redirects to the home page
});
