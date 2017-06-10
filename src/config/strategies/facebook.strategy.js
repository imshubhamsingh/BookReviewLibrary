var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    facebookOauthDetails = require('../../PropertyFile.json').facebook,
    mongodb = require('mongodb').MongoClient;
module.exports = function () {
    passport.use(new FacebookStrategy(facebookOauthDetails,function (accessToken, refreshToken, profile, done) {
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
        }
    ));
};