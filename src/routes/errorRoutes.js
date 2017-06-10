/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var errorRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, logIn, logOut) {
    'use strict';
    var errorController = require('../controllers/errorController')(null, navUser, navNonUser, logIn, logOut);
    errorRouter.route('/')
        .all(errorController.nonUserGetError)
        .get(errorController.getError);

    return errorRouter;
};

module.exports = router;