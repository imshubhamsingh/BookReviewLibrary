/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var loginRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, logIn, logOut) {
    'use strict';
    var loginController = require('../controllers/loginController')(null, navUser, navNonUser, logIn, logOut);
    loginRouter.route('/')
        .all(loginController.nonUserGetLogin)
        .get(loginController.getLogin);

    return loginRouter;
};

module.exports = router;