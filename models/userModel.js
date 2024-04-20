const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new Datastore();
        }
    }

    init() {
        const users = [
            { fullname: 'test1', email: 'test.mail', password: 'test3' }
        ];

        users.forEach((user) => {
            this.lookup(user.email, (err, foundUser) => {
                if (err) {
                    console.error('Error checking user existence:', err);
                } else if (!foundUser) {
                    // Only insert if the user does not already exist
                    this.db.insert(user, function (err) {
                        if (err) {
                            console.log('Cannot insert user:', user.fullname);
                        } else {
                            console.log('User inserted:', user.fullname);
                        }
                    });
                } else {
                    console.log('User already exists:', user.fullname);
                }
            });
        });
    }

    lookup(email, callback) {
        this.db.find({ email: email }, function (err, users) {
            if (err) {
                callback(err, null);
            } else if (users.length > 0) {
                callback(null, users[0]); // returns the first user found
            } else {
                callback(null, null); // No user found
            }
        });
    }
    // Method to create a new user
    create(fullName, email, password, callback) {
        // First, let's check if the email is already used by another user
        this.lookup(email, (err, user) => {
            if (user) {
                // User with this email already exists
                console.log('Email already in use:', email);
                return callback(new Error('Email already in use'), null);
            } else {
                // Hash the password and create the user entry
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return callback(err, null);
                    }
                    // Create the new user entry
                    const newUser = {
                        fullName: fullName,
                        email: email,
                        password: password,
                    };
                    // Insert the new user into the database
                    this.db.insert(newUser, function (err, addedUser) {
                        if (err) {
                            console.error('Cannot insert user:', email, err);
                            return callback(err, null);
                        } else {
                            console.log('New user created:', newUser);
                            callback(null, addedUser);
                        }
                    });
                });
            }
        });
    }
    

// Method to look up a user by email
lookup(email, callback) {
    this.db.find({ email: email }, function (err, users) {
        if (err) {
            callback(err, null);
        } else if (users.length > 0) {
            callback(null, users[0]); // returns the first user found
        } else {
            callback(new Error('User not found'), null);
        }
    });
}

}

const dao = new UserDAO(path.join(__dirname, 'database.db'));

dao.init();

module.exports = dao;