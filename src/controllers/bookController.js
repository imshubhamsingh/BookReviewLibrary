/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var bookController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';

    var getIndex = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function (err, results) {

                res.render('bookListView', {
                    nav: navUser,
                    books: results,
                    status: logIn,
                    nonUser: ''
                });

            });

        });

    };
    var getById = function (req, res) {
        var id = new ObjectId(req.params.id);
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                _id: id
            }, function (err, results) {
                if (results.bookId && results.description) {
                    bookService.getBookById(results.bookId, function (err, book) {
                        results.book = book;
                        res.render('bookView', {
                            nav: navUser,
                            book: results,
                            status: logIn
                        });
                    });

                } else {
                    res.render('bookNoInfoView', {
                        nav: navUser,
                        book: results,
                        status: logIn

                    });
                }
            });

        });
    };
    var nonUserGetById = function (req, res, next) {
        if (!req.user) {
            var id = new ObjectId(req.params.id);
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');
                collection.findOne({
                    _id: id
                }, function (err, results) {
                    if (results.bookId) {
                        bookService.getBookById(results.bookId, function (err, book) {
                            results.book = book;
                            res.render('bookView', {
                                nav: navNonUser,
                                book: results,
                                status: logOut

                            });
                        });
                    } else {

                        res.render('bookNoinfoView', {
                            nav: navNonUser,
                            book: results,
                            status: logOut
                        });
                    }
                });

            });
            return;
        }
        next();
    };
    var nonUserGetIndex = function (req, res, next) {
        if (!req.user) {
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');
                collection.find({}).toArray(function (err, results) {
                    console.log(logOut.Text);
                    res.render('bookListView', {
                        nav: navNonUser,
                        books: results,
                        status: logOut,
                        nonUser: 'login'
                    });
                });

            });
            return;
        }
        next();
    };
    return {
        getIndex: getIndex,
        getById: getById,
        nonUserGetById: nonUserGetById,
        nonUserGetIndex: nonUserGetIndex
    };
};
module.exports = bookController;