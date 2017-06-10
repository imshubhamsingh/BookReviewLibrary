/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function (navUser, navNonUser, temp, logIn, logOut) {
    'use strict';
    var authController = require('../controllers/authController')(null, navUser, navNonUser, logIn, logOut);
    authRouter.route('/signUp')
        .post(authController.getSignUp);
    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            failureRedirect: '/Login?invalid=0',
            failureflash: true

        }), function (req, res) {
            temp = 0;
            console.log(req.user);
            res.redirect('/Auth/profile');
        });
    authRouter.route('/username')
        .post(authController.getUsername);
    authRouter.route('/facebook')
        .get(passport.authenticate('facebook', function (req, res) {}));
    authRouter.route('/facebook/callback')
        .get(passport.authenticate('facebook', {
            failureRedirect: '/Login?invalid=2'

        }), function (req, res) {
            temp = 0;
            console.log(req.user);
            res.redirect('/Auth/profile');
        });
    authRouter.route('/google')
        .get(passport.authenticate('google', {
            scope: ['profile']
        }));
    authRouter.route('/google/callback')
        .get(passport.authenticate('google', {
            failureRedirect: '/Login?invalid=2'

        }), function (req, res) {
            temp = 0;
            console.log(req.user);
            res.redirect('/Auth/profile');
        });
    authRouter.route('/twitter')
        .get(passport.authenticate('twitter', function (req, res) {}));
    authRouter.route('/twitter/callback')
        .get(passport.authenticate('twitter', {
            failureRedirect: '/Login?invalid=2'

        }), function (req, res) {
            temp = 0;
            console.log(req.user);
            res.redirect('/Auth/profile');
        });
    authRouter.route('/profile')
        .all(authController.nonUser)
        .get(authController.showProfile);
    authRouter.route('/logOut')
        .get(authController.getLogOut);
    authRouter.route('/addBook')
        .all(authController.nonUser)
        .get(authController.addBook);
    authRouter.route('/Library')
        .all(authController.nonUser)
        .get(authController.addBook);

    return authRouter;
};

module.exports = router;