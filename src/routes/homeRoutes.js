/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var homeRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, temp, logIn, logOut) {
    'use strict';
    var homeController = require('../controllers/homeController')(null, navUser, navNonUser, logIn, logOut);
    homeRouter.route('/')
        .all(homeController.nonUserGetHome)
        .get(homeController.getHome);

    return homeRouter;
};

module.exports = router;