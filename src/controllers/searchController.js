/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var searchController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var collection;
    var getSearch = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            console.log(req.query.q);
            console.log(req.query.option);
            if (req.query.option === undefined) {
                res.render('search', {
                    nav: navUser,
                    books: [{}],
                    status: logIn,
                    option: req.query.option,
                    search: req.query.q,
                    nonUser: ''
                });

            }
            if (req.query.option === 'title') {
                collection = db.collection('books');
                collection.find({

                    title: {
                        $regex: req.query.q,
                        $options: '$i'
                    }
                }).toArray(function (err, results) {
                    console.log(results);
                    res.render('search', {
                        nav: navUser,
                        books: results,
                        status: logOut,
                        option: req.query.option,
                        search: req.query.q,
                        nonUser: ''
                    });

                });
            }
            if (req.query.option === 'author') {
                collection = db.collection('books');
                collection.find({

                    author: {
                        $regex: req.query.q,
                        $options: '$i'
                    }
                }).toArray(function (err, results) {
                    console.log(results);
                    res.render('search', {
                        nav: navUser,
                        books: results,
                        status: logIn,
                        option: req.query.option,
                        search: req.query.q,
                        nonUser: ''
                    });

                });
            }
        });
    };

    var nonUserGetSearch = function (req, res, next) {
        if (!req.user) {
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                console.log(req.query.q);
                console.log(req.query.option);
                if (req.query.option === undefined) {
                    res.render('search', {
                        nav: navNonUser,
                        books: [{}],
                        status: logOut,
                        option: req.query.option,
                        search: req.query.q,
                        nonUser: 'login'
                    });

                }
                if (req.query.option === 'title') {
                    collection = db.collection('books');
                    collection.find({

                        title: {
                            $regex: req.query.q,
                            $options: '$i'
                        }
                    }).toArray(function (err, results) {
                        console.log(results);
                        res.render('search', {
                            nav: navNonUser,
                            books: results,
                            status: logOut,
                            option: req.query.option,
                            search: req.query.q,
                            nonUser: 'login'
                        });

                    });
                }
                if (req.query.option === 'author') {
                    collection = db.collection('books');
                    collection.find({

                        author: {
                            $regex: req.query.q,
                            $options: '$i'
                        }
                    }).toArray(function (err, results) {
                        console.log(results);
                        res.render('search', {
                            nav: navNonUser,
                            books: results,
                            status: logOut,
                            option: req.query.option,
                            search: req.query.q,
                            nonUser: 'login'
                        });

                    });
                }
            });
            return;
        }
        next();
    };

    return {
        getSearch: getSearch,
        nonUserGetSearch: nonUserGetSearch

    };
};
module.exports = searchController;