/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var homeController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var getHome = function (req, res) {
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
    };
    var nonUserGetHome = function (req, res, next) {
        if (!req.user) {
            console.log(logIn.Text);
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');
                collection.find({}).toArray(function (err, results) {

                    res.render('home', {
                        nav: navNonUser,
                        books: results,
                        status: logIn,
                        username: req.query.username,
                        invalid: req.query.invalid
                    });
                });

            });

            return;
        }
        next();
    };

    return {
        getHome: getHome,
        nonUserGetHome: nonUserGetHome
    };
};
module.exports = homeController;