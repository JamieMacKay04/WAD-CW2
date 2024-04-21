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

    getAllUsers(callback) {
        this.db.find({}, (err, users) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, users);
            }
        });
    }

    init() {
        const users = [
            { fullname: 'test1', email: 'test.mail', password: 'test3', type: 'Standard' }
        ];

        users.forEach((user) => {
            this.lookup(user.email, (err, foundUser) => {
                if (err) {
                    console.error('Error checking user existence:', err);
                } else if (!foundUser) {
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

    create(fullName, email, password, type = 'Standard', callback) {
        this.lookup(email, (err, user) => {
            if (user) {
                console.log('Email already in use:', email);
                return callback(new Error('Email already in use'), null);
            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return callback(err, null);
                    }
                    // Ensure that the 'type' parameter is used here
                    const newUser = {
                        fullName: fullName,
                        email: email,
                        password: password,
                        type: type  // This should set the type correctly
                    };
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

    deleteById(id, callback) {
        this.db.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) {
                callback(err);
            } else if (numRemoved === 0) {
                callback(new Error('User not found'));
            } else {
                callback(null);
            }
        });
    }
    
}


const dao = new UserDAO(path.join(__dirname, 'database.db'));
dao.init();
module.exports = dao;
