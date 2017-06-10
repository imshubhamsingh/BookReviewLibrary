/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    'use strict';
    passport.use(new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password1'
        },
        function (username, password, done) {
            var url = 'mongodb://localhost:27017/libraryApp';
            console.log(username);
            console.log(password);
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                collection.findOne({
                        username: username
                    },
                    function (err, results) {
                        console.log(results);
                        if (results !== null) {
                            if (results.password === password) {
                                var user = results;
                                done(null, user);
                            } else {
                                done(null, false, {
                                    message: 'Invalid Username or Password'
                                });
                            }
                        } else {
                            done(null, false);
                        }

                    }
                );
            });

        }));
};