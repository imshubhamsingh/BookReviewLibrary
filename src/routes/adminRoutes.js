/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var adminRouter = express.Router();

var router = function (navUser, navNonUser, logIn, logOut) {
    'use strict';
    var bookService = require('../services/goodreadsService')();
    var adminController = require('../controllers/adminController')(bookService, navNonUser);
    adminRouter.route('/addBooks')
        .all(adminController.nonUser)
        .get(adminController.addBooks);
    adminRouter.route('/addBook')
        .all(adminController.nonUser)
        .post(adminController.addBook);
    adminRouter.route('/removeBook')
        .all(adminController.nonUser)
        .post(adminController.removeBooks);
    return adminRouter;
};

module.exports = router;