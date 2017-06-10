/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var adminDetails = require('../PropertyFile.json').admin;

var forgotPasswordController = function (bookService, navUser, navNonUser, logIn, logOut) {
    'use strict';
    var nonUserforgotPass = function (req, res, next) {
        if (!req.user) {
            console.log(logIn.Text);

            res.render('forgotPassword', {
                nav: navNonUser,
                status: logIn,
                username: req.query.username,
                invalid: req.query.invalid
            });
            return;
        }
        next();
    };
    var sentmail = function (req, res) {
        async.waterfall([function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                var url = 'mongodb://localhost:27017/libraryApp';
                mongodb.connect(url, function (err, db) {
                    var collection = db.collection('users');
                    collection.updateOne({
                        email: req.query.email
                    }, {
                        $set: {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000
                        }
                    }, function (err, user) {
                        console.log('+++++++++++++++++++++++');
                        console.log(user);
                        console.log('+++++++++++++++++++++++');
                        if (user.matchedCount === 0) {
                            console.log(err);
                            res.status(404).send(404);
                            return;
                        }
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                var transporter = nodemailer.createTransport('SMTP', {
                    service: 'Gmail',
                    auth: {
                        user: adminDetails.email,
                        pass: adminDetails.password
                    }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: adminDetails.email, // sender address
                    to: req.query.email, // list of receivers
                    subject: 'Node.js Password Reset', // Subject line
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/ForgotPassword/reset/' + token + '\n' +
                        'Remember once the link is used it will expire ,if not it  will expire automatically in 1 hour ' + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n' // plaintext body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) {
                res.send(404);
            }
            res.status(200).send(200);
        });
    };
    var reset = function (req, res) {
        async.waterfall([
            function (done) {
                    var url = 'mongodb://localhost:27017/libraryApp';
                    mongodb.connect(url, function (err, db) {
                        var collection = db.collection('users');
                        collection.findOne({
                                resetPasswordToken: req.params.token,
                                resetPasswordExpires: {
                                    $gt: Date.now()
                                }
                            },
                            function (err, results) {
                                console.log(results);
                                if (!results) {
                                    return res.redirect('/Error?reset=expired');
                                }
                                res.render('forgotPassword', {
                                    nav: navNonUser,
                                    status: logIn,
                                    reset: req.query.reset,
                                    nonUser: 'login'
                                });
                            });
                    });
                }
                ],
            function (err) {
                res.redirect('/Login?reset=failure');
            });
    };
    var passwordChange = function (req, res) {
        async.waterfall([
            function (done) {
                    var url = 'mongodb://localhost:27017/libraryApp';
                    mongodb.connect(url, function (err, db) {
                        var collection = db.collection('users');
                        collection.findOne({
                                email: req.body.email,
                                resetPasswordExpires: {
                                    $gt: Date.now()
                                }
                            },
                            function (err, results) {
                                console.log(Date.now());
                                console.log(req.body.email);
                                console.log(results);
                                if (!results) {
                                    console.log('====================');
                                    return res.redirect('/Error?reset=expired');
                                }

                                collection.updateOne({
                                        email: results.email
                                    }, {
                                        $set: {
                                            password: req.body.password1,
                                            resetPasswordToken: undefined,
                                            resetPasswordExpires: undefined
                                        }
                                    },
                                    function (err, user) {
                                        console.log('+++++++++++++++++++++++');
                                        console.log(results);
                                        console.log('+++++++++++++++++++++++');
                                        done(err, results);
                                    });

                            });
                    });
                },
                function (results, done) {
                    var transporter = nodemailer.createTransport('SMTP', {
                        service: 'Gmail',
                        auth: {
                            user: 'imshubhamsingh007@gmail.com',
                            pass: 'Shubham0084'
                        }
                    });

                    var mailOptions = {
                        from: 'imshubhamsingh007@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'Nodejs password has been changed', // Subject line
                        text: 'This is a confirmation that the password for your account ' + req.body.email + ' has just been changed.\n'
                    };

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        res.redirect('/Login?reset=success');
                    });
                }
                ],
            function (err) {
                res.redirect('/Login?reset=failure');
            });
    };
    return {
        forgotpassword: nonUserforgotPass,
        sentmail: sentmail,
        reset: reset,
        passwordchange: passwordChange
    };
};

module.exports = forgotPasswordController;
