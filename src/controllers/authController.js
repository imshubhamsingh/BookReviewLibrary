/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var authController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var saltRounds = 10;
    var getSignUp = function (req, res) {
        console.log('+++++++++++++');
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');

            var user = {
                username: req.body.userName,
                password: req.body.password1,
                email: req.body.email,
                provider: 'local'
            };
            collection.findOne({
                username: user.username
            }, function (err, result) {
                if (result) {
                    res.redirect('/Login' + '?username=0');
                    return;
                } else {
                    collection.insert(user, function (err, results) {
                        req.login(results.ops[0], function () {
                            res.redirect('/Auth/profile' + '?temp=1');
                        });
                    });
                }
            });
        });
        console.log(req.body);
    };
    var nonUser = function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
            return;
        }
        next();
    };
    var showProfile = function (req, res) {
        console.log(req.user.username);
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
                            status: logIn
                        });
                    });
                });
            });
        });
        console.log(req.user);
    };
    var getLogOut = function (req, res) {
        console.log('Logging Out');
        console.log(req.user);
        req.session.destroy(function (err) {
            console.log('Logging Out');
            console.log(req.user);
            res.redirect('/');
            console.log(req.user);
        });
        console.log(req.user);
    };
    var addBook = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function (err, results) {
                res.render('addBook', {
                    nav: navUser,
                    books: results,
                    user: req.user,
                    temp: req.query.temp,
                    status: logIn,
                });
            });
        });
    };
    var getUsername = function (req, res, next) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            console.log(req.body.id);
            var temp = 2;
            collection.findOne({
                username: req.query.username
            }, function (err, docs) {
                console.log('===================');
                console.log(docs);
                console.log('===================');
                if (!docs) {
                    collection.updateOne({
                        oauthID: req.user.oauthID
                    }, {
                        $set: {
                            username: req.query.username
                        }
                    }, function (err, results) {
                        console.log('========================');
                        if (results.matchedCount === 0) {
                            console.log(err);
                            res.status(404).send(404);
                            return;
                        }
                        console.log(results);
                        var user = req.user;
                        user.username = req.query.username;
                        req.login(user, function (err) {
                            if (err) {
                                return next(err);
                            }
                            console.log('After relogin:' + req.session.passport.user.changedField);
                            res.status(200).send(200);
                        });
                    });
                } else {
                    console.log(err);
                    res.status(404).send(404);
                    return;
                }
            });

        });
    };
    return {
        getSignUp: getSignUp,
        nonUser: nonUser,
        showProfile: showProfile,
        getLogOut: getLogOut,
        getUsername: getUsername,
        addBook: addBook
    };
};
module.exports = authController;