/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var forgotPasswordRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, temp, logIn, logOut) {
    'use strict';
    var forgotPasswordController = require('../controllers/forgotPasswordController')(null, navUser, navNonUser, logIn, logOut);
    forgotPasswordRouter.route('/')
        .all(forgotPasswordController.forgotpassword);
    forgotPasswordRouter.route('/sentMail')
        .post(forgotPasswordController.sentmail);
    forgotPasswordRouter.route('/reset/:token')
        .get(forgotPasswordController.reset);
    forgotPasswordRouter.route('/reset')
        .post(forgotPasswordController.passwordchange);

    return forgotPasswordRouter;
};

module.exports = router;