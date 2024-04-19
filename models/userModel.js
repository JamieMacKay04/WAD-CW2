const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require()

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            // persistent datastore with automatic loading
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            // in-memory datastore
            this.db = new Datastore();
        }
    }


    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
            that.db.insert(entry, function(err) {
                if (err) {
                    console.log('Can\'t insert user:', username);
                }
            });
        });
    }

    lookup(user, cb) {
        this.db.find({ 'user': user }, function(err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }
}
UserDAO = require('../models/userModel');

// Inside your POST /register route
UserDAO.create(username, password, (err, newUser) => {
    if (err) {
        // handle error, maybe the user already exists
        return res.status(400).send('Cannot create user. User may already exist.');
    }
    // User created, redirect to the login page or home page
    res.redirect('/login');
});

const dao = new UserDAO();
dao.init();

module.exports = dao;
