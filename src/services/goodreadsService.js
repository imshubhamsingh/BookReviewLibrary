/*jslint undef: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint es5:true*/
var http = require('http');
var xml2js = require('xml2js');
var goodReadsapi = require('../PropertyFile.json');
var parser = xml2js.Parser({
    explicitArray: false
});
var goodreadsService = function () {
    'use strict';
    var getBookById = function (id, cb) {
        var options = {
            host: 'www.goodreads.com',
            path: '/book/show/' + id + '.xml?key='+goodReadsapi.goodreadsapikey
        };
        var callback = function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                console.log(str);
                parser.parseString(str, function (err, result) {
                    cb(null, result.GoodreadsResponse.book);
                });
            });
        };

        http.request(options, callback).end();
    };
    var getBookId = function (bookTitle, bookAuthor, cb) {
        var options = {
            host: 'www.goodreads.com',
            path: '/book/title.xml?author=' + bookAuthor + '&key=LNxZkzAQGE7LDW03k1sMxw&title=' + bookTitle
        };
        var callback = function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                console.log(str);
                parser.parseString(str, function (err, result) {
                    if(result.error ==='book not found') {
                        cb(null,undefined,undefined,undefined);
                    }else {
                        cb(null, result.GoodreadsResponse.book.id, result.GoodreadsResponse.book.image_url, result.GoodreadsResponse.book.description);
                    }
                });
            });

        };
        http.request(options, callback).end();
    };

    return {
        getBookById: getBookById,
        getBookId: getBookId
    };
};
module.exports = goodreadsService;