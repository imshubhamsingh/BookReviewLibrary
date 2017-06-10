/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var router = function (navUser, navNonUser, logIn, logOut) {
    'use strict';
    var bookService = require('../services/goodreadsService')();
    var bookController = require('../controllers/bookController')(bookService, navUser, navNonUser, logIn, logOut);
    bookRouter.route('/')
        .all(bookController.nonUserGetIndex)
        .get(bookController.getIndex);
    bookRouter.route('/:id')
        .all(bookController.nonUserGetById)
        .get(bookController.getById);
    return bookRouter;
};

module.exports = router;