/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var passport = require('passport');

module.exports = function (app) {
    'use strict';
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    require('./strategies/local.strategy')();
    require('./strategies/facebook.strategy')();
    require('./strategies/google.strategy')();
    require('./strategies/twitter.strategy')();

};