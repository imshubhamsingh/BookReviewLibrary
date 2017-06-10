/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var books = [
    {
        title: 'War and  Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tolstoy',
        bookId: 656,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        bookId: 24280,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        bookId: 2493,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'A Journey intothe Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        bookId: 32829,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'The Dark World',
        genre: 'Fantasy',
        author: 'Henry Kuttner',
        bookId: 1881716,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'The  Wind in the Willows',
        genre: 'Fantasy',
        author: 'Kenneth Grahame',
        bookId: 5659,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'Life on The Mississippi',
        genre: 'History',
        author: 'Mark Twain',
        bookId: 99152,
        user: 'Shubham_Singh',
        read: false
    },
    {
        title: 'Childhood',
        genre: 'Biography',
        author: 'Lev Nikolayevich Tolstoy',
        bookId: 2359878,
        user: 'Shubham_Singh',
        read: false
    }
];

var adminController = function (bookService, navUser) {
    'use strict';
    var nonUser = function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
            return;
        }
        next();
    };
    var addBooks = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.insertMany(books, function (err, results) {
                res.send(results);
                db.close();

            });

        });
        //  res.send('Inserting Books...');
    };
    var addBook = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            var bkName = (req.body.bookName.split(' ')).join('+');
            var authorName = (req.body.author.split(' ')).join('+');
            console.log(bkName);
            console.log(authorName);

            bookService.getBookId(bkName, authorName, function (err, bookId, image_url, description) {
                if (err) {
                    console.log('Unable to read service');
                    return;
                }
                var book = {
                    title: req.body.bookName,
                    genre: req.body.genre,
                    author: req.body.author,
                    bookId: req.body.bookId || bookId,
                    user: req.user.username || req.user.displayName,
                    image_url: image_url,
                    description: description,
                    read: false

                };

                collection.insert(book, function (err, results) {
                    res.redirect('/Auth/addbook' + '?temp=1');
                    db.close();
                });
            });
        });
    };
    var removeBooks = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            var id = new ObjectId(req.body.id);
            console.log(req.body.id);
            var temp = 1;
            collection.deleteOne({
                _id: id
            }, function (err, results) {
                res.redirect('/Auth/addBook' + '?temp=0');
                db.close();
            });

        });
    };

    return {
        addBook: addBook,
        addBooks: addBooks,
        removeBooks: removeBooks,
        nonUser: nonUser
    };
};
module.exports = adminController;