/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var loginController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var getLogin = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            collection.find({}, {
                _id: 0,
                password: 0,
                email: 0,
                name: 0,
                provider: 0
            }).toArray(function (err, results) {
                mongodb.connect(url, function (err, db) {
                    var collectionbook = db.collection('books');
                    collectionbook.find({}).toArray(function (err, resultsbook) {
                        res.render('loggedIn', {
                            nav: navUser,
                            books: resultsbook,
                            user: req.user,
                            username: results,
                            temp: req.query.temp,
                            reset: req.query.reset,
                            status: logIn
                        });
                    });
                });
            });

        });
    };
    var nonUserGetLogin = function (req, res, next) {
        if (!req.user) {
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                collection.find({}, {
                    _id: 0,
                    password: 0,
                    username: 0,
                    name: 0,
                    provider: 0
                }).toArray(function (err, results) {
                    console.log(logIn.Text);
                    res.render('index', {
                        nav: navNonUser,
                        email: results,
                        status: logOut,
                        username: req.query.username,
                        invalid: req.query.invalid,
                        reset: req.query.reset
                    });
                });

            });
            return;
        }
        next();
    };

    return {
        getLogin: getLogin,
        nonUserGetLogin: nonUserGetLogin
    };
};
module.exports = loginController;