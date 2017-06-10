/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var errorController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var getError = function (req, res) {
        console.log('Search log error');
        res.render('404', {
            nav: navUser,
            status: logIn,
            reset: req.query.reset

        });

    };
    var nonUserGetError = function (req, res, next) {
        if (!req.user) {
            res.render('404', {
                nav: navNonUser,
                status: logOut,
                reset: req.query.reset,
                nonUser: 'login'
            });
            return;
        }
        next();
    };

    return {
        getError: getError,
        nonUserGetError: nonUserGetError
    };
};

module.exports = errorController;