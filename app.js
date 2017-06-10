/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var session = require('express-session');

var navUser = [
    {
        Link: '/Books',
        Text: 'Books'
    }, {
        Link: '/Auth/addBook?temp=-1',
        Text: 'Add/Remove Book'
    }, {
        Link: '/Search',
        Text: 'Search'
    }];
var navNonUser = [
    {
        Link: '/Books',
        Text: 'Books'
    }, {
        Link: '/Search',
        Text: 'Search'
    }];
var logIn = {
    Text: 'Log Out',
    Link: '/Auth/logOut'
};
var logOut = {
    Text: 'Log In',
    Link: '/Login'
};
var temp;
var faviconRouter = require('./src/routes/faviconRoutes');
var homeRouter = require('./src/routes/homeRoutes')(navUser, navNonUser, logIn, logOut);
var loginRouter = require('./src/routes/loginRoutes')(navUser, navNonUser, logIn, logOut);
var adminRouter = require('./src/routes/adminRoutes')(navUser, navNonUser, logIn, logOut);
var authRouter = require('./src/routes/authRoutes')(navUser, navNonUser, temp, logIn, logOut);
var bookRouter = require('./src/routes/bookRoutes')(navUser, navNonUser, logIn, logOut);
var errorRouter = require('./src/routes/errorRoutes')(navUser, navNonUser, logIn, logOut);
var searchRouter = require('./src/routes/searchRoutes')(navUser, navNonUser, logIn, logOut);
var forgotPasswordRouter = require('./src/routes/forgotPasswordRoutes')(navUser, navNonUser, logIn, logOut);

var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: 'library'
}));
require('./src/config/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/favicon.ico', faviconRouter);
app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);
app.use('/Search', searchRouter);
app.use('/Login', loginRouter);
app.use('/ForgotPassword', forgotPasswordRouter);
app.use('/Error', errorRouter);
app.get('/', homeRouter);

app.listen(port, function (err) {
    'use strict';
    console.log('Running Server on Port ' + port);
});