/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var app = express();
var faviconRouter = function (req, res) {
    'use strict';
    res.sendFile('src/views/favicon.ico', {
        root: '/home/shubham/Documents/library'
    });
};

module.exports = faviconRouter;