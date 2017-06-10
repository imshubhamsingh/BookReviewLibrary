/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    twitterOauthDetails = require('../../PropertyFile.json').twitter,
    mongodb = require('mongodb').MongoClient;
module.exports = function () {
    'use strict';
    passport.use(new TwitterStrategy(twitterOauthDetails,function (accessToken, refreshToken, profile, done) {
            var url = 'mongodb://localhost:27017/libraryApp';

            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                collection.findOne({
                        oauthID: profile.id
                    },
                    function (err, results) {
                        var user = results;
                        if (!err && results !== null) {
                            done(null, user);
                        } else {
                            user = {
                                oauthID: profile.id,
                                name: profile.displayName,
                                provider: profile.provider
                            };
                            collection.insert(user, function (err, results) {
                                done(null, user);
                            });
                        }
                    }
                );
            });
        }));
};