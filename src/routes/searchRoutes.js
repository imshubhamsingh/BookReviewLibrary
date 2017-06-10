/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var searchRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, logIn, logOut) {
    'use strict';
    var bookService = require('../services/goodreadsService')();
    var searchController = require('../controllers/searchController')(bookService, navUser, navNonUser, logIn, logOut);
    searchRouter.route('/')
        .all(searchController.nonUserGetSearch)
        .get(searchController.getSearch);

    return searchRouter;
};

module.exports = router;